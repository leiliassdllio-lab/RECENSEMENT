// Changer la photo localement
const photoInput = document.getElementById('photoUpload');
const userPhoto = document.getElementById('userPhoto');

photoInput.addEventListener('change', function(){
  const file = this.files[0];
  if(file){
    const reader = new FileReader();
    reader.onload = function(e){
      userPhoto.src = e.target.result;
      // Ici on peut envoyer le fichier sur le serveur si nécessaire
    }
    reader.readAsDataURL(file);
  }
});

// Exemple badges dynamiques
// Supposons que tu as ces données depuis ton stockage ou base
const userData = {
  quizCompleted: true,
  recensements: 7,
  votedBestPhoto: false
};

// Gestion des badges
if(!userData.quizCompleted){
  document.getElementById('badge-quiz').style.opacity = 0.3;
}

if(userData.recensements < 1){
  document.getElementById('badge-1').style.opacity = 0.3;
}
if(userData.recensements < 5){
  document.getElementById('badge-5').style.opacity = 0.3;
}
if(userData.recensements < 10){
  document.getElementById('badge-10').style.opacity = 0.3;
}

if(!userData.votedBestPhoto){
  document.getElementById('badge-photo').style.opacity = 0.3;
}
