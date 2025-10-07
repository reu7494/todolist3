import React from "react";
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Lists } from "./pages/Lists";
import { DetailList } from "./pages/DetailList";
import { Login } from "./pages/Login";
import { SignUp } from "./pages/SignUp";
import { SignOut } from "./pages/SignOut";

export default function App() {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({
    userName: "",
    isLoggedIn: false,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userName = localStorage.getItem("userName");
    if (token && userName) {
      // 토큰 유효성 검증
      setUser({
        userName: userName,
        isLoggedIn: true,
      });
    }
    setLoading(false);
  }, []);
  // 로딩 중 표시
  if (loading) {
    return <div>로딩 중...</div>;
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Home
              user={user}
              setUser={setUser}
              lists={lists}
              setLists={setLists}
            />
          }
        />
        <Route
          path="/login"
          element={<Login user={user} setUser={setUser} />}
        />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/signout"
          element={<SignOut user={user} setUser={setUser} />}
        />
        <Route
          path="/lists"
          element={
            <Lists
              user={user}
              setUser={setUser}
              lists={lists}
              setLists={setLists}
            />
          }
        />
        <Route path="/lists/:id" element={<DetailList />} />
      </Routes>
    </BrowserRouter>
  );
}
