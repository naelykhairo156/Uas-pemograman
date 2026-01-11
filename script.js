let currentStep = 0;
const steps = document.querySelectorAll('.step');

let skintone = '';
let face = '';
let bmiValue = '';
let bmiCategory = '';

function showStep() {
  steps.forEach((s, i) => {
    s.classList.toggle('active', i === currentStep);
  });
}

function nextStep() {
  if (currentStep < steps.length - 1) currentStep++;
  showStep();
}

function prevStep() {
  if (currentStep > 0) currentStep--;
  showStep();
}

/* SKINTONE */
function scanSkintone() {
  const tones = ['Warm Autumn', 'Cool Winter', 'Soft Summer', 'Bright Spring'];
  skintone = tones[Math.floor(Math.random() * tones.length)];
  document.getElementById('skintoneResult').innerHTML =
    `<p><strong>${skintone}</strong><br>Palet warna lembut & elegan direkomendasikan 🌸</p>`;
}

/* FACE */
function scanFace() {
  const faces = ['oval', 'bulat', 'kotak', 'hati', 'panjang'];
  face = faces[Math.floor(Math.random() * faces.length)];

  document.getElementById('faceResult').innerHTML =
    `<p>Bentuk wajah kamu: <strong>${face}</strong></p>`;

  document.getElementById('hijabImg').src = `./assets/hijab-${face}.jpg`;
  document.getElementById('hairImg').src = `./assets/rambut-${face}.jpg`;
}

/* BMI */
function hitungBMI() {
  const bb = document.getElementById('bb').value;
  const tb = document.getElementById('tb').value / 100;
  const bmi = (bb / (tb * tb)).toFixed(1);
  bmiValue = bmi;

  if (bmi < 18.5) bmiCategory = 'kurus';
  else if (bmi < 25) bmiCategory = 'normal';
  else bmiCategory = 'gemuk';

  document.getElementById('bmiResult').innerHTML =
    `<p>BMI kamu: <strong>${bmi}</strong> (${bmiCategory})</p>`;

  document.getElementById('mealTable').innerHTML = `
    <table>
      <tr><th>Pagi</th><th>Siang</th><th>Sore</th><th>Malam</th></tr>
      <tr><td>Nasi & Telur</td><td>Nasi Ayam</td><td>Buah</td><td>Sup</td></tr>
    </table>
  `;

  document.getElementById('ootdImg').src =
    `./assets/ootd-${bmiCategory}.jpg`;

  updateJournal();
}

/* JOURNAL */
function updateJournal() {
  document.getElementById('jSkintone').innerText = skintone;
  document.getElementById('jFace').innerText = face;
  document.getElementById('jBMI').innerText = bmiValue;

  document.getElementById('jHijab').src = `./assets/hijab-${face}.jpg`;
  document.getElementById('jHair').src = `./assets/rambut-${face}.jpg`;
  document.getElementById('jOOTD').src = `./assets/ootd-${bmiCategory}.jpg`;

  document.getElementById('jMeal').innerHTML =
    document.getElementById('mealTable').innerHTML;

  const now = new Date();
  document.getElementById('date').innerText =
    now.toLocaleDateString('id-ID', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
}
