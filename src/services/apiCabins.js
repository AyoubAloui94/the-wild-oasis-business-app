import supabase from "./supabase"

export async function getCabins() {
  const { data, error } = await supabase.from("cabins").select("*")

  if (error) {
    console.log(error)
    throw new Error("Error fetching cabins.")
  }

  return data
}

export async function createCabin(newCabin) {
  const { data, error } = await supabase.from("cabins").insert([newCabin]).select()

  if (error) {
    console.log(error)
    throw new Error("Error adding cabin.")
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
