import axios from "axios";

const namedAPI = axios.create({
  baseURL: process.env.API_URL
});

const templates = {
  // template tag 를 사용한 객체들 -> 서버 db 에서 정보를 가져올 객체
  // commentList: document.querySelector("#comments").content
};

// JSON 데이터 연동
{
  async function comments() {
    const res = await namedAPI.get(
      // `/comments?_sort=id&_order=desc&_limit=3`
    );

    // 서버 연동 전 가입력해준 기존 내용 무효화
    document.querySelector(".comments-box").textContent = "";

    res.data.forEach(comm => {
      const fragment = document.importNode(templates.commentList, true);
      const bodyEl = fragment.querySelector(".comment-text");
      const authorEl = fragment.querySelector(".author");
      bodyEl.textContent = comm.body;
      authorEl.textContent = comm.name;
      document.querySelector(".comments-box").appendChild(fragment);
    });
  }
  comments();
}

// input element 내용 서버 샌딩
const commNameEl = document.querySelector("#comment-name");
const commBodyEl = document.querySelector("#comment-body");
const modalBtnLeave = document.querySelector(".btn-leave-comm");

modalBtnLeave.addEventListener("click", async e => {
  e.preventDefault();
  const now = new Date();
  // 데이터 형식 : Sun Jul 29 2018 
  const reviewDate = now.toDateString();
  const payload = {
    name: commNameEl.value,
    body: commBodyEl.value,
    date: reviewDate
  };
  const res = await namedAPI.post(`/comments`, payload);
  comments();
});