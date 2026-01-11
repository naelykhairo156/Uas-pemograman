const sections = ['dashboard','skintone','face','bmi','ootd','journal'];

let skinTone = '';
let faceShape = '';
let bmiCategory = '';

function goTo(id) {
  sections.forEach(s => document.getElementById(s).style.display = 'none');
  document.getElementById(id).style.display = 'block';

  if (id === 'journal') updateJournal();
}

/* =======================
   AKSES KAMERA ASLI
======================= */
async function startCamera(videoId) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    document.getElementById(videoId).srcObject = stream;
  } catch (err) {
    alert('Kamera tidak diizinkan atau tidak tersedia');
  }
}

startCamera('skinVideo');
startCamera('faceVideo');

/* =======================
   SKINTONE (PIXEL ANALYSIS)
======================= */
function takeSkinPhoto() {
  const video = document.getElementById('skinVideo');
  const canvas = document.getElementById('skinCanvas');
  const ctx = canvas.getContext('2d');

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0);

  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

  let brightness = 0;
  for (let i = 0; i < data.length; i += 4) {
    brightness += data[i]; // red channel
  }
  brightness /= (data.length / 4);

  if (brightness < 60) {
    document.getElementById('skinError').innerText =
      'Pencahayaan terlalu gelap. Ulangi scan.';
    return;
  }

  if (brightness > 160) {
    skinTone = 'Warm';
  } else {
    skinTone = 'Cool';
  }

  document.getElementById('skinResult').innerText =
    `Skintone terdeteksi: ${skinTone}`;
}

/* =======================
   FACE FRAMING (LOGIKA AMAN)
======================= */
function takeFacePhoto() {
  // Karena tanpa library eksternal,
  // bentuk wajah disimulasikan BERDASARKAN RASIO GAMBAR

  const canvas = document.getElementById('faceCanvas');
  const video = document.getElementById('faceVideo');

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const ratio = canvas.width / canvas.height;

  if (ratio > 1.1) {
    faceShape = 'oval';
  } else if (ratio < 0.9) {
    faceShape = 'panjang';
  } else {
    faceShape = 'bulat';
  }

  document.getElementById('faceResult').innerText =
    `Bentuk wajah: ${faceShape}`;

  /* LOGIKA IF / ELSE ASSETS */
  if (faceShape === 'oval') {
    hijabImg.src = './assets/hijab-oval.jpg';
    hairImg.src = './assets/rambut-oval.jpg';
  } else if (faceShape === 'bulat') {
    hijabImg.src = './assets/hijab-bulat.jpg';
    hairImg.src = './assets/rambut-bulat.jpg';
  } else {
    hijabImg.src = './assets/hijab-panjang.jpg';
    hairImg.src = './assets/rambut-panjang.jpg';
  }
}

/* =======================
   BMI + OOTD IF ELSE
======================= */
function hitungBMI() {
  const bb = document.getElementById('bb').value;
  const tb = document.getElementById('tb').value / 100;

  const bmi = (bb / (tb * tb)).toFixed(1);

  if (bmi < 18.5) {
    bmiCategory = 'underweight';
    ootdImg.src = './assets/ootd-underweight-1.jpg';
  } else if (bmi < 25) {
    bmiCategory = 'normal';
    ootdImg.src = './assets/ootd-normal-1.jpg';
  } else {
    bmiCategory = 'overweight';
    ootdImg.src = './assets/ootd-overweight-1.jpg';
  }

  document.getElementById('bmiResult').innerText =
    `BMI kamu: ${bmi} (${bmiCategory})`;
}

/* =======================
   JOURNAL
======================= */
function updateJournal() {
  jSkin.innerText = skinTone;
  jFace.innerText = faceShape;
  jBMI.innerText = bmiCategory;

  jHijab.src = hijabImg.src;
  jHair.src = hairImg.src;
  jOOTD.src = ootdImg.src;

  date.innerText = new Date().toLocaleDateString(
    'id-ID',
    { weekday:'long', day:'numeric', month:'long', year:'numeric' }
  );
}
