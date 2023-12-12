import Button from "../../ui/Button"
import Modal from "../../ui/Modal"
import Spinner from "../../ui/Spinner"
import { useCabins } from "../cabins/useCabins"
import CreateBookingForm from "./CreateBookingForm"

function AddBooking() {
  const { isLoading, cabins } = useCabins()
  if (isLoading) return <Spinner />

  return (
    <div>
      <Modal>
        <Modal.Open opens="booking-form">
          <Button>Add new booking</Button>
        </Modal.Open>
        <Modal.Window name="booking-form">
          <CreateBookingForm cabins={cabins} />
        </Modal.Window>
      </Modal>
    </div>
  )
}

export default AddBooking
