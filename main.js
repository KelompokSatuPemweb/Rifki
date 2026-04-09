// ==================== LOGIN & LOGOUT ====================
const loginSection = document.getElementById('loginSection');
const loginForm = document.getElementById('loginForm');
const mainNav = document.querySelector('.main-nav');
const absensiSection = document.getElementById('absensiSection');
const jadwalSection = document.getElementById('jadwalSection');
const footer = document.querySelector('.main-footer');
const logoutBtn = document.getElementById('logoutBtn');

function showMainContent() {
    if (loginSection) loginSection.style.display = 'none';
    const loginFormDiv = document.querySelector('.login-Form');
    if (loginFormDiv) loginFormDiv.style.display = 'none';
    if (mainNav) mainNav.style.display = 'flex';
    if (absensiSection) absensiSection.classList.remove('hidden');
    if (footer) footer.style.display = 'block';
    
    const logoutContainer = document.querySelector('.logout-container');
    if (logoutContainer) logoutContainer.style.display = 'block';
    
    showSection('absensiSection');
}

function hideMainContent() {
    if (mainNav) mainNav.style.display = 'none';
    if (absensiSection) absensiSection.classList.add('hidden');
    if (jadwalSection) jadwalSection.classList.add('hidden');
    if (footer) footer.style.display = 'none';
    
    const logoutContainer = document.querySelector('.logout-container');
    if (logoutContainer) logoutContainer.style.display = 'none';
}

function checkLoginStatus() {
    if (localStorage.getItem('isLoggedIn') === 'true') {
        showMainContent();
    } else {
        hideMainContent();
        if (loginSection) loginSection.style.display = 'block';
        const loginFormDiv = document.querySelector('.login-Form');
        if (loginFormDiv) loginFormDiv.style.display = 'block';
    }
}

if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        if (username.length >= 3 && password.length >= 3) {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('username', username);
            alert(`Selamat datang, ${username}!`);
            showMainContent();
        } else {
            alert('Username dan Password minimal 3 karakter!');
        }
    });
}

function logout() {
    if (confirm('Apakah Anda yakin ingin logout? Data absensi dan jadwal akan tetap tersimpan.')) {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        hideMainContent();
        
        if (loginSection) loginSection.style.display = 'block';
        const loginFormDiv = document.querySelector('.login-Form');
        if (loginFormDiv) loginFormDiv.style.display = 'block';
        
        if (loginForm) loginForm.reset();
        alert('Logout berhasil!');
    }
}

if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
}

// ==================== NAVIGASI ====================
function showSection(sectionId) {
    const absensi = document.getElementById('absensiSection');
    const jadwal = document.getElementById('jadwalSection');
    if (absensi) absensi.classList.add('hidden');
    if (jadwal) jadwal.classList.add('hidden');
    document.getElementById(sectionId).classList.remove('hidden');
    
    if (sectionId === 'absensiSection') {
        loadAllAbsensi();
        updateRekapHariIni();
    } else if (sectionId === 'jadwalSection') {
        loadJadwalFromLocal();
    }
}

// ==================== LOGIKA ABSENSI ====================
function getTodayDate() {
    return new Date().toISOString().split('T')[0];
}

function saveAbsensiToLocal(data) {
    let absensiList = JSON.parse(localStorage.getItem('absensiData')) || [];
    absensiList.push(data);
    localStorage.setItem('absensiData', JSON.stringify(absensiList));
}

function deleteAbsensi(index) {
    let absensiList = JSON.parse(localStorage.getItem('absensiData')) || [];
    absensiList.splice(index, 1);
    localStorage.setItem('absensiData', JSON.stringify(absensiList));
    loadAllAbsensi();
    updateRekapHariIni();
}

function loadAllAbsensi() {
    const absensiList = JSON.parse(localStorage.getItem('absensiData')) || [];
    const tbody = document.querySelector('#tabelAbsensi tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    absensiList.forEach((item, index) => {
        const row = tbody.insertRow();
        row.insertCell(0).innerText = index + 1;
        row.insertCell(1).innerText = item.nama;
        row.insertCell(2).innerText = item.kelas;
        row.insertCell(3).innerText = item.tanggal;
        row.insertCell(4).innerText = item.status;
        const hapusCell = row.insertCell(5);
        const hapusBtn = document.createElement('button');
        hapusBtn.innerText = 'Hapus';
        hapusBtn.style.background = '#e74a3b';
        hapusBtn.style.color = 'white';
        hapusBtn.style.border = 'none';
        hapusBtn.style.padding = '5px 10px';
        hapusBtn.style.borderRadius = '5px';
        hapusBtn.style.cursor = 'pointer';
        hapusBtn.onclick = () => { deleteAbsensi(index); };
        hapusCell.appendChild(hapusBtn);
    });
}

