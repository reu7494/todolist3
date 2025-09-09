import axios from "axios";
import { useNavigate } from "react-router-dom";

export function SignOut({ user, setUser }) {
  const navigate = useNavigate();
  console.log("SignOut에서 받은 user:", user);
  async function handleDelete() {
    try {
      await axios.delete(`http://localhost:4000/api/SignOut/${user.id}`);

      setUser({ id: 0, userName: "", isLoggedIn: false });

      alert("회원탈퇴가 완료되었습니다.");
      navigate("/");
    } catch (error) {
      console.error("회원탈퇴 오류:", error);
      alert("회원탈퇴 중 오류가 발생했습니다.");
    }
  }
  return (
    <div>
      <button onClick={handleDelete}>회원탈퇴</button>
    </div>
  );
}
