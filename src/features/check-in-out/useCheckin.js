import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateBooking } from "../../services/apiBookings"

import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"

export function useCheckin() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { mutate: checkin, isLoading: isCheckingIn } = useMutation({
    mutationFn: ({ bookingId, breakfast }) => updateBooking(bookingId, { isPaid: true, status: "checked-in", ...breakfast }),
    onSuccess: data => {
      toast.success(`Booking #${data.id} checked in successfully`)
      queryClient.invalidateQueries({ active: true })
      navigate("/")
    },
    onError: error => {
      toast.error("There was an error checking in")
    }
  })

  return { checkin, isCheckingIn }
}
