import React from "react";
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Lists } from "./pages/Lists";
import { DetailList } from "./pages/DetailList";
import { Login } from "./pages/Login";
import { Logout } from "./pages/Logout";
import { SignUp } from "./pages/SignUp";

export default function App() {
  const [lists, setLists] = useState([]);
  const [user, setUser] = useState({ userName: "", userPW: "" });
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home user={user} setUser={setUser} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/lists"
          element={<Lists lists={lists} setLists={setLists} />}
        />
        <Route path="/lists/:id" element={<DetailList />} />
      </Routes>
    </BrowserRouter>
  );
}
