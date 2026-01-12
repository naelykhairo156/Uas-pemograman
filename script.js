let current = 'dashboard';
let skinTone = '';
let palette = [];
let faceShape = '';
let bmi = 0;
let bmiStatus = '';
let bmiCategory = '';

function goTo(id) {
  document.getElementById(current).style.display = 'none';
  document.getElementById(id).style.display = 'flex';
  current = id;

  if (id === 'ootd') renderOOTD();
  if (id === 'journal') renderJournal();
}

// CAMERA
function startCamera(type) {
  const video = type === 'skin' ? videoSkin : videoFace;
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(s => video.srcObject = s)
    .catch(()=>alert('Kamera ditolak'));
}

// SKINTONE
function scanSkintone() {
  const ctx = canvasSkin.getContext('2d');
  canvasSkin.width = videoSkin.videoWidth;
  canvasSkin.height = videoSkin.videoHeight;
  ctx.drawImage(videoSkin,0,0);

  const data = ctx.getImageData(0,0,canvasSkin.width,canvasSkin.height).data;
  let r=0,g=0,b=0;
  for(let i=0;i<data.length;i+=4){
    r+=data[i]; g+=data[i+1]; b+=data[i+2];
  }

  const brightness = (r+g+b)/data.length;
  if(brightness < 40){
    skinError.innerText = 'Pencahayaan terlalu gelap! Cari tempat terang.';
    return;
  }
  skinError.innerText = '';

  skinTone = r > b ? 'Warm' : 'Cool';
  palette = skinTone === 'Warm'
    ? ['#C68642','#A0522D','#DEB887']
    : ['#1E3A8A','#008080','#6D28D9'];

  skinResult.innerHTML = `
    <p>Skintone Terdeteksi: <b>${skinTone}</b></p>
    <p>Ini rekomendasi warna yang cocok untukmu:</p>
    <div style="display:flex;gap:10px">
      ${palette.map(c=>`<div style="width:40px;height:40px;background:${c}"></div>`).join('')}
    </div>
  `;
}

// FACE
function scanFace() {
  const shapes = ['bulat','oval','kotak','hati','panjang'];
  faceShape = shapes[Math.floor(Math.random()*shapes.length)];
  faceText.innerText = `Bentuk Wajah Anda: ${faceShape}`;
  imgHijab.src = `assets/hijab-${faceShape}.jpg`;
  imgRambut.src = `assets/rambut-${faceShape}.jpg`;
}

// BMI
function hitungBMI() {
  const w = +bb.value;
  const h = tb.value/100;
  bmi = w/(h*h);

  if(bmi<18.5){
    bmiStatus='Underweight';
    bmiCategory='kurus';
    bmiTips.innerText='Bulking: fokus surplus kalori & angkat beban';
  } else if(bmi<25){
    bmiStatus='Normal';
    bmiCategory='normal';
    bmiTips.innerText='Pertahankan pola hidup seimbang';
  } else {
    bmiStatus='Overweight';
    bmiCategory='gemuk';
    bmiTips.innerText='Cardio & defisit kalori';
  }

  bmiResult.innerText=`BMI: ${bmi.toFixed(1)} (${bmiStatus})`;

  mealTable.innerHTML=`
    <table>
      <tr><th>Waktu</th><th>Menu</th></tr>
      <tr><td>Pagi</td><td>Nasi uduk + telur + teh</td></tr>
      <tr><td>Siang</td><td>Nasi + ayam + sayur</td></tr>
      <tr><td>Sore</td><td>Buah + yoghurt</td></tr>
      <tr><td>Malam</td><td>Sup + tempe</td></tr>
    </table>
  `;
}

// JOURNAL
function renderJournal(){
  dateNow.innerText=new Date().toLocaleDateString('id-ID',{
    weekday:'long',day:'numeric',month:'long',year:'numeric'
  });

  journalContent.innerHTML=`
    <p>Skintone: ${skinTone}</p>
    ${palette.map(c=>`<div style="width:30px;height:30px;background:${c};display:inline-block"></div>`).join('')}
    <p>Bentuk Wajah: ${faceShape}</p>
    <img src="assets/hijab-${faceShape}.jpg"><p>Gaya Hijab yang Disarankan</p>
    <img src="assets/rambut-${faceShape}.jpg"><p>Gaya Rambut yang Disarankan</p>
    <p>BMI: ${bmi.toFixed(1)} (${bmiStatus})</p>
    <img src="assets/ootd-${bmiCategory}.jpg"><p>👩 OOTD Collection</p>
  `;
}

// PDF
function savePDF(){
  html2pdf().set({
    filename:`AuraFit-Journal-${Date.now()}.pdf`,
    html2canvas:{scale:2},
    jsPDF:{format:'a4'}
  }).from(document.getElementById('journal')).save();
}

function renderOOTD() {
  const img = document.getElementById('imgOOTD');
  img.src = `assets/ootd-${bmiCategory}.jpg`;
}
