// Firebase SDK 라이브러리 가져오기
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytes,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-storage.js";

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

// DOM 요소
const photoInput = $(".inputphoto");
const nameInput = $(".inputname");
const mbtiInput = $(".inputmbti");
const tmiInput = $(".inputtmi");
const inputForm = $(".input-form");

// Firebase Storage
const storage = getStorage();

// 전역 상태
let mode = "add";
let id = "";

// 이벤트 함수
async function addContent() {
  // DOM value 가져오기
  const photo = photoInput[0].files;
  const name = nameInput.val();
  const mbti = mbtiInput.val().toUpperCase();
  const tmi = tmiInput.val();
  const date = Date.now();

  // storage에 사진 파일 저장하기
  let photoPath;
  let photoRef;
  let blob;
  const content = { date, name, mbti, tmi };

  if (name === "" || mbti === "" || tmi === "") {
    alert("값을 입력하세요");
    return;
  }

  if (mode === "add" && photo.length === 0) {
    alert("사진을 등록하세요");
    return;
  }

  // 사진이 있는 경우에만 사진 저장 수행
  if (photo.length === 1) {
    photoPath = `images/${date}${photo[0].name}`;
    photoRef = ref(storage, photoPath);
    blob = new Blob(photo);
    await uploadBytes(photoRef, blob);
    content.photo = photoPath;
  }

  if (mode === "add") {
    await addDoc(collection(db, "info"), content);
  } else {
    await updateDoc(doc(db, "info", id), content);
  }

  window.location.reload();
}

function deleteContent() {
  inputForm.toggleClass("hidden");
  mode = "add";
  id = "";
  photoInput.val("");
  nameInput.val("");
  mbtiInput.val("");
  tmiInput.val("");
}

// 추가하기 누르면 입력창 토글
$("#addButton").click(function () {
  deleteContent();
});

//파이어베이스에 데이터 넣기
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

// DOM 생성 후 데이터 받아와서 렌더링
$("document").ready(async function () {
  // Firestore 데이터 가져오기
  const docs = await getDocs(
    query(collection(db, "info"), orderBy("date", "desc"))
  );

  // Storatge 사진 데이터 URL 가져오기(비동기 처리)
  const data = await Promise.all(
    docs.docs.map(async (v) => {
      const { photo, name, mbti, tmi } = v.data();

      const forestRef = ref(storage, photo);
      const photoPath = await getDownloadURL(forestRef);

      return { id: v.id, photoPath, name, mbti, tmi };
    })
  );

  // 데이터로 DOM 생성하기
  data.forEach((v) => {
    const { id, photoPath, name, mbti, tmi } = v;

    const temp_html = `
    <div class="col card-list">
        <div class="card">
            <img id="${id}" src="${photoPath}" class="card-img-top ${v.id}" alt="..." />
            <div class="card-body main-card">
            <div class="card-header">
                <div class="header-wrapper">
                  <h5 class="card-title ${id}">${name}</h5>
                  <p class="card-text ${id}">${mbti}</p>
                </div>
                <button id="${id}" class="card-button">삭제</button>
            </div>
            <div class="card-content">
              <span class="${id}">${tmi}</span>
            </div>
            </div>
        </div>
    </div>`;
    $("#card").append(temp_html);
  });

  // DOM에 이벤트 등록
  const btns = $(".card-button");
  const imgs = $(".card-img-top");

  // 데이터 삭제 이벤트
  btns.click(async function (e) {
    const id = e.target.id;
    await deleteDoc(doc(db, "info", id));
    window.location.reload();
  });

  // 사진 클릭 시 데이터 수정 모드로 변경
  imgs.click(function (e) {
    alert("수정 시에는 사진을 교체하지 않아도 됩니다.");
    const content = $(`.${e.target.id}`);

    const name = content[1].innerText;
    const mbti = content[2].innerText;
    const tmi = content[3].innerText;

    mode = "update";
    id = e.target.id;

    nameInput.val(name);
    mbtiInput.val(mbti);
    tmiInput.val(tmi);

    if (inputForm.hasClass("hidden")) {
      inputForm.toggleClass("hidden");
    }
  });
});

// 엔터 누르면 입력, esc 누르면 창 열고 닫히기
$("body").keydown(async function (e) {
  if (e.key === "Enter") {
    if (!inputForm.hasClass("hidden")) {
      await addContent();
    }
  } else if (e.key === "Escape") {
    deleteContent();
  }
});
