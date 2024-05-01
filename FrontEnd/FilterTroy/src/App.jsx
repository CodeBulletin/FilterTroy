import viteLogo from '/vite.svg'
import './App.scss'
import Filter from './Components/FilterPage/Filter'
import Navbar from './Components/NavBar/Navbar'

function App() {
  return (
    <div id="main">
      <Navbar />
      <Filter />
    </div>
  )
}

export default App
