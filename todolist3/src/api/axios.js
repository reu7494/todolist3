import axios from "axios";

// axios 인스턴스 생성 (함수가 아닌 변수로)
const api = axios.create({
  baseURL: "http://localhost:4000/api",
});

// 모든 요청에 자동으로 토큰 추가
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 401 오류 시 자동 로그아웃
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // 토큰 만료 또는 유효하지 않음
      localStorage.removeItem("token");
      localStorage.removeItem("userName");
    }
    return Promise.reject(error);
  }
);

export default api;
