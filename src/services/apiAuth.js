import supabase from "./supabase"

export async function signup({ email, password, fullName }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        fullName,
        avatar: ""
      }
    }
  })

  if (error) {
    console.log(error)
    throw new Error(error.message)
  }

  return data
}

export async function login({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) {
    console.log(error)
    throw new Error(error.message)
  }

  return data
}

export async function getCurrentUser() {
  const { data: session } = await supabase.auth.getSession()

  if (!session.session) return null

  const { data, error } = await supabase.auth.getUser()

  if (error) {
    console.log(error)
    throw new Error(error.message)
  }

  return data?.user
}

export async function logout() {
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.log(error)
    throw new Error(error.message)
  }
}

export async function updateCurrentUser({ fullName, avatar, password }) {
  // update pass or fullname
  let updateData
  if (password) updateData = { password }
  if (fullName)
    updateData = {
      data: {
        fullName
      }
    }
  const { data, error } = await supabase.auth.updateUser(updateData)

  if (error) {
    console.log(error)
    throw new Error(error.message)
  }

  if (!avatar) return data
  // upload avatar
  const fileName = `avatar-${data.user.id}-${Math.random()}`

  const { error: storageError } = await supabase.storage.from("avatars").upload(fileName, avatar)

  if (storageError) {
    console.log(storageError)
    throw new Error(storageError.message)
  }

  // update avatar in user
  const { data: updatedUser, error: error2 } = await supabase.auth.updateUser({
    data: {
      avatar: `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/avatars/${fileName}`
    }
  })

  if (error2) {
    console.log(error2)
    throw new Error(error2.message)
  }

  return updatedUser
}
