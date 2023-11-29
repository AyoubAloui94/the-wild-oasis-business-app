import { useMutation, useQueryClient } from "@tanstack/react-query"
import { login as loginApi } from "../../services/apiAuth"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"

export function useLogin() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const {
    mutate: login,
    isLoading: isLoggingIn,
    error
  } = useMutation({
    mutationFn: ({ email, password }) => loginApi({ email, password }),
    onSuccess: user => {
      toast.success("Logged in successfully")
      navigate("/dashboard", { replace: true })
      queryClient.setQueryData(["user"], user.user)
    },
    onError: err => toast.error("Incorrect email/password")
  })

  return { login, isLoggingIn, error }
}
