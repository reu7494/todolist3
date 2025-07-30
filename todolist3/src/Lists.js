import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function Lists({ lists, setLists }) {
  const [title, setTitle] = useState("");
  const [name, setName] = useState("");
  const [contents, setContents] = useState("");
  const [number, setNumber] = useState(1);

  const navigate = useNavigate();

  function GotoHome() {
    navigate("/");
  }

  function ListsInput() {
    if (title.trim() === "" || name.trim() === "" || contents.trim() === "")
      return; // 공백 입력 안됨

    const newItem = {
      id: number,
      listTitle: title,
      listContents: contents,
      userName: name,
      dow: days, //Date of creation(작성일)
    };

    setLists((prev) => [...prev, newItem]); // 기존 목록에 추가
    setTitle("");
    setName("");
    setContents(""); //입력 초기화
    setNumber(number + 1); //number 값 1씩 증가
    console.log(newItem.dow);
    navigate("/");
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
      <button>게시하기</button>
    </div>
  );
}
