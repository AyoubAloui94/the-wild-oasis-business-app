import Heading from "../ui/Heading"
import Row from "../ui/Row"

import CabinTable from "../features/cabins/CabinTable"

import AddCabin from "../features/cabins/AddCabin"
import CabinTableOps from "../features/cabins/CabinTableOps"

function Cabins() {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">All cabins</Heading>
        <CabinTableOps />
      </Row>
      <Row>
        <CabinTable />
      </Row>
      <AddCabin />
    </>
  )
}

export default Cabins
