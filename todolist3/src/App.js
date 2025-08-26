import React from "react";
import { Home } from "./Home";
import { Lists } from "./Lists";
import { Login } from "./Login";
import { SignUp } from "./SignUp";
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DetailList } from "./DetailList";

export default function App() {
  const [lists, setLists] = useState([]);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home lists={lists} setLists={setLists} />} />
        <Route
          path="/lists"
          element={<Lists lists={lists} setLists={setLists} />}
        />
        <Route path="/lists/:id" element={<DetailList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}
