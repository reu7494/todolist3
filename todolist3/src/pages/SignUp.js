import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function SignUp() {
  const [userName, setUserName] = useState("");
  const [userPW, setUserPW] = useState("");
  const [message, setMessage] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const nameRegEx = /^[a-z][a-z0-9-_]{2,20}$/;
  const passwordRegEx = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/;

  function GoBack() {
    navigate("/");
  }

  async function UserSignUp(e) {
    e.preventDefault();
    setMessage("");
    if (!userName.trim() || !userPW.trim() || !confirmPassword.trim()) {
      setMessage("모든 필드를 입력해주세요.");
      return;
    }

    // 유저명 형식 체크
    if (!nameRegEx.test(userName)) {
      setMessage("유저명 형식을 확인하세요.");
      return;
    }

    // 비밀번호 형식 체크
    if (!passwordRegEx.test(userPW)) {
      setMessage("비밀번호 형식을 확인하세요.");
      return;
    }

    // 비밀번호 확인 체크
    if (userPW !== confirmPassword) {
      setMessage("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      await axios.post("http://localhost:4000/api/SignUp/post", {
        userName: userName,
        userPW: userPW,
      });
      alert("회원가입 성공");
      setUserName("");
      setUserPW("");
      navigate("/");
    } catch (error) {
      alert("회원가입 실패");
      setMessage("오류 발생");
    }
  }

  async function checkButton() {
    const response = await axios.post(
      "http://localhost:4000/api/SignUp/checkUserName",
      { userName }
    );
    if (response.data) {
      setMessage("이미 사용 중인 유저명입니다.");
    } else {
      setMessage("사용 가능한 유저명입니다.");
    }
  }

  return (
    <div>
      <h2>회원가입</h2>
      <label>유저명</label>
      <input
        type="text"
        value={userName}
        placeholder="영어 소문자 및 숫자를 조합하시오"
        onChange={(e) => setUserName(e.target.value)}
      />
      <button onClick={checkButton}>이름 중복 확인</button>
      <p>{message}</p>

      <label>비밀번호</label>
      <input
        type="password"
        value={userPW}
        placeholder="영문 및 숫자를 8자 이상 사용하시오"
        onChange={(e) => setUserPW(e.target.value)}
      />
      <label>비밀번호 확인</label>
      <input
        type="password"
        value={confirmPassword}
        placeholder="비밀번호 확인"
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <button onClick={UserSignUp}>회원가입</button>
      <button onClick={GoBack}>취소</button>
    </div>
  );
}
