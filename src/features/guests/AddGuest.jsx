import Button from "../../ui/Button"
import Modal from "../../ui/Modal"
import CreateGuestForm from "./CreateGuestForm"

function AddGuest({ isSearchParamsNeeded = true }) {
  return (
    <div>
      <Modal>
        <Modal.Open opens="guest-form">
          <Button $size={"special"} type="button">
            Add new guest
          </Button>
        </Modal.Open>
        <Modal.Window name="guest-form">
          <CreateGuestForm isSearchParamsNeeded={isSearchParamsNeeded} />
        </Modal.Window>
      </Modal>
    </div>
  )
}

export default AddGuest
