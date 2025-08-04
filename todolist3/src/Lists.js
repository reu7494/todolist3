import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export function Lists({ lists, setLists }) {
  const [title, setTitle] = useState("");
  const [name, setName] = useState("");
  const [contents, setContents] = useState("");

  const navigate = useNavigate();

  function GotoHome() {
    navigate("/");
  }

  async function ListsInput() {
    if (title.trim() === "" || name.trim() === "" || contents.trim() === "")
      return; // 공백 입력 안됨

    try {
      const respones = await axios.post("http://localhost:4000/api/post", {
        title: title,
        usename: name,
        countent: contents,
      });

      setLists((prev) => [...prev, respones]); // 기존 목록에 추가
      setTitle("");
      setName("");
      setContents(""); //입력 초기화
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <table className="enroll-table">
        <tbody>
          <tr>
            <th>제목</th>
            <td colSpan={3}>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </td>
          </tr>

          <tr>
            <th>작성자</th>
            <td colSpan={3}>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </td>
          </tr>

          <tr>
            <th>글내용</th>
            <td colSpan={3}>
              <textarea
                type="text"
                value={contents}
                onChange={(e) => setContents(e.target.value)}
              />
            </td>
          </tr>
        </tbody>
      </table>
      <button onClick={GotoHome}>취소</button>
      <button onClick={ListsInput}>게시하기</button>
    </div>
  );
}
