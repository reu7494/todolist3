import React from "react";
import { Home } from "./Home";
import { Lists } from "./Lists";
import { Login } from "./Login";
import { SignUp } from "./SignUp";
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DetailList } from "./DetailList";

export default function App() {
  const [lists, setLists] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedId = localStorage.getItem("userId");
    const storedEmail = localStorage.getItem("userEmail");
    const storedUserName = localStorage.getItem("userName");

    if (storedId && storedEmail && storedUserName) {
      setUser({
        id: JSON.parse(storedId),
        email: JSON.parse(storedEmail),
        userName: JSON.parse(storedUserName),
      });
    }
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home lists={lists} setLists={setLists} />} />
        <Route
          path="/lists"
          element={<Lists lists={lists} setLists={setLists} />}
        />
        <Route path="/lists/:id" element={<DetailList />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}
