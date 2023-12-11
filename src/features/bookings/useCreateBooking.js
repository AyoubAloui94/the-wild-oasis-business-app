import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createBooking as createBookingApi } from "../../services/apiBookings"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"

export function useCreateBooking() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { mutate: createBooking, isLoading: isCreating } = useMutation({
    mutationFn: ({ data, cabin, breakfastPrice }) => createBookingApi(data, cabin, breakfastPrice),
    onSuccess: booking => {
      toast.success("Booking created successfully")
      console.log(booking)
      queryClient.invalidateQueries({ queryKey: ["bookings"] })
      navigate(`/bookings/${booking.id}`)
    },
    onError: err => toast.error(err.message)
  })

  return { createBooking, isCreating }
}
