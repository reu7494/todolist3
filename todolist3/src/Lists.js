import { useState } from "react";
import { Link } from "react-router-dom";

export function Lists() {
  const [title, setTitle] = useState("");
  const [name, setName] = useState("");
  const [contents, setContents] = useState("");
  const [lists, setLists] = useState([]);
  const [number, setNumber] = useState(1);

  function ListsInput() {
    if (contents.trim() === "") return; // 공백 입력 안됨

    const newItem = {
      id: number,
      listTitle: title,
      listContents: contents,
      userName: name,
      dow: new Date().toLocaleDateString(),
    };

    setLists((prev) => [...prev, newItem]); // 기존 목록에 추가
    setTitle("");
    setName("");
    setContents(""); //입력 초기화
    setNumber(number + 1); //number 값 1씩 증가
    console.log(newItem.dow);
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
        </tbody>

        <tbody>
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
        </tbody>

        <tbody>
          <tr>
            <th>글내용</th>
            <td colSpan={3}>
              <input
                type="text"
                value={contents}
                onChange={(e) => setContents(e.target.value)}
              />
            </td>
          </tr>
        </tbody>
      </table>
      <button onClick={ListsInput}>글 등록</button>
      <ul>
        {lists.map((list) => (
          <li key={list.id}>
            <p>{list.listTitle}</p>
            <p>{list.userName}</p>
            <p>{list.listContents}</p>
            <p>{list.dow}</p>
          </li>
        ))}
      </ul>
      <Link to="/">취소</Link>
      <button>게시하기</button>
    </div>
  );
}
