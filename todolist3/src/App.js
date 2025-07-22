import { useState } from "react";

export default function App() {
  const [text, setText] = useState("");
  const [lists, setLists] = useState({
    id: 0,
    list: "",
  });

  function ListsInput(id) {
    setLists((prev) => ({
      ...prev,
      id: ++id,
      [id]: text,
    }));
    setText("");
    console.log(id);
  }

  return (
    <div>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="입력"
      />
      <button onClick={() => ListsInput(lists.id)}>입력</button>
      <ul>
        <li key={lists.id}>
          <p>{lists[lists.id]}</p>
        </li>
      </ul>
    </div>
  );
}
