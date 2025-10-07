import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export function DetailList({ lists, setLists }) {
  const [data, setData] = useState("");
  const { id } = useParams();

  const navigate = useNavigate();

  function goBack() {
    navigate("/");
  }

  useEffect(() => {
    async function getDetailLists() {
      try {
        const response = await axios.get(`http://localhost:4000/api/get/${id}`);
        setData(response.data);

        await axios.patch(`http://localhost:4000/api/view/${id}`);
      } catch (error) {
        console.error("게시글 불러오기 실패:", error);
      }
    }

    getDetailLists();
  }, [id]);

  return (
    <div>
      {data ? (
        <>
          <h2>{data.title}</h2>
          <p>작성자: {data.usename}</p>
          <p>작성일: {data.created_at.substring(0, 10)}</p>
          <p>조회수: {data.views}</p>
          <p>내용: {data.content}</p>
        </>
      ) : (
        "해당 게시글을 찾을 수 없습니다."
      )}
      <button onClick={goBack}>목록으로 돌아가기</button>
    </div>
  );
}
