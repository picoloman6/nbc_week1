// Firebase SDK 라이브러리 가져오기
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
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
} from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';

// Firebase 구성 정보 설정
const firebaseConfig = {
  apiKey: 'AIzaSyBe-pgwVvrcspoZvg_qX6QSxgxljHh3t3M',
  authDomain: 'nbcweek1-79c87.firebaseapp.com',
  projectId: 'nbcweek1-79c87',
  storageBucket: 'nbcweek1-79c87.appspot.com',
  messagingSenderId: '232350391237',
  appId: '1:232350391237:web:f27f6fc9ef79995e7049ac',
  measurementId: 'G-60GQBCJ2Z0',
};

// Firebase 인스턴스 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// DOM 요소
const commentWindow = $('#comment-window');
const nameInput = $('#exampleFormControlInput1');
const commentInput = $('#exampleFormControlInput2');

// 전역상태
let mod = 'add';
let id = '';

// 이벤트 함수
async function addContent() {
  const name = nameInput.val();
  const content = commentInput.val();
  const date = Date.now();
  const document = { name, content, date };

  if (name === '' || content === '') {
    alert('값을 입력하세요');
    return;
  }

  // 6. 등록, 수정 나누기
  if (mod === 'add') {
    await addDoc(collection(db, 'comment'), document);
  } else {
    await updateDoc(doc(db, 'comment', id), document);
  }

  window.location.reload();
}

function deleteContent() {
  commentWindow.toggleClass('hidden');
  nameInput.val('');
  commentInput.val('');
  mod = 'add';
  id = '';
}

// 추가하기 누르면 입력창 토글
$('#addButton').click(function () {
  commentWindow.toggleClass('hidden');
});

//파이어베이스에 데이터 넣기
$('#enterbtn').click(async function () {
  await addContent();
});

// DOM 생성 후 데이터 받아와서 렌더링
$('document').ready(async function () {
  const docs = await getDocs(
    query(collection(db, 'comment'), orderBy('date', 'desc'))
  );

  docs.forEach((v) => {
    const { name, content, date } = v.data();
    const newDate = new Date(date);
    const month = `${newDate.getMonth() + 1}.`;
    const mDate = `${newDate.getDate()}.`;
    const mHour = `${newDate.getHours()}:`;
    const mMinute = `${newDate.getMinutes()}`;

    const temp_html = `
      <div class="card-body">
        <div class="board_title">
            <div>
              <h6 class="card-title ${v.id}">${name}</h6>
              <span class="comment-date">${month}${mDate} ${mHour}${mMinute}</span>
            </div>
            <p class="card-text text-list ${v.id}">${content}</p>
            <div class="board_btn">
              <button id="${v.id}" class="update-button">수정</button>
              <button id="${v.id}" class="delete-button">삭제</button>
              
            </div>
        </div>
      </div>
    `;
    $('#card').append(temp_html);
  });

  const updateBtns = $('.update-button');
  const deletebtn = $('.delete-button');

  // 데이터 삭제 이벤트
  deletebtn.click(async function (e) {
    const id = e.target.id;
    await deleteDoc(doc(db, 'comment', id));
    window.location.reload();
  });

  // 데이서 수정 이벤트
  updateBtns.click(function (e) {
    // 1. id 가져오기
    const contents = $(`.${e.target.id}`);

    // 2. 내용 가져오기
    const name = contents[0].innerText;
    const comment = contents[1].innerText;

    // 4. 인풋에 내용 집어 넣기
    nameInput.val(name);
    commentInput.val(comment);

    // 5. 수정 모드로 바꿔주기
    mod = 'update';
    id = e.target.id;

    if (commentWindow.hasClass('hidden')) {
      commentWindow.toggleClass('hidden');
    }
  });
});

// 엔터 누르면 입력, esc 누르면 창 열고 닫히기
$('body').keydown(async function (e) {
  if (e.key === 'Enter') {
    if (!commentWindow.hasClass('hidden')) {
      await addContent();
    }
  } else if (e.key === 'Escape') {
    deleteContent();
  }
});

// 취소 버튼 누르면 창 닫히기
$('#cancelBtn').click(function () {
  deleteContent();
});
