import React from "react"; 
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from "./Login/Login";
import Laundries from "./List/Laundries";
import Machines from "./Machines/LaundryDetails";
import Register from "./Login/register";
import User from "./Admin/user";

function App() { 

  return (
    <>
      <Router>
        <Routes>
                <Route path="/" element={<Login/>}></Route>
                <Route path="/Laundries" element={<Laundries/>}></Route>
                <Route path="/Machines" element={<Machines/>}></Route>
                <Route path="/laundry-details/:id" element={<Machines />} />
                <Route path="/Register" element={<Register/>}/>
                <Route path="/user" element={<User/>}/>
                </Routes>
      </Router>
    </>
  )
}

export default App
