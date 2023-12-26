// Firebase SDK 라이브러리 가져오기
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// Firebase 구성 정보 설정
const firebaseConfig = {
  apiKey: "AIzaSyBe-pgwVvrcspoZvg_qX6QSxgxljHh3t3M",
  authDomain: "nbcweek1-79c87.firebaseapp.com",
  projectId: "nbcweek1-79c87",
  storageBucket: "nbcweek1-79c87.appspot.com",
  messagingSenderId: "232350391237",
  appId: "1:232350391237:web:f27f6fc9ef79995e7049ac",
  measurementId: "G-60GQBCJ2Z0",
};

// Firebase 인스턴스 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let mod = "add";
let id = "";

$("#addButton").click(function () {
  $(".comment-window").toggle();
});

//파이어베이스에 데이터 넣기
$("#enterbtn").click(async function () {
  const name = $("#exampleFormControlInput1").val();
  const content = $("#exampleFormControlInput2").val();

  const document = { name, content };

  // 6. 등록, 수정 나누기
  if (mod === "add") {
    await addDoc(collection(db, "comment"), document);
  } else {
    await updateDoc(doc(db, "comment", id), document);
  }

  alert("작성완료");
  window.location.reload();
});

$("document").ready(async function () {
  const docs = await getDocs(collection(db, "comment"));

  docs.forEach((v) => {
    const { name, content } = v.data();

    const temp_html = `
      <div class="card-body">
        <h6 class="card-title ${v.id}">${name}</h6>
        <p class="card-text text-list ${v.id}">${content}</p>
        <button id="${v.id}" class="update-button">수정</button>
        <button id="${v.id}" class="delete-button">삭제</button>
      </div>
    `;
    $("#card").append(temp_html);
  });

  const updateBtns = $(".update-button");
  const deletebtn = $(".delete-button");

  deletebtn.click(async function (e) {
    const id = e.target.id;
    await deleteDoc(doc(db, "comment", id));
    window.location.reload();

    updateBtns.click(function (e) {
      // 1. id 가져오기
      const contents = $(`.${e.target.id}`);

      // 2. 내용 가져오기
      const name = contents[0].innerText;
      const comment = contents[1].innerText;

      // 3. 인풋 가져오기
      const nameInput = $("#exampleFormControlInput1");
      const commentInput = $("#exampleFormControlInput2");

      // 4. 인풋에 내용 집어 넣기
      nameInput.val(name);
      commentInput.val(comment);

      // 5. 수정 모드로 바꿔주기
      mod = "update";
      id = e.target.id;
    });
  });
});
