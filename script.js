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

let mode = "add";
let id = "";

const photoInput = $(".inputphoto");
const nameInput = $(".inputname");
const mbtiInput = $(".inputmbti");
const tmiInput = $(".inputtmi");

async function addContent() {
  const photo = photoInput.val();
  const name = nameInput.val();
  const mbti = mbtiInput.val();
  const tmi = tmiInput.val();

  if (photo === "" || name === "" || mbti === "" || tmi === "") {
    alert("값을 입력하세요");
    return;
  }

  const content = { photo, name, mbti, tmi };

  if (mode === "add") {
    await addDoc(collection(db, "info"), content);
  } else {
    await updateDoc(doc(db, "info", id), content);
  }

  window.location.reload();
}

function deleteContent() {
  $(".input-form").toggleClass("hidden");
  mode = "add";
  id = "";
  photoInput.val("");
  nameInput.val("");
  mbtiInput.val("");
  tmiInput.val("");
}

$("#addButton").click(function () {
  $(".input-form").toggleClass("hidden");
  mode = "add";
  id = "";
  photoInput.val("");
  nameInput.val("");
  mbtiInput.val("");
  tmiInput.val("");
});

$("#inputbtn").click(async function (e) {
  if (e.target.tagName !== "BUTTON") {
    return;
  }

  if (e.target.id === "enterBtn") {
    await addContent();
  } else if (e.target.id === "cancelBtn") {
    deleteContent();
  }
});

$("document").ready(async function () {
  const docs = await getDocs(collection(db, "info"));

  docs.forEach((v) => {
    const { photo, name, mbti, tmi } = v.data();

    const temp_html = `
        <div class="col card-list">
            <div class="card">
                <img id="${v.id}" src="${photo}" class="card-img-top ${v.id}" alt="..." />
                <div class="card-body main-card">
                <div class="card-header">
                    <h5 class="card-title ${v.id}">${name}</h5>
                    <button id="${v.id}" class="card-button">삭제</button>
                </div>
                <p class="card-text ${v.id}">${mbti}
                </p>
                <p class="card-text ${v.id}">${tmi}
                </p>
                </div>
            </div>
        </div>`;
    $("#card").append(temp_html);
  });

  const btns = $(".card-button");
  const imgs = $(".card-img-top");

  btns.click(async function (e) {
    const id = e.target.id;
    await deleteDoc(doc(db, "info", id));
    window.location.reload();
  });

  imgs.click(async function (e) {
    const content = $(`.${e.target.id}`);
    const inputForm = $(".input-form");

    const photo = content[0].src;
    const name = content[1].innerText;
    const mbti = content[2].innerText;
    const tmi = content[3].innerText;

    mode = "update";
    id = e.target.id;

    photoInput.val(photo);
    nameInput.val(name);
    mbtiInput.val(mbti);
    tmiInput.val(tmi);

    if (inputForm.hasClass("hidden")) {
      inputForm.toggleClass("hidden");
    }
  });
});

$(".input-form").keydown(async function (e) {
  if (e.key === "Enter") {
    await addContent();
  } else if (e.key === "Escape") {
    deleteContent();
  }
});
