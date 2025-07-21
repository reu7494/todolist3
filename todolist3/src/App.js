import { useState } from "react";

export default function App() {
  const [text, setText] = useState("");
  const [list, setList] = useState("");

  function InputButton() {}

  return (
    <>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.tager.value)}
        placeholder="입력"
      />
      <button
        onClick={() => {
          setList(text);
        }}
      >
        입력
      </button>
      <p>{list}</p>
    </>
  );
}
