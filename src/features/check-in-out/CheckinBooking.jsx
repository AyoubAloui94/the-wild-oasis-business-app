import styled from "styled-components"
import BookingDataBox from "../../features/bookings/BookingDataBox"

import Row from "../../ui/Row"
import Heading from "../../ui/Heading"
import ButtonGroup from "../../ui/ButtonGroup"
import Button from "../../ui/Button"
import ButtonText from "../../ui/ButtonText"

import { useMoveBack } from "../../hooks/useMoveBack"
import { useBooking } from "../bookings/useBooking"
import Spinner from "../../ui/Spinner"
import { useEffect, useState } from "react"
import Checkbox from "../../ui/Checkbox"
import { formatCurrency } from "../../utils/helpers"
import { useCheckin } from "./useCheckin"
import { useSettings } from "../settings/useSettings"

const Box = styled.div`
  /* Box */
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 2.4rem 4rem;
`

function CheckinBooking() {
  const [confirmPaid, setConfirmPaid] = useState(false)
  const [addBreakfast, setAddBreakfast] = useState(false)
  const { booking, isLoading } = useBooking()
  const { settings, isLoading: isLoadingSettings } = useSettings()

  const moveBack = useMoveBack()

  useEffect(
    function () {
      setConfirmPaid(booking?.isPaid ?? false)
    },
    [booking]
  )

  useEffect(
    function () {
      setAddBreakfast(booking?.hasBreakfast ?? false)
    },
    [booking]
  )

  const { checkin, isCheckingIn } = useCheckin()

  if (isLoading || isLoadingSettings) return <Spinner />

  const { id: bookingId, guests, cabinPrice, numGuests, hasBreakfast, numNights } = booking

  const optionalBreakfastPrice = settings.breakfastPrice * numNights * numGuests

  function handleCheckin() {
    if (!confirmPaid) return

    if (addBreakfast) {
      checkin({
        bookingId,
        breakfast: {
          totalPrice: cabinPrice + optionalBreakfastPrice,
          hasBreakfast: true,
          extrasPrice: optionalBreakfastPrice
        }
      })
    } else {
      checkin({ bookingId, breakfast: {} })
    }
  }

  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Check in booking #{bookingId}</Heading>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>

      <BookingDataBox booking={booking} />

      {!hasBreakfast && (
        <Box>
          <Checkbox
            checked={addBreakfast}
            onChange={() => {
              setAddBreakfast(breakfast => !breakfast)
              setConfirmPaid(false)
            }}
            id={"breakfast"}
          >
            Want to add breakfast for {formatCurrency(optionalBreakfastPrice)}
          </Checkbox>
        </Box>
      )}

      <Box>
        <Checkbox checked={confirmPaid} onChange={() => setConfirmPaid(confirm => !confirm)} id={"confirm"} disabled={confirmPaid}>
          Confirm that {guests.fullName} has paid the total amount of {!addBreakfast ? formatCurrency(cabinPrice) : `${formatCurrency(cabinPrice + optionalBreakfastPrice)} (${formatCurrency(cabinPrice)} + ${formatCurrency(optionalBreakfastPrice)})`}
        </Checkbox>
      </Box>

      <ButtonGroup>
        <Button onClick={handleCheckin} disabled={!confirmPaid || isCheckingIn}>
          Check in booking #{bookingId}
        </Button>
        <Button $variation="secondary" onClick={moveBack}>
          Back
        </Button>
      </ButtonGroup>
    </>
  )
}

export default CheckinBooking
