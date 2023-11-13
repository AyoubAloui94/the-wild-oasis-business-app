import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import Account from "./pages/Account"
import Bookings from "./pages/Bookings"
import Login from "./pages/Login"
import Settings from "./pages/Settings"
import PageNotFound from "./pages/PageNotFound"
import NewUsers from "./pages/Users"
import GlobalStyles from "./styles/GlobalStyles"
import AppLayout from "./ui/AppLayout"
import Cabins from "./pages/Cabins"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { Toaster } from "react-hot-toast"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0
    }
  }
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <GlobalStyles />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<Navigate replace to="dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="account" element={<Account />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="cabins" element={<Cabins />} />
            <Route path="settings" element={<Settings />} />
            <Route path="users" element={<NewUsers />} />
            <Route path="login" element={<Login />} />
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
      <Toaster
        position="top-center"
        gutter={12}
        containerStyle={{ margin: "8px" }}
        toastOptions={{
          success: {
            duration: 3000
          },
          error: {
            duration: 5000
          },
          style: {
            fontSize: "16px",
            maxWidth: "500px",
            padding: "16px 24px",
            backgroundColor: "var(--color-grey-0)",
            color: "var(--color-grey-700)"
          }
        }}
      />
    </QueryClientProvider>
  )
}

export default App
