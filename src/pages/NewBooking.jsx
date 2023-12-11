import CreateBookingForm from "../features/bookings/CreateBookingForm"
import { useCabin } from "../features/cabins/useCabin"
import Spinner from "../ui/Spinner"

function NewBooking() {
  const { cabin, isLoadingCabin } = useCabin()

  if (isLoadingCabin) return <Spinner />
  return <CreateBookingForm cabin={cabin} />
}

export default NewBooking
