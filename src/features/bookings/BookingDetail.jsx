import styled from "styled-components"

import BookingDataBox from "./BookingDataBox"
import Row from "../../ui/Row"
import Heading from "../../ui/Heading"
import Tag from "../../ui/Tag"
import ButtonGroup from "../../ui/ButtonGroup"
import Button from "../../ui/Button"
import ButtonText from "../../ui/ButtonText"

import { useMoveBack } from "../../hooks/useMoveBack"
import { useNavigate } from "react-router-dom"
import { useBooking } from "./useBooking"
import Spinner from "../../ui/Spinner"
import { useCheckout } from "../check-in-out/useCheckout"
import { useDeleteBooking } from "./useDeleteBooking"
import Modal from "../../ui/Modal"
import ConfirmDelete from "../../ui/ConfirmDelete"
import Empty from "../../ui/Empty"
import CreateBookingForm from "./CreateBookingForm"
import { useSettings } from "../settings/useSettings"

const HeadingGroup = styled.div`
  display: flex;
  gap: 2.4rem;
  align-items: center;
`

function BookingDetail() {
  const { booking, isLoading: isLoading1 } = useBooking()
  const { settings, isLoading: isLoading2 } = useSettings()
  const { checkout, isCheckingOut } = useCheckout()
  const { deleteBooking, isDeleting } = useDeleteBooking()
  const navigate = useNavigate()
  const moveBack = useMoveBack()

  if (isLoading1 || isLoading2) return <Spinner />
  if (!booking) return <Empty resourceName={"booking"} />

  const { status, id: bookingId } = booking
  const statusToTagName = {
    unconfirmed: "blue",
    "checked-in": "green",
    "checked-out": "silver"
  }

  return (
    <>
      <Row type="horizontal">
        <HeadingGroup>
          <Heading as="h1">Booking #{bookingId}</Heading>
          <Tag type={statusToTagName[status]}>{status.replace("-", " ")}</Tag>
        </HeadingGroup>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>
      <BookingDataBox booking={booking} breakfastPrice={settings.breakfastPrice} />

      <ButtonGroup>
        {status === "unconfirmed" && (
          <Button $variation="primary" onClick={() => navigate(`/checkin/${bookingId}`)}>
            Check in
          </Button>
        )}
        {status === "checked-in" && (
          <Button $variation="primary" onClick={() => checkout(bookingId)} disabled={isCheckingOut}>
            Check out
          </Button>
        )}
        <Modal>
          <Modal.Open opens={"update"}>
            <Button $variation="edit">Edit</Button>
          </Modal.Open>
          <Modal.Window name={"update"}>
            <CreateBookingForm bookingToEdit={booking} cabin={booking.cabins} />
          </Modal.Window>
        </Modal>
        <Modal>
          <Modal.Open opens={"delete"}>
            <Button $variation="danger">Delete</Button>
          </Modal.Open>
          <Modal.Window name={"delete"}>
            <ConfirmDelete resourceName={`booking #${bookingId}`} disabled={isDeleting} onConfirm={() => deleteBooking(bookingId, { onSettled: () => navigate(-1) })} />
          </Modal.Window>
        </Modal>

        <Button $variation="secondary" onClick={moveBack}>
          Back
        </Button>
      </ButtonGroup>
    </>
  )
}

export default BookingDetail
