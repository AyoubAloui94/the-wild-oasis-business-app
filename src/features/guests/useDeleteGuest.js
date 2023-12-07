import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteGuest as deleteGuestApi } from "../../services/apiGuests"
import toast from "react-hot-toast"

export function useDeleteGuest() {
  const queryClient = useQueryClient()
  const { mutate: deleteGuest, isLoading: isDeleting } = useMutation({
    mutationFn: deleteGuestApi,
    onSuccess: () => {
      toast.success("Guest successfully deleted")
      queryClient.invalidateQueries({ queryKey: ["guests"] })
    },
    onError: err => toast.error(err.message)
  })

  return { deleteGuest, isDeleting }
}
