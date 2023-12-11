import supabase from "./supabase"

export async function createGuest(newGuest) {
  const { data, error } = await supabase.from("guests").insert([newGuest])

  if (error) {
    console.log(error)
    throw new Error("Guest could not be created")
  }

  return data
}

export async function getGuests() {
  const { data, error } = await supabase.from("guests").select("fullName,email,id,nationalID,nationality,bookings(id,startDate,endDate,numNights,cabinId)")

  if (error) {
    console.log(error)
    throw new Error("Error fetching guests")
  }

  return data
}

export async function deleteGuest(id) {
  // REMEMBER RLS POLICIES
  const { data, error } = await supabase.from("guests").delete().eq("id", id)

  if (error) {
    console.error(error)
    throw new Error("Booking could not be deleted")
  }
  return data
}

export async function updateGuest(guest, id) {
  const { data, error } = await supabase.from("guests").update(guest).eq("id", id).select().single()

  if (error) {
    console.log(error)
    throw new Error("Guest could not be updated")
  }

  return data
}
