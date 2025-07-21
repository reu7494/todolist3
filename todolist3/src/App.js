import { useState } from "react";

export default function App() {
  const [text, setText] = useState("");
  const [list, setList] = useState("");

  return (
    <>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="입력"
      />
      <button
        onClick={() => {
          setList(text);
          setText("");
        }}
      >
        입력
      </button>
      <p>{list}</p>
    </>
  );
}
