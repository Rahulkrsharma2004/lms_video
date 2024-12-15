import { Outlet } from "react-router-dom"
import { ThemeProvider } from "./components/theme-provider"
// import LMSPage from "./components/LMSPage"


function App() {

  return (
    <ThemeProvider  defaultTheme="dark" storageKey="vite-ui-theme">
    <main>
      <Outlet/>
    </main>
      {/* <LMSPage/> */}
    </ThemeProvider>

  )
}

export default App
