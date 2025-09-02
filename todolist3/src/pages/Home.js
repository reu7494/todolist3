import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { SignOut } from "./SignOut";
import axios from "axios";
import { useAuth } from "../auth/useAuth";

export function Home() {
  const [lists, setLists] = useState([]);
  const [count, setCount] = useState(0);

  const navigate = useNavigate();
  const { auth, logout } = useAuth();

  useEffect(() => {
    async function getData() {
      try {
        const response = await axios.get("http://localhost:4000/api/get");
        setLists(response.data);
      } catch (error) {
        console.error(error);
      }
    }

    getData();
  }, []);

  function GoToLists() {
    navigate("/lists");
  }

  function GoLogin() {
    navigate("/login");
  }

  function GoSignup() {
    navigate("/signup");
  }

  async function ListDelete(listId) {
    try {
      await axios.delete(`http://localhost:4000/api/delete/${listId}`);
      let todolist = lists.filter((list) => list.id !== listId);
      setLists(todolist);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <div className="header">
        <h1 style={{ fontWeight: "bolder" }}>WellCome!</h1>
      </div>

      <div className="nav">
        {!auth.isAuthenticated ? (
          <>
            <button onClick={GoLogin}>로그인</button>
            <button onClick={GoSignup}>회원가입</button>
          </>
        ) : (
          <>
            <button onClick={GoToLists}>글쓰기</button>
            <button onClick={logout}>로그아웃</button>
            <SignOut />
          </>
        )}
      </div>

      <div className="outer">
        <br />
        <h2>일반게시판</h2>
        <table className="list-table">
          <tbody>
            <tr>
              <th style={{ width: "10%" }}>번호</th>
              <th style={{ width: "30%" }}>제목</th>
              <th style={{ width: "20%" }}>작성자</th>
              <th style={{ width: "20%" }}>작성일</th>
              <th style={{ width: "10%" }}>조회수</th>
            </tr>
          </tbody>

          <tbody>
            {lists.map((list) => (
              <tr key={list.id}>
                <td>{list.id}</td>
                <td>
                  <Link to={`/lists/${list.id}`}>{list.title}</Link>
                </td>
                <td>{list.usename}</td>
                <td>{list.created_at.substring(0, 10)}</td>
                <td>{count}</td>
                <td>
                  <button onClick={() => ListDelete(list.id)}>삭제</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
