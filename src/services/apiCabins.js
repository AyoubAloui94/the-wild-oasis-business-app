import supabase from "./supabase"

export async function getCabins() {
  const { data, error } = await supabase.from("cabins").select("id,created_at,discount,regularPrice,maxCapacity,name,description,image,bookings(startDate,endDate,numNights)")

  if (error) {
    console.log(error)
    throw new Error("Error fetching cabins.")
  }

  return data
}

export async function getCabin(id) {
  const { data, error } = await supabase.from("cabins").select("id,created_at,discount,regularPrice,maxCapacity,name,description,image,bookings(startDate,endDate,numNights)").eq("id", id).single()

  if (error) {
    console.log(error)
    throw new Error("Error fetching cabin")
  }

  return data
}

export async function createEditCabin(newCabin, id) {
  const hasImagePath = typeof newCabin.image === "string"
  // const hasImagePath = newCabin.image.startsWith(supabaseUrl)

  const imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll("/", "")
  const imagePath = hasImagePath ? newCabin.image : `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/cabin-images/${imageName}`
  const cabinImage = newCabin.image

  let query = supabase.from("cabins")

  if (!id) query = query.insert([{ ...newCabin, image: imagePath }])

  if (id) query = query.update({ ...newCabin, image: imagePath }).eq("id", id)

  const { data, error } = await query.select()

  if (error) {
    console.log(error)
    throw new Error("Error adding cabin.")
  }

  // upload image

  if (hasImagePath) return data

  const { error: storageError } = await supabase.storage.from("cabin-images").upload(imageName, cabinImage)
  if (storageError) {
    await supabase.from("cabins").delete().eq("id", data[0].id)
    console.log(storageError)
    throw new Error("Error uploading cabin image.")
  }

  return data
}

export async function deleteCabin(id) {
  const { error } = await supabase.from("cabins").delete().eq("id", id)

  if (error) {
    console.log(error)
    throw new Error("Cabin could not be deleted.")
  }

  return null
}
