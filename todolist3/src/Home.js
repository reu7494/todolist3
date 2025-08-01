import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Lists } from "./Lists";
import axios from "axios";

export function Home() {
  const [lists, setLists] = useState([]);

  const navigate = useNavigate();

  async function getData() {
    try {
      const respones = await axios.get("http://localhost:3000/api/get");
      console.log(respones);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  function GoToLists() {
    navigate("/lists");
  }

  function ListDelete(listId) {
    let todolist = lists.filter((list) => list.id !== listId);
    setLists(todolist);
  }

  return (
    <div>
      <div className="header">
        <h1 style={{ fontWeight: "bolder" }}>WellCome!</h1>
      </div>
      <div className="nav">
        <button onClick={GoToLists}>글쓰기</button>
      </div>
      <div className="outer">
        <br />
        <h2>일반게시판</h2>
        <table className="list-table">
          <tbody>
            <tr>
              <th style={{ width: "10%" }}>번호</th>
              <th style={{ width: "40%" }}>제목</th>
              <th style={{ width: "20%" }}>작성자</th>
              <th style={{ width: "20%" }}>작성일</th>
            </tr>
          </tbody>

          <tbody>
            {lists.map((list) => (
              <tr key={list.id}>
                <td>{list.id}</td>
                <td>{list.listTitle}</td>
                <td>{list.userName}</td>
                <td>{list.dow}</td>
                <td>
                  <button
                    onClick={() => {
                      ListDelete(list.id);
                    }}
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
