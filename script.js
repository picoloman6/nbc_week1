// Firebase SDK 라이브러리 가져오기
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import {
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { getDocs } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

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

$("#addButton").click(function () {
  $(".input-form").toggle();
});

$("#inputbtn").click(async function (e) {
  if (e.target.tagName !== "BUTTON") {
    return;
  }

  const photoInput = $(".inputphoto");
  const nameInput = $(".inputname");
  const mbtiInput = $(".inputmbti");
  const tmiInput = $(".inputtmi");

  const photo = photoInput.val();
  const name = nameInput.val();
  const mbti = mbtiInput.val();
  const tmi = tmiInput.val();

  if (e.target.id === "enterBtn") {
    if (photo === "" || name === "" || mbti === "" || tmi === "") {
      alert("값을 입력하세요");
      return;
    }

    const doc = { photo, name, mbti, tmi };
    await addDoc(collection(db, "info"), doc);

    window.location.reload();
  } else if (e.target.id === "cancelBtn") {
    $(".input-form").toggle();
  }

  photoInput.val("");
  nameInput.val("");
  mbtiInput.val("");
  tmiInput.val("");
});

$("document").ready(async function () {
  const docs = await getDocs(collection(db, "info"));

  docs.forEach((v) => {
    const { photo, name, mbti, tmi } = v.data();

    const temp_html = `
        <div class="col card-list">
            <div class="card">
                <img src="${photo}" class="card-img-top" alt="..." />
                <div class="card-body">
                <h5 class="card-title">${name}</h5>
                <p class="card-text">${mbti}
                </p>
                <p class="card-text">${tmi}
                </p>
                </div>
            </div>
        </div>`;
    $("#card").append(temp_html);
  });
});
