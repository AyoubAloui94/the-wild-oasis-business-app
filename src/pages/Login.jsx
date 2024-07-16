import styled from "styled-components"
import LoginForm from "../features/authentication/LoginForm"
import Logo from "../ui/Logo"
import Heading from "../ui/Heading"
import { Link } from "react-router-dom"

const LoginLayout = styled.main`
  min-height: 100vh;
  display: grid;
  grid-template-columns: 48rem;
  align-content: center;
  justify-content: center;
  gap: 3.2rem;
  background-color: var(--color-grey-50);
`

const Disclaimer = styled.div`
  text-align: center;
  text-decoration: underline;
  text-underline-offset: 0.5rem;
  font-size: 2rem;
  transition: all 0.3s;

  &:hover {
    color: var(--color-blue-100);
  }
`

function Login() {
  return (
    <LoginLayout>
      <Logo />
      <Disclaimer>
        <Link to={"https://alouiayoub.com"} target="_blank">
          Portfolio project of Ayoub Aloui{" "}
        </Link>
      </Disclaimer>
      <Heading as="h4">Log into your account</Heading>
      <LoginForm />
    </LoginLayout>
  )
}

export default Login
