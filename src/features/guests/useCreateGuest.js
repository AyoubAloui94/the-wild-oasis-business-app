import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createGuest as createGuestApi } from "../../services/apiGuests"
import toast from "react-hot-toast"

export function useCreateGuest() {
  const queryClient = useQueryClient()
  const { mutate: createGuest, isLoading: isCreating } = useMutation({
    mutationFn: createGuestApi,
    onSuccess: () => {
      toast.success("Guest created successfully")
      queryClient.invalidateQueries(["guests"])
    },
    onError: err => {
      console.log(err)
      toast.error(err.message)
    }
  })

  return { createGuest, isCreating }
}
