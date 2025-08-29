import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export function SignUp() {
  const [userName, setUserName] = useState("");
  const [userPW, setUserPW] = useState("");
  const [message, setMessage] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const nameRegEx = /^[a-z][a-z0-9-_]{2,20}$/;
  const passwordRegEx = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/;

  function GoLogin() {
    navigate("/login");
  }

  function GoBack() {
    navigate("/");
  }

  async function UserSignUp(e) {
    if (userName.trim() === "" || userPW.trim() === "") return;
    e.preventDefault();
    setMessage(null);

    let validationErrors = {};

    // 유저명 형식 체크
    if (!nameRegEx.test(userName)) {
      validationErrors.userName = "유저명 형식을 확인하세요.";
    }

    // 비밀번호 형식 체크
    if (!passwordRegEx.test(userPW)) {
      validationErrors.password = "비밀번호 형식을 확인하세요.";
    }

    // 비밀번호 확인 체크
    if (userPW !== confirmPassword) {
      setMessage("비밀번호가 일치하지 않습니다.");
      return;
    }

    // 오류가 있을 경우 화면에 표시
    if (Object.keys(validationErrors).length > 0) {
      setMessage(validationErrors);
      return;
    }
    //유저명 중복 체크
    const isUserNameDuplicate = await checkButton(userName);
    if (isUserNameDuplicate) {
      setMessage("이미 사용 중인 유저명입니다.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:4000/api/SignUp/post",
        {
          userName: userName,
          userPW: userPW,
        }
      );
      if (!response.ok) {
        Swal.fire({
          title: "",
          text: "회원가입 실패",
          icon: "error",
        });
      } else {
        Swal.fire({
          title: "",
          text: "회원가입 성공!",
          icon: "success",
        });
      }
      setUserName("");
      setUserPW("");
      navigate("/");
    } catch (error) {
      setMessage("오류 발생");
    }
  }

  async function checkButton(userName) {
    try {
      await axios.post(
        "http://localhost:4000/api/SignUp/checkUserName",
        userName
      );
      setMessage("사용가능");
    } catch (error) {
      setMessage("사용 불가능");
    }
  }

  return (
    <div>
      <h2>회원가입</h2>
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
