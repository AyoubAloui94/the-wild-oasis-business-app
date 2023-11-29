import styled from "styled-components"
import { useUser } from "../features/authentication/useUser"
import Spinner from "./Spinner"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"

const FullPage = styled.div`
  height: 100dvh;
  background-color: var(--color-grey-50);
  display: flex;
  align-items: center;
  justify-content: center;
`

function ProtectedRoute({ children }) {
  // load authenticated user
  const navigate = useNavigate()
  const { isLoading, isAuthenticated } = useUser()

  // if no user, redirect to /login
  useEffect(
    function () {
      if (!isAuthenticated && !isLoading) navigate("/login")
    },
    [isAuthenticated, navigate, isLoading]
  )

  // show loading spinner
  if (isLoading)
    return (
      <FullPage>
        <Spinner />
      </FullPage>
    )

  // if user, render app
  if (isAuthenticated) return children
}

export default ProtectedRoute
