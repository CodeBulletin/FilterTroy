import "./App.scss";
import Filter from "./Components/FilterPage/Filter";
import Navbar from "./Components/NavBar/Navbar";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  BrowserRouter,
} from "react-router-dom";

function App() {
  return (
    <div id="main">
      <Navbar />
      <Routes>
        <Route path="/filter" element={<Filter />} />
        <Route path="/" element={<div>Home</div>} />
      </Routes>
    </div>
  );
}

export default App;
