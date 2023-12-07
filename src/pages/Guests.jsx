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

      <GuestTable />
    </>
  )
}

export default Guests
