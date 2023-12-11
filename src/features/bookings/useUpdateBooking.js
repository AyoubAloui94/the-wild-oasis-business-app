import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createBooking } from "../../services/apiBookings"
import toast from "react-hot-toast"

export function useUpdateBooking() {
  const queryClient = useQueryClient()
  const { mutate: updateBooking, isLoading: isUpdating } = useMutation({
    mutationFn: ({ data, cabin, breakfastPrice, id }) => createBooking(data, cabin, breakfastPrice, id),
    onSuccess: () => {
      toast.success("Booking updated successfully")
      queryClient.invalidateQueries(["bookings"])
    },
    onError: err => {
      console.log(err)
      toast.error(err.message)
    }
  })

  return { updateBooking, isUpdating }
}
