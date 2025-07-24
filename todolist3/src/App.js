import { useState } from "react";

export default function App() {
  const [text, setText] = useState("");
  const [lists, setLists] = useState([]);

  function ListsInput() {
    if (text.trim() === "") return; // 공백 입력 안됨

    const newItem = {
      id: Date.now(), // 유니크 ID 생성
      sentence: text,
    };

    setLists((prev) => [...prev, newItem]);
    setText("");
    console.log(newItem.id);
  }

  return (
    <div>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="입력"
      />
      <button onClick={ListsInput}>입력</button>
      <ul>
        {lists.map((list) => (
          <li key={list.id}>
            <p>{list.sentence}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
