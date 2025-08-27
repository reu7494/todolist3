import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
export function SignUp() {
  const [userName, setUserName] = useState("");
  const [userPW, setUserPW] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  function GoLogin() {
    navigate("/login");
  }

  function GoBack() {
    navigate("/");
  }

  async function UserSignUp() {
    if (userName.trim() === "" || userPW.trim() === "") return;

    try {
      await axios.post("http://localhost:4000/api/SignUp/post", {
        userName: userName,
        userPW: userPW,
      });
      setUserName("");
      setUserPW("");
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  }

  async function checkButton(e) {
    e.preventDefault();
    const checkUserName = {
      checkUserName: userName,
    };
    const response = await axios.post(
      "http://localhost:4000/api/SignUp/checkUserName",
      checkUserName
    );
    if (response.data === true) setMessage("사용가능");
    else setMessage("사용 불가능");
  }

  return (
    <div>
      <label>유저명</label>
      <input
        type="text"
        value={userName}
        placeholder="유저명"
        onChange={(e) => setUserName(e.target.value)}
      />
      <button onClick={checkButton}>이름 중복 확인</button>
      <p>{message}</p>

      <label>비밀번호</label>
      <input
        type="password"
        value={userPW}
        placeholder="비밀번호"
        onChange={(e) => setUserPW(e.target.value)}
      />
      <button onClick={UserSignUp}>회원가입</button>
      <button onClick={GoLogin}>로그인</button>
      <button onClick={GoBack}>취소</button>
    </div>
  );
}
