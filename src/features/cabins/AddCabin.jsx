import Button from "../../ui/Button"
import Modal from "../../ui/Modal"
import CreateCabinForm from "./CreateCabinForm"

function AddCabin() {
  return (
    <div>
      <Modal>
        <Modal.Open opens="cabin-form">
          <Button>Add new cabin</Button>
        </Modal.Open>
        <Modal.Window name="cabin-form">
          <CreateCabinForm />
        </Modal.Window>
      </Modal>
    </div>
  )
}

// function AddCabin() {
//   const [isOpenModal, setIsOpenModal] = useState(false)
//   return (
//     <div>
//       <Button onClick={() => setIsOpenModal(!isOpenModal)}>{"Add new cabin"}</Button>
//       {isOpenModal && (
//         <Modal onClose={() => setIsOpenModal(false)}>
//           <CreateCabinForm onCloseModal={() => setIsOpenModal(false)} />
//         </Modal>
//       )}
//     </div>
//   )
// }
export default AddCabin
