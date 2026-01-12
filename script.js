let currentPage = 'dashboard';
let skinTone = '';
let faceShape = '';
let bmiCategory = '';

function goTo(id) {
  document.getElementById(currentPage).classList.remove('show');
  document.getElementById(id).classList.add('show');
  currentPage = id;

  if (id === 'journal') renderJournal();
}

// CAMERA
function startCamera(type) {
  const video = type === 'skin'
    ? videoSkin
    : videoFace;

  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => video.srcObject = stream)
    .catch(() => alert('Kamera tidak diizinkan'));
}

// SKINTONE
function scanSkintone() {
  const ctx = canvasSkin.getContext('2d');
  canvasSkin.width = videoSkin.videoWidth;
  canvasSkin.height = videoSkin.videoHeight;
  ctx.drawImage(videoSkin, 0, 0);

  const data = ctx.getImageData(0, 0, canvasSkin.width, canvasSkin.height).data;
  let warm = 0, cool = 0;

  for (let i = 0; i < data.length; i += 4) {
    warm += data[i];
    cool += data[i + 2];
  }

  skinTone = warm > cool ? 'Warm' : 'Cool';

  const colors = skinTone === 'Warm'
    ? ['#C68642','#D2B48C','#8B4513']
    : ['#2E3A87','#008080','#6A0DAD'];

  skinResult.innerHTML = `
    <p><b>${skinTone}</b></p>
    <p>Ini rekomendasi warna yang cocok dengan skintone mu</p>
    <div style="display:flex;justify-content:center;gap:10px">
      ${colors.map(c=>`<div style="width:40px;height:40px;background:${c}"></div>`).join('')}
    </div>
  `;
}

// FACE
function scanFace() {
  const shapes = ['bulat','oval','kotak','hati','panjang'];
  faceShape = shapes[Math.floor(Math.random()*shapes.length)];

  imgHijab.src = `assets/hijab-${faceShape}.jpg`;
  imgRambut.src = `assets/rambut-${faceShape}.jpg`;
}

// BMI
function hitungBMI() {
  const bb = +bb.value;
  const tb = tb.value / 100;
  const bmi = bb / (tb * tb);

  if (bmi < 18.5) {
    bmiCategory = 'kurus';
    bmiTips.innerText = 'Fokus pada surplus kalori dan angkat beban';
  } else if (bmi < 25) {
    bmiCategory = 'normal';
    bmiTips.innerText = 'Pertahankan pola makan seimbang dan olahraga rutin';
  } else {
    bmiCategory = 'gemuk';
    bmiTips.innerText = 'Fokus pada defisit kalori dan olahraga kardio';
  }

  bmiResult.innerText = `BMI kamu: ${bmi.toFixed(1)}`;

  mealTable.innerHTML = `
    <table>
      <tr><th>Waktu</th><th>Menu</th></tr>
      <tr><td>Pagi</td><td>Omelet sayur + roti gandum + susu</td></tr>
      <tr><td>Siang</td><td>Nasi + ayam panggang + sayur</td></tr>
      <tr><td>Sore</td><td>Buah + yoghurt</td></tr>
      <tr><td>Malam</td><td>Sup + tahu/tempe</td></tr>
    </table>
  `;
}

// JOURNAL
function renderJournal() {
  dateNow.innerText = new Date().toLocaleDateString('id-ID',{
    weekday:'long',day:'numeric',month:'long',year:'numeric'
  });

  journalContent.innerHTML = `
    <p>Skintone: ${skinTone}</p>
    <p>Bentuk Wajah: ${faceShape}</p>
    <img src="assets/hijab-${faceShape}.jpg"><br>
    <small>Hasil Rekomendasi Hijab kamu</small><br>

    <img src="assets/rambut-${faceShape}.jpg"><br>
    <small>Hasil Rekomendasi Rambut kamu</small><br>

    <img src="assets/ootd-${bmiCategory}.jpg"><br>
    <small>👩 OOTD Collection</small>
  `;
}
