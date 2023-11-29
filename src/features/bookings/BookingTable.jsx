import BookingRow from "./BookingRow"
import Table from "../../ui/Table"
import Menus from "../../ui/Menus"
import Empty from "../../ui/Empty"
import { useBookings } from "./useBookings"
import Spinner from "../../ui/Spinner"
import Pagination from "../../ui/Pagination"
import { useEffect } from "react"
import { useSearchParams } from "react-router-dom"

function BookingTable() {
  const { bookings, isLoading, count } = useBookings()
  const [searchParams, setSearchParams] = useSearchParams()
  const currentPage = !searchParams.get("page") ? 1 : Number(searchParams.get("page"))

  useEffect(
    function () {
      if (count && Math.ceil(count / import.meta.env.VITE_PAGE_NUM) < currentPage && currentPage > 1) {
        searchParams.set("page", currentPage - 1)
        setSearchParams(searchParams)
      } else return
    },
    [count, currentPage, searchParams, setSearchParams]
  )

  if (isLoading) return <Spinner />

  if (!bookings.length) return <Empty resourceName={"bookings"} />

  return (
    <Menus>
      <Table columns="0.6fr 2fr 2.4fr 1.4fr 1fr 3.2rem">
        <Table.Header>
          <div>Cabin</div>
          <div>Guest</div>
          <div>Dates</div>
          <div>Status</div>
          <div>Amount</div>
          <div></div>
        </Table.Header>

        <Table.Body data={bookings} render={booking => <BookingRow key={booking.id} booking={booking} />} />
        <Table.Footer>
          <Pagination count={count} />
        </Table.Footer>
      </Table>
    </Menus>
  )
}

export default BookingTable
