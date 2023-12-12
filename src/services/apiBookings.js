import { getToday, subtractDates } from "../utils/helpers"
import supabase from "./supabase"

export async function getBookings({ filter, sortBy, page, guestId = undefined }) {
  let query = supabase.from("bookings").select("id,created_at,observations,startDate,endDate,numNights,numGuests,status,totalPrice,hasBreakfast,cabins(name,id,maxCapacity,regularPrice,discount),guests(fullName,email,id)", { count: "exact" })

  if (guestId) query = query.eq("guestId", guestId)

  if (filter) query = query.eq(filter.field, filter.value)

  if (sortBy) query = query.order(sortBy.field, { ascending: sortBy.direction === "asc" })

  if (page) {
    const from = (page - 1) * import.meta.env.VITE_PAGE_NUM
    const to = page * import.meta.env.VITE_PAGE_NUM - 1
    query = query.range(from, to)
  }

  const { data, error, count } = await query

  if (error) {
    console.log(error)
    throw new Error("Bookings could not be loaded.")
  }

  return { data, count }
}

export async function getBooking(id) {
  const { data, error } = await supabase.from("bookings").select("*, cabins(*), guests(*)").eq("id", id).maybeSingle()

  if (error) {
    console.error(error)
    throw new Error("Booking not found")
  }

  return data
}

// Returns all BOOKINGS that are were created after the given date. Useful to get bookings created in the last 30 days, for example.
// date needs to be ISOstring
export async function getBookingsAfterDate(date) {
  const { data, error } = await supabase
    .from("bookings")
    .select("created_at, totalPrice, extrasPrice")
    .gte("created_at", date)
    .lte("created_at", getToday({ end: true }))

  if (error) {
    console.error(error)
    throw new Error("Bookings could not get loaded")
  }

  return data
}

// Returns all STAYS that are were created after the given date
export async function getStaysAfterDate(date) {
  const { data, error } = await supabase
    .from("bookings")
    // .select('*')
    .select("*, guests(fullName)")
    .gte("startDate", date)
    .lte("startDate", getToday())

  if (error) {
    console.error(error)
    throw new Error("Bookings could not get loaded")
  }

  return data
}

// Activity means that there is a check in or a check out today
export async function getStaysTodayActivity() {
  const { data, error } = await supabase.from("bookings").select("*, guests(fullName, nationality, countryFlag)").or(`and(status.eq.unconfirmed,startDate.eq.${getToday()}),and(status.eq.checked-in,endDate.eq.${getToday()})`).order("created_at")

  // Equivalent to this. But by querying this, we only download the data we actually need, otherwise we would need ALL bookings ever created
  // (stay.status === 'unconfirmed' && isToday(new Date(stay.startDate))) ||
  // (stay.status === 'checked-in' && isToday(new Date(stay.endDate)))

  if (error) {
    console.error(error)
    throw new Error("Bookings could not get loaded")
  }
  return data
}

export async function deleteBooking(id) {
  // REMEMBER RLS POLICIES
  const { data, error } = await supabase.from("bookings").delete().eq("id", id)

  if (error) {
    console.error(error)
    throw new Error("Booking could not be deleted")
  }
  return data
}

export async function createBooking(data, cabin, breakfastPrice, id) {
  const { dates, numGuests, hasBreakfast, observations, email } = data
  const { id: cabinId, regularPrice, discount } = cabin
  const startDate = new Date(dates[0]).toLocaleDateString("fr-CA")
  const endDate = new Date(dates[1]).toLocaleDateString("fr-CA")

  const { data: guest, error: userError } = await supabase.from("guests").select("id").eq("email", email).single()

  if (userError) {
    console.log(userError)
    throw new Error("No guest associated with that email address. Create guest first and then try again.")
  }

  if (!dates[0] || !dates[1]) throw new Error("Please provide a valid date interval")

  const numNights = subtractDates(endDate, startDate)

  if (numNights === 0) throw new Error("Stay should at least last 1 night")

  const cabinPrice = numNights * (regularPrice - discount)
  let extrasPrice

  if (!hasBreakfast) extrasPrice = 0
  if (hasBreakfast) extrasPrice = breakfastPrice * numGuests * numNights

  const totalPrice = cabinPrice + extrasPrice
  const newBooking = { startDate, endDate, numNights, numGuests, cabinPrice, extrasPrice, totalPrice, hasBreakfast, observations, guestId: guest.id, cabinId, status: "unconfirmed" }

  // const { data: createdBooking, error: bookingError } = await supabase.from("bookings").insert([newBooking]).select().single()

  let query = supabase.from("bookings")

  if (!id) query = query.insert([newBooking])
  if (id) query = query.update(newBooking).eq("id", id)

  const { data: createdBooking, error: bookingError } = await query.select().single()

  if (bookingError) {
    console.log(bookingError)
    throw new Error("Booking could not be created")
  }

  return createdBooking
}

export async function updateBooking({ id, obj }) {
  const { data, error } = await supabase.from("bookings").update(obj).eq("id", id).select().single()

  if (error) {
    console.error(error)
    throw new Error("Booking could not be updated")
  }
  return data
}
