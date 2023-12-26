// Firebase SDK 라이브러리 가져오기
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
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

//파이어베이스에 데이터 넣기
$('#enterbtn').click(async function () {
  let name = $('#exampleFormControlInput1').val();
  let commends = $('#exampleFormControlInput2').val();

  let doc = { name: name, commends: commends };
  await addDoc(collection(db, 'comment'), doc);
  alert('작성완료');
  window.location.reload();
});

$('document').ready(async function () {
  const docs = await getDocs(collection(db, 'comment'));

  docs.forEach((v) => {
    const { name, content } = v.data();

    const temp_html = `
  <div class="card-body">
    <h6 class="card-title" ${v.id}>${name}</h6>
    <p class="card-text text-list" ${v.id}>
    ${content}</p>
  </div>
`;
    $('#card').append(temp_html);
  });
});
