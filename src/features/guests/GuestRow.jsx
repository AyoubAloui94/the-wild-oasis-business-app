import styled from "styled-components"
import { format, isToday } from "date-fns"

import Table from "../../ui/Table"

import { formatDistanceFromNow } from "../../utils/helpers"
import Menus from "../../ui/Menus"
import { HiArrowDownOnSquare, HiArrowUpOnSquare, HiEye, HiPencil, HiTrash } from "react-icons/hi2"
import { useNavigate, useSearchParams } from "react-router-dom"

import Modal from "../../ui/Modal"
import ConfirmDelete from "../../ui/ConfirmDelete"
import { useCabins } from "../cabins/useCabins"
import { useDeleteGuest } from "./useDeleteGuest"
import CreateGuestForm from "./CreateGuestForm"

const Cabin = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Sono";
`

const Stacked = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;

  & span:first-child {
    font-weight: 500;
  }

  & span:last-child {
    color: var(--color-grey-500);
    font-size: 1.2rem;
  }
`

const Amount = styled.div`
  font-family: "Sono";
  font-weight: 500;
`

function GuestRow({ guest = {} }) {
  const navigate = useNavigate()
  const { id, fullName, email, nationalID, bookings } = guest

  const { deleteGuest, isDeleting } = useDeleteGuest()
  const { cabins } = useCabins()

  let startDate, endDate, numNights, cabinName, bookingId

  if (bookings.length) {
    startDate = bookings[0].startDate
    endDate = bookings[0].endDate
    numNights = bookings[0].numNights
    cabinName = cabins.filter(cabin => cabin.id === bookings[0].cabinId)[0].name
    bookingId = bookings[0].id
  }

  function handleClick() {
    if (!bookings.length) return

    if (bookings.length === 1) navigate(`/bookings/${bookingId}`)
    else {
      navigate(`/bookings?guest=${id}`)
    }
  }

  return (
    <Table.Row>
      <Cabin>{fullName}</Cabin>

      <Stacked>{email}</Stacked>

      <Stacked>{nationalID}</Stacked>

      <Stacked>
        {bookings.length ? (
          <>
            <span>Cabin: {cabinName}</span>
            <span>
              {isToday(new Date(startDate)) ? "Today" : formatDistanceFromNow(startDate)} &rarr; {numNights} night stay
            </span>
            <span>
              {format(new Date(startDate), "MMM dd yyyy")} &mdash; {format(new Date(endDate), "MMM dd yyyy")}
            </span>
          </>
        ) : (
          <span>--</span>
        )}
      </Stacked>
      <div>
        <Modal>
          <Menus.Menu>
            <Menus.Toggle id={id} />
            <Menus.List id={id}>
              {bookings.length ? (
                <Menus.Button icon={<HiEye />} onClick={handleClick}>
                  {bookings.length > 1 ? "Bookings" : "Booking"}
                </Menus.Button>
              ) : (
                ""
              )}
              <Modal.Open opens={"guest-form"}>
                <Menus.Button icon={<HiPencil />}>Edit</Menus.Button>
              </Modal.Open>

              <Modal.Open opens={"delete"}>
                <Menus.Button icon={<HiTrash />}>Delete</Menus.Button>
              </Modal.Open>
            </Menus.List>

            <Modal.Window name={"guest-form"}>
              <CreateGuestForm guestToEdit={guest} />
            </Modal.Window>

            <Modal.Window name={"delete"}>
              <ConfirmDelete resourceName={fullName} disabled={isDeleting} onConfirm={() => deleteGuest(id)} />
            </Modal.Window>
          </Menus.Menu>
        </Modal>
      </div>
    </Table.Row>
  )
}

export default GuestRow
