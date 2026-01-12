let currentSection = 'dashboard';
let stream = null;
let skinTone = '';
let faceShape = '';
let bmiCategory = '';

function nextSection(id) {
  document.getElementById(currentSection).classList.remove('active');
  document.getElementById(id).classList.add('active');
  currentSection = id;
}

// ================= CAMERA =================
function startCamera(type) {
  const video = type === 'skin'
    ? document.getElementById('videoSkin')
    : document.getElementById('videoFace');

  navigator.mediaDevices.getUserMedia({ video: true })
    .then(s => {
      stream = s;
      video.srcObject = stream;
    })
    .catch(() => alert('Kamera tidak diizinkan'));
}

// ================= SKINTONE =================
function captureSkin() {
  const video = document.getElementById('videoSkin');
  const canvas = document.getElementById('canvasSkin');
  const ctx = canvas.getContext('2d');

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0);

  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  let r = 0, b = 0;

  for (let i = 0; i < data.length; i += 4) {
    r += data[i];
    b += data[i + 2];
  }

  skinTone = r > b ? 'Warm' : 'Cool';

  document.getElementById('skinResult').innerHTML = `
    <p>Skintone: <b>${skinTone}</b></p>
    <p>Ini rekomendasi warna yang cocok dengan skintone mu</p>
  `;
}

// ================= FACE =================
function detectFace() {
  const shapes = ['bulat', 'oval', 'kotak', 'hati', 'panjang'];
  faceShape = shapes[Math.floor(Math.random() * shapes.length)];

  document.getElementById('imgHijab').src = `assets/hijab-${faceShape}.jpg`;
  document.getElementById('imgRambut').src = `assets/rambut-${faceShape}.jpg`;
  document.getElementById('faceText').innerText =
    `Bentuk wajah kamu: ${faceShape}`;
}

// ================= BMI =================
function hitungBMI() {
  const bb = document.getElementById('bb').value;
  const tb = document.getElementById('tb').value / 100;
  const bmi = bb / (tb * tb);

  if (bmi < 18.5) bmiCategory = 'kurus';
  else if (bmi < 25) bmiCategory = 'normal';
  else bmiCategory = 'gemuk';

  document.getElementById('bmiResult').innerText =
    `BMI kamu: ${bmi.toFixed(1)} (${bmiCategory})`;

  document.getElementById('mealTable').innerHTML = `
    <table border="1" width="100%">
      <tr><th>Pagi</th><th>Siang</th><th>Sore</th><th>Malam</th></tr>
      <tr><td>Nasi</td><td>Ayam</td><td>Buah</td><td>Sup</td></tr>
    </table>
  `;
}

// ================= OOTD =================
document.getElementById('imgOOTD').onload = () => {
  document.getElementById('imgOOTD').style.display = 'block';
};

function nextSection(id) {
  document.getElementById(currentSection).classList.remove('active');
  document.getElementById(id).classList.add('active');
  currentSection = id;

  if (id === 'ootd') {
    document.getElementById('imgOOTD').src =
      `assets/ootd-${bmiCategory}.jpg`;
  }

  if (id === 'journal') {
    document.getElementById('dateNow').innerText =
      new Date().toLocaleDateString('id-ID', {
        weekday: 'long', day: 'numeric',
        month: 'long', year: 'numeric'
      });

    document.getElementById('journalContent').innerHTML = `
      <p>Skintone: ${skinTone}</p>
      <p>Face Shape: ${faceShape}</p>
      <img src="assets/hijab-${faceShape}.jpg">
      <img src="assets/rambut-${faceShape}.jpg">
      <img src="assets/ootd-${bmiCategory}.jpg">
    `;
  }
}