function updateRekapHariIni() {
    const absensiList = JSON.parse(localStorage.getItem('absensiData')) || [];
    const today = getTodayDate();
    const todayAbsensi = absensiList.filter(item => item.tanggal === today);
    
    const hadir = todayAbsensi.filter(item => item.status === 'Hadir');
    const izin = todayAbsensi.filter(item => item.status === 'Izin');
    const sakit = todayAbsensi.filter(item => item.status === 'Sakit');
    const alpa = todayAbsensi.filter(item => item.status === 'Alpa');
    
    const listHadir = document.getElementById('listHadir');
    const listIzin = document.getElementById('listIzin');
    const listSakit = document.getElementById('listSakit');
    const listAlpa = document.getElementById('listAlpa');
    
    if (listHadir) listHadir.innerHTML = hadir.map(s => `<li>${s.nama} (${s.kelas})</li>`).join('') || '<li>Tidak ada</li>';
    if (listIzin) listIzin.innerHTML = izin.map(s => `<li>${s.nama} (${s.kelas})</li>`).join('') || '<li>Tidak ada</li>';
    if (listSakit) listSakit.innerHTML = sakit.map(s => `<li>${s.nama} (${s.kelas})</li>`).join('') || '<li>Tidak ada</li>';
    if (listAlpa) listAlpa.innerHTML = alpa.map(s => `<li>${s.nama} (${s.kelas})</li>`).join('') || '<li>Tidak ada</li>';
}

const formAbsensi = document.getElementById('formAbsensi');
if (formAbsensi) {
    formAbsensi.addEventListener('submit', function(e) {
        e.preventDefault();
        const nama = document.getElementById('namaSiswa').value.trim();
        const kelas = document.getElementById('kelasSiswa').value.trim();
        const tanggal = document.getElementById('tanggalAbsensi').value;
        const status = document.getElementById('statusAbsensi').value;
        
        if (!nama || !kelas || !tanggal || !status) {
            alert('Semua field harus diisi!');
            return;
        }
        
        saveAbsensiToLocal({ nama, kelas, tanggal, status });
        loadAllAbsensi();
        updateRekapHariIni();
        formAbsensi.reset();
        alert('Absensi berhasil disimpan!');
    });
}

// ==================== LOGIKA JADWAL ====================
function saveJadwalToLocal(data) {
    let jadwalList = JSON.parse(localStorage.getItem('jadwalData')) || [];
    jadwalList.push(data);
    localStorage.setItem('jadwalData', JSON.stringify(jadwalList));
}

function loadJadwalFromLocal() {
    const jadwalList = JSON.parse(localStorage.getItem('jadwalData')) || [];
    const tbody = document.querySelector('#tabelJadwal tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    jadwalList.forEach((item, index) => {
        const row = tbody.insertRow();
        row.insertCell(0).innerText = index + 1;
        row.insertCell(1).innerText = item.mapel;
        row.insertCell(2).innerText = item.guru;
        row.insertCell(3).innerText = item.hari;
        row.insertCell(4).innerText = item.jam;
        const hapusCell = row.insertCell(5);
        const hapusBtn = document.createElement('button');
        hapusBtn.innerText = 'Hapus';
        hapusBtn.style.background = '#e74a3b';
        hapusBtn.style.color = 'white';
        hapusBtn.style.border = 'none';
        hapusBtn.style.padding = '5px 10px';
        hapusBtn.style.borderRadius = '5px';
        hapusBtn.style.cursor = 'pointer';
        hapusBtn.onclick = () => {
            jadwalList.splice(index, 1);
            localStorage.setItem('jadwalData', JSON.stringify(jadwalList));
            loadJadwalFromLocal();
        };
        hapusCell.appendChild(hapusBtn);
    });
}

const formJadwal = document.getElementById('formJadwal');
if (formJadwal) {
    formJadwal.addEventListener('submit', function(e) {
        e.preventDefault();
        const mapel = document.getElementById('mapel').value.trim();
        const guru = document.getElementById('guru').value.trim();
        const hari = document.getElementById('hari').value;
        const jam = document.getElementById('jamMulai').value;
        
        if (!mapel || !guru || !hari || !jam) {
            alert('Semua field harus diisi!');
            return;
        }
        
        saveJadwalToLocal({ mapel, guru, hari, jam });
        loadJadwalFromLocal();
        formJadwal.reset();
        alert('Jadwal berhasil disimpan!');
    });
}

// ==================== INITIALISASI ====================
document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
    if (localStorage.getItem('isLoggedIn') === 'true') {
        loadAllAbsensi();
        updateRekapHariIni();
        loadJadwalFromLocal();
    }
});

function analyzeDOMDepth(node, currentLevel = 1, maxLevel = 4) {
  if (currentLevel > maxLevel) return null;

  let result = {
    tag: node.tagName ? node.tagName.toLowerCase() : 'text',
    level: currentLevel,
    children: []
  };

  // Batasi hanya elemen (nodeType 1) dan hindari teks agar tidak terlalu detail
  for (let child of node.children) {
    const childResult = analyzeDOMDepth(child, currentLevel + 1, maxLevel);
    if (childResult) result.children.push(childResult);
  }
  return result;
}

// Jalankan analisis dari <body>
const domTree = analyzeDOMDepth(document.body);
console.log('Struktur DOM hingga level 4:', JSON.stringify(domTree, null, 2));

// Opsional: tampilkan ringkasan per level
function logLevelSummary(node, level = 1) {
  if (level > 4) return;
  console.log(`Level ${level}:`, node.tagName ? node.tagName.toLowerCase() : 'text');
  for (let child of node.children) {
    logLevelSummary(child, level + 1);
  }
}
logLevelSummary(document.body);