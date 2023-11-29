import { useMutation, useQueryClient } from "@tanstack/react-query"
import { signup as signupApi } from "../../services/apiAuth"
import toast from "react-hot-toast"

export function useSignup() {
  const queryClient = useQueryClient()
  const { mutate: signup, isLoading } = useMutation({
    mutationFn: ({ email, password, fullName }) => signupApi({ email, password, fullName }),
    onSuccess: user => {
      console.log(user)
      toast.success("Signed up successfully. Check your mailbox for an account verification email in order to confirm your email address and be able to use your new account!")
      // queryClient.invalidateQueries()
      queryClient.setQueryData(["user"], user.user)
    }
  })

  return { isLoading, signup }
}
