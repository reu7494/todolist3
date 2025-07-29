import React from "react";
import { Home } from "./Home";
import { Lists } from "./Lists";
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function App() {
  const [lists, setLists] = useState([]);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lists" element={<Lists />} />
      </Routes>
    </BrowserRouter>
  );
}
