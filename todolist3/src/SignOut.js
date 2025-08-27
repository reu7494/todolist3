import axios from "axios";

export function SignOut() {
  async function handleDelete(userId) {
    try {
      await axios.delete(`/api/delete/${userId}`);
    } catch (error) {
      console.error("회원탈퇴 오류");
    }
  }
  return (
    <div>
      <button onClick={handleDelete}>회원탈퇴</button>
    </div>
  );
}
