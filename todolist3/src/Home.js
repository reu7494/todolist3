import { Link } from "react-router-dom";

export function Home() {
  return (
    <div>
      <div className="header">
        <h1 style={{ fontWeight: "bolder" }}>WellCome!</h1>
      </div>
      <div className="nav">
        <Link to="/lists">글쓰기</Link>
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
              <th style={{ width: "10%" }}>삭제</th>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
