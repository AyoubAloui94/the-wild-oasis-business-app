import { HiOutlineBanknotes, HiOutlineBriefcase, HiOutlineCalendarDays, HiOutlineChartBar } from "react-icons/hi2"
import Stat from "./Stat"
import { formatCurrency } from "../../utils/helpers"

function Stats({ bookings, confirmedStays, numDays, cabinCount }) {
  const numBookings = bookings.length
  const totalSales = bookings.reduce((sum, cur) => sum + cur.totalPrice, 0)
  const totalCheckins = confirmedStays.length
  const occupation = confirmedStays.reduce((acc, cur) => acc + cur.numNights, 0) / (numDays * cabinCount)
  return (
    <>
      <Stat title={"Bookings"} color={"blue"} icon={<HiOutlineBriefcase />} value={numBookings} />
      <Stat title={"Sales"} color={"green"} icon={<HiOutlineBanknotes />} value={formatCurrency(totalSales)} />
      <Stat title={"Check ins"} color={"indigo"} icon={<HiOutlineCalendarDays />} value={totalCheckins} />
      <Stat title={"Occupancy rate"} color={"yellow"} icon={<HiOutlineChartBar />} value={`${Math.round(occupation * 100)}%`} />
    </>
  )
}

export default Stats
