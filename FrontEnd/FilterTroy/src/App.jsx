import "./App.scss";
import Filter from "./Components/FilterPage/Filter";
import Navbar from "./Components/NavBar/Navbar";
import { Routes, Route } from "react-router-dom";
import Login from "./Components/Login-signUp/LoginSignup";
import Browse from "./Components/Browse/Browse";
import NotFoundPage from "./Components/Common/notfound";
import Profile from "./Components/Profile/Profile";
import HomePage from "./Components/HomePage/HomePage";
import NotFoundPage from "./Components/Common/notfound";

function App() {
  return (
    <div id="main">
      <Navbar />
      <Routes>
        <Route path="/filter/new" element={<Filter />} />
        <Route path="/filter/edit/:filterid" element={<Filter />} />
        <Route path="/filter/:filterid" element={<Filter />} />

        <Route path="/login" element={<Login />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;
