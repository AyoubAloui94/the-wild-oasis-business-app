import Menus from "../../ui/Menus"
import Spinner from "../../ui/Spinner"
import Table from "../../ui/Table"
import { useCabins } from "../cabins/useCabins"
import GuestRow from "./GuestRow"
import { useGuests } from "./useGuests"

function GuestTable() {
  const { guests, isLoading } = useGuests()
  const { isLoading: isLoadingCabins } = useCabins()

  if (isLoading || isLoadingCabins) return <Spinner />

  return (
    <Menus>
      <Table columns="1.6fr 1.6fr 1fr 1fr 0.3fr">
        <Table.Header>
          <div>Full Name</div>
          <div>Email address</div>
          <div>National ID</div>
          <div>Nationality</div>
          <div></div>
        </Table.Header>
        <Table.Body data={guests} render={guest => <GuestRow guest={guest} key={guest.id} />} />
      </Table>
    </Menus>
  )
}

export default GuestTable
