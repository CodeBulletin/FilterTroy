import "./App.scss";
import Filter from "./Components/FilterPage/Filter";
import Navbar from "./Components/NavBar/Navbar";
import { Routes, Route } from "react-router-dom";
import Login from "./Login-signUp/LoginSignup";

function App() {
  return (
    <div id="main">
      <Navbar />
      <Routes>
        <Route path="/filter" element={<Filter />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<div>Home</div>} />
      </Routes>
    </div>
  );
}

export default App;
