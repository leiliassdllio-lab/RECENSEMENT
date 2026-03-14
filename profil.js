import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

// --- Firebase config ---
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

// --- Changer la photo localement ---
const photoInput = document.getElementById('photoUpload');
const userPhoto = document.getElementById('userPhoto');

photoInput.addEventListener('change', function() {
  const file = this.files[0];
  if(file){
    const reader = new FileReader();
    reader.onload = function(e){
      userPhoto.src = e.target.result;
      // Ici, tu peux envoyer le fichier vers le serveur si tu veux le stocker
    }
    reader.readAsDataURL(file);
  }
});

// --- Fonction pour compter les recensements ---
async function getRecensementsCount(uid) {
  const q = query(collection(db, "recensements"), where("uid", "==", uid));
  const snapshot = await getDocs(q);
  return snapshot.size;
}

// --- Initialisation des données utilisateur et badges ---
onAuthStateChanged(auth, async user => {
  if(!user) return window.location.href = "login.html";

  // Affichage email et username
  document.getElementById("userEmail").textContent = user.email || "Non renseigné";
  document.getElementById("username").textContent = localStorage.getItem("username") || "Inconnu";

  // Récupérer le nombre de recensements
  const recensementsCount = await getRecensementsCount(user.uid);
  const badgeRecensements = [
  {id: 'badge-1', target: 1},
  {id: 'badge-5', target: 5},
  {id: 'badge-10', target: 10},
];

badgeRecensements.forEach(b => {
  const fill = document.getElementById(`progress-${b.target}`);
  const text = document.getElementById(`progress-text-${b.target}`);
  const progress = Math.min(recensementsCount / b.target, 1); // max 100%
  
  fill.style.width = (progress * 100) + "%";
  text.textContent = `${Math.min(recensementsCount, b.target)}/${b.target}`;

  // Verrouiller ou non le badge
  const badgeEl = document.getElementById(b.id);
  if(recensementsCount < b.target) {
    badgeEl.classList.add('locked');
  }
});
  // Données supplémentaires depuis ton API (exemple)
  const userData = {
    quizCompleted: true,         // récupérer depuis ton API
    recensements: recensementsCount,
    votedBestPhoto: false         // récupérer depuis ton API
  };

  // Gestion badges dynamiques
  const badges = [
    {id: 'badge-quiz', condition: userData.quizCompleted},
    {id: 'badge-1', condition: userData.recensements >= 1},
    {id: 'badge-5', condition: userData.recensements >= 5},
    {id: 'badge-10', condition: userData.recensements >= 10},
    {id: 'badge-photo', condition: userData.votedBestPhoto}
  ];

  badges.forEach(badge => {
    const el = document.getElementById(badge.id);
    if(!badge.condition) el.classList.add('locked'); // grisé via CSS
  });

});
