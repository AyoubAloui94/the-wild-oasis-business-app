import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import { getBooking } from "../../services/apiBookings"

export function useBooking() {
  const { bookingId } = useParams()
  const {
    data: booking = {},
    isLoading,
    error
  } = useQuery({
    queryKey: ["bookings", bookingId],
    queryFn: () => getBooking(bookingId),
    retry: false
  })

  return { booking, isLoading, error }
}
