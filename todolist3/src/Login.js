import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function Login() {
  const [userEM, setUserEM] = useState("");
  const [userPW, setUserPW] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  function GoSignup() {
    navigate("/signup");
  }

  function GoBack() {
    navigate("/");
  }

  async function UserLogin() {
    if (userEM.trim() === "" || userPW.trim() === "") return;

    try {
      await axios.post("http://localhost:4000/api/Login/post", {
        userEM: userEM,
        userPW: userPW,
      });
      setUserEM("");
      setUserPW("");
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <div>
      <h2>로그인</h2>
      <input
        type="email"
        value={userEM}
        placeholder="이메일"
        onChange={(e) => setUserEM(e.target.value)}
      />
      <input
        type="password"
        value={userPW}
        placeholder="비밀번호"
        onChange={(e) => setUserEM(e.target.value)}
      />
      <button onClick={UserLogin}>로그인</button>
      <button onClick={GoSignup}>회원가입</button>
      <button onClick={GoBack}>취소</button>
    </div>
  );
}
