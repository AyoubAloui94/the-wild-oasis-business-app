import AddGuest from "../features/guests/AddGuest"
import GuestTable from "../features/guests/GuestTable"
import Heading from "../ui/Heading"
import Row from "../ui/Row"

function Guests() {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">All guests</Heading>
        {/* <BookingTableOperations /> */}
      </Row>
      <Row>
        <GuestTable />
      </Row>
      <AddGuest isSearchParamsNeeded={false} />
    </>
  )
}

export default Guests
