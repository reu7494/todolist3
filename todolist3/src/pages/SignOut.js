import axios from "axios";

export function SignOut({ userId }) {
  async function handleDelete(id) {
    try {
      await axios.delete(`/api/SignOut/${id}`);
    } catch (error) {
      console.error("회원탈퇴 오류");
    }
  }
  return (
    <div>
      <button onClick={() => handleDelete(id)}>회원탈퇴</button>
    </div>
  );
}
