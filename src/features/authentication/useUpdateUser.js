import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateCurrentUser as updateCurrentUserApi } from "../../services/apiAuth"
import toast from "react-hot-toast"

export function useUpdateUser() {
  const queryClient = useQueryClient()
  const { isLoading: isUpdating, mutate: updateCurrentUser } = useMutation({
    mutationFn: updateCurrentUserApi,
    onSuccess: ({ user }) => {
      toast.success("Profile updated successfully")
      queryClient.setQueryData(["user"], user)
      // queryClient.invalidateQueries({ queryKey: ["user"] })
    },
    onError: err => toast.error(err.message)
  })

  return { isUpdating, updateCurrentUser }
}
