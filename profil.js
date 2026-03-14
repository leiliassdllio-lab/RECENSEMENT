import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { getFirestore, collection, query, where, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

// --- Config Firebase ---
const firebaseConfig = {
  apiKey: "AIzaSyDxCMszTckBP5Zmiaxmo74aVNHiIhUYvys",
  authDomain: "herisson-f80ba.firebaseapp.com",
  projectId: "herisson-f80ba",
  storageBucket: "herisson-f80ba.firebasestorage.app",
  messagingSenderId: "142270421417",
  appId: "1:142270421417:web:cb3abd700fab6731c40cb8"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// --- Déconnexion ---
document.getElementById("logoutBtn").addEventListener("click", async () => {
  await signOut(auth);
  localStorage.removeItem("username");
  window.location.href = "login.html";
});

// --- Changer photo ---
const photoInput = document.getElementById('photoUpload');
const userPhoto = document.getElementById('userPhoto');
photoInput.addEventListener('change', function() {
  const file = this.files[0];
  if(file){
    const reader = new FileReader();
    reader.onload = function(e){
      userPhoto.src = e.target.result;
    }
    reader.readAsDataURL(file);
  }
});

// --- Compter recensements ---
async function getRecensementsCount(uid) {
  const q = query(collection(db, "recensements"), where("uid", "==", uid));
  const snapshot = await getDocs(q);
  return snapshot.size;
}

// --- Charger progression des quizzes ---
async function loadQuizProgress(uid) {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  let quizScores = {};
  if(userSnap.exists()){
    quizScores = userSnap.data().quizScores || {}; // ex: {scientifique:20, comportement:15,...}
  }

  const totalQuizzes = 4;
  let completed = 0;

  for(const q of ['scientifique','comportement','ecologie','sante']){
    if(quizScores[q] === 20) completed++;
  }

  const percent = (completed / totalQuizzes) * 100;

  const quizBadge = document.getElementById('badge-quiz');
  const quizProgress = document.getElementById('progress-quiz');
  const quizText = document.getElementById('progress-text-quiz');

  quizProgress.style.width = percent + "%";
  quizText.textContent = `${completed}/${totalQuizzes}`;

  if(completed === totalQuizzes){
    quizBadge.classList.remove('locked');
    quizBadge.dataset.tooltip = "Quiz terminé ! Badge débloqué.";
  } else {
    quizBadge.classList.add('locked');
    quizBadge.dataset.tooltip = "Vous devez terminer tous les quiz pour débloquer ce badge";
  }
}

// --- Initialisation badges et profil ---
onAuthStateChanged(auth, async user => {
  if(!user) return window.location.href = "login.html";

  // Afficher username et email
  document.getElementById("userEmail").textContent = user.email || "Non renseigné";
  document.getElementById("username").textContent = localStorage.getItem("username") || "Inconnu";

  // Récupérer nombre de recensements
  const recensementsCount = await getRecensementsCount(user.uid);

  const badgeRecensements = [
    {id: 'badge-1', target: 1},
    {id: 'badge-5', target: 5},
    {id: 'badge-10', target: 10},
  ];

  badgeRecensements.forEach(b => {
    const fill = document.getElementById(`progress-${b.target}`);
    const text = document.getElementById(`progress-text-${b.target}`);
    const badgeEl = document.getElementById(b.id);

    const progress = Math.min(recensementsCount / b.target, 1);
    fill.style.width = (progress * 100) + "%";
    text.textContent = `${Math.min(recensementsCount, b.target)}/${b.target}`;

    if(recensementsCount < b.target){
      badgeEl.classList.add('locked');
      badgeEl.dataset.tooltip = `Vous devez recenser ${b.target} hérissons pour débloquer ce badge`;
    } else {
      badgeEl.classList.remove('locked');
    }
  });

  // Charger progression quiz
  await loadQuizProgress(user.uid);

});
