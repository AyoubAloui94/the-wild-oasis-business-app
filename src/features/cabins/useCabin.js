import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import { getCabin } from "../../services/apiCabins"

export function useCabin() {
  const { cabinId } = useParams()
  const {
    data: cabin,
    isLoading: isLoadingCabin,
    error
  } = useQuery({
    queryKey: ["cabin"],
    queryFn: () => getCabin(cabinId)
  })

  return { cabin, isLoadingCabin, error }
}
