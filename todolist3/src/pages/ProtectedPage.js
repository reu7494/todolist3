import React from "react";
import { useAuth } from "../auth/useAuth";
import Swal from "sweetalert2";

export default function ProtectedPage() {
  const { auth, logout } = useAuth();

  const handleLogout = () => {
    try {
      logout();
      Swal.fire({
        icon: "success",
        title: "로그아웃 성공",
        text: "성공적으로 로그아웃되었습니다.",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "로그아웃 실패",
        text: "로그아웃 중 오류가 발생했습니다.",
      });
      console.error(error);
    }
  };

  return (
    <div>
      <h1>보호된 콘텐츠</h1>
      {auth.isAuthenticated ? (
        <button onClick={handleLogout}>로그아웃</button>
      ) : (
        <p>로그인하지 않았습니다</p>
      )}
    </div>
  );
}
