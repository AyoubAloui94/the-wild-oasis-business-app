import Button from "../../ui/Button"
import Modal from "../../ui/Modal"
import CreateGuestForm from "./CreateGuestForm"

function AddGuest() {
  return (
    <div>
      <Modal>
        <Modal.Open opens="guest-form">
          <Button $size={"special"}>Add new guest</Button>
        </Modal.Open>
        <Modal.Window name="guest-form">
          <CreateGuestForm />
        </Modal.Window>
      </Modal>
    </div>
  )
}

export default AddGuest
