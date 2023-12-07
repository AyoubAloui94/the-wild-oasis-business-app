import styled from "styled-components"
import { useCabin } from "./useCabin"
import { formatCurrency } from "../../utils/helpers"

const StyledPreview = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2.4rem 6rem;
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
`

const Detail = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: center;
`

const Img = styled.img`
  display: block;
  width: 11rem;
  aspect-ratio: 3 / 2;
  object-fit: cover;
  object-position: center;
  transform: scale(1.5) translateX(-7px);
  margin: 1.5rem 0;
  margin-left: 1.5rem;

  border-radius: 5px;
`

function CabinPreview() {
  const { cabin } = useCabin()
  const { name: cabinName, image, regularPrice, maxCapacity, discount } = cabin
  return (
    <StyledPreview>
      <Img src={image} alt={cabinName} />
      <Detail>
        <span>Cabin</span>
        <span>{cabinName}</span>
      </Detail>
      <Detail>
        <span>Capacity</span>
        <span>{maxCapacity} people</span>
      </Detail>
      <Detail>
        <span>Regular price</span>
        <span>{formatCurrency(regularPrice)}</span>
      </Detail>
      <Detail>
        <span>Discount</span>
        <span>{discount > 0 ? formatCurrency(discount) : "—"}</span>
      </Detail>
    </StyledPreview>
  )
}

export default CabinPreview
