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


// -------------------- SOAL 1: IndexedDB untuk data besar terstruktur --------------------
const DB_NAME = 'SekolahDB';
const DB_VERSION = 1;
let dbInstance = null;

function openIndexedDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            dbInstance = request.result;
            resolve(dbInstance);
        };
        request.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains('historyAbsensi')) {
                const store = db.createObjectStore('historyAbsensi', { keyPath: 'id', autoIncrement: true });
                store.createIndex('tanggal', 'tanggal', { unique: false });
            }
        };
    });
}

async function saveToIndexedDB(data) {
    const db = await openIndexedDB();
    const tx = db.transaction('historyAbsensi', 'readwrite');
    tx.objectStore('historyAbsensi').add(data);
    tx.oncomplete = () => console.log('Data historis tersimpan di IndexedDB');
}

// -------------------- SOAL 2: Parsing CSV/JSON ke state & ekspor --------------------
function exportAbsensiToJSON() {
    const absensiList = JSON.parse(localStorage.getItem('absensiData')) || [];
    const jsonStr = JSON.stringify(absensiList, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'absensi_export.json';
    a.click();
    URL.revokeObjectURL(url);
}

function exportAbsensiToCSV() {
    const absensiList = JSON.parse(localStorage.getItem('absensiData')) || [];
    if (absensiList.length === 0) return alert('Tidak ada data untuk diekspor');
    const headers = ['nama', 'kelas', 'tanggal', 'status'];
    const csvRows = [headers.join(',')];
    for (const item of absensiList) {
        const values = headers.map(h => `"${item[h] || ''}"`);
        csvRows.push(values.join(','));
    }
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'absensi_export.csv';
    a.click();
    URL.revokeObjectURL(url);
}

function importFromJSON(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            if (Array.isArray(data)) {
                localStorage.setItem('absensiData', JSON.stringify(data));
                loadAllAbsensi();
                updateRekapHariIni();
                alert('Import JSON berhasil!');
            } else throw new Error();
        } catch { alert('File JSON tidak valid'); }
    };
    reader.readAsText(file);
}

// -------------------- SOAL 3: Cookies dengan atribut waktu & lokasi --------------------
function setCookieWithAttributes(name, value, maxAgeSeconds, path = '/') {
    document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; max-age=${maxAgeSeconds}; path=${path}; SameSite=Lax`;
}

function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + encodeURIComponent(name) + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
}
// -------------------- SOAL 4: Class & perbedaan variabel lokal/global --------------------
class AbsensiManager {
    constructor() {
        this._data = [];
    }
    load() {
        this._data = JSON.parse(localStorage.getItem('absensiData')) || [];
        return this._data;
    }
    add(record) {
        this._data.push(record);
        localStorage.setItem('absensiData', JSON.stringify(this._data));
    }
}
window.globalAppVersion = '1.0.0'; // variabel global (minimalkan penggunaan)

// -------------------- SOAL 5: window.history.pushState untuk navigasi SPA tanpa reload --------------------
const originalShowSection = showSection;
window.showSection = function(sectionId) {
    originalShowSection(sectionId);
    const state = { section: sectionId };
    const url = new URL(window.location);
    url.searchParams.set('section', sectionId);
    history.pushState(state, '', url);
};

window.addEventListener('popstate', (event) => {
    if (event.state && event.state.section) {
        originalShowSection(event.state.section);
    } else {
        originalShowSection('absensiSection');
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const section = params.get('section');
    if (section && (section === 'absensiSection' || section === 'jadwalSection')) {
        originalShowSection(section);
    }
});

// -------------------- SOAL 6: Operasi async agar tidak freezing --------------------
async function loadDataAsync() {
    try {
        showLoadingSpinner(true);
        await new Promise(resolve => setTimeout(resolve, 2000)); // simulasi fetch
        const data = JSON.parse(localStorage.getItem('absensiData')) || [];
        updateRekapHariIni();
    } catch (error) {
        console.error('Async error:', error);
    } finally {
        showLoadingSpinner(false);
    }
}

function showLoadingSpinner(show) {
    let spinner = document.getElementById('globalSpinner');
    if (!spinner && show) {
        spinner = document.createElement('div');
        spinner.id = 'globalSpinner';
        spinner.style.position = 'fixed';
        spinner.style.top = '50%';
        spinner.style.left = '50%';
        spinner.innerText = 'Loading...';
        document.body.appendChild(spinner);
    }
    if (spinner) spinner.style.display = show ? 'block' : 'none';
}
// Panggil loadDataAsync() jika perlu refresh data besar tanpa freeze UI.

// -------------------- SOAL 7: Modularitas render komponen (peningkatan) --------------------
function renderRekapContainer(containerId, data) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `<div class="rekap">Hadir: ${data.hadir}, Izin: ${data.izin}</div>`;
    }
}
const eventBus = new EventTarget();

const originalSaveAbsensi = saveAbsensiToLocal;
window.saveAbsensiToLocal = function(data) {
    originalSaveAbsensi(data);
    const absensiEvent = new CustomEvent('absensiAdded', { detail: data });
    eventBus.dispatchEvent(absensiEvent);
};

// Modul lain bisa mendengarkan:
eventBus.addEventListener('absensiAdded', (e) => {
    console.log('Absensi baru (custom event):', e.detail);
});

// -------------------- SOAL 9: Perkembangan SPA sederhana ke lanjutan --------------------
// Catatan: SPA sederhana (kode awal) vs SPA lanjutan (modular, state management, routing)
// Berikut contoh kerangka modular (dapat dipisah ke file terpisah):
/*
// store.js
export let store = { absensi: [] };
// router.js
import { renderPage } from './pages.js';
export function router(path) { ... }
// main.js

import { router } from './router.js';
window.onpopstate = () => router(location.pathname);
*/

// -------------------- SOAL 10: Integrasi AI dalam SPA --------------------
async function getAIScheduleRecommendation(hari) {
    try {
        // Contoh panggilan ke API AI (mock endpoint, ganti dengan endpoint nyata jika ada)
        const response = await fetch('https://jsonplaceholder.typicode.com/posts/1', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        const recommendation = data.title || 'Tidak ada saran dari AI';
        let aiContainer = document.getElementById('aiRecommendation');
        if (!aiContainer) {
            aiContainer = document.createElement('div');
            aiContainer.id = 'aiRecommendation';
            document.querySelector('.jadwal-container')?.appendChild(aiContainer);
        }
        aiContainer.innerText = `AI Rekomendasi untuk ${hari}: ${recommendation}`;
    } catch (error) {
        console.log('AI tidak tersedia, gunakan mode offline');
        const aiContainer = document.getElementById('aiRecommendation');
        if (aiContainer) aiContainer.innerText = 'Gunakan jadwal default (AI offline)';
    }
}

// ==================== SOAL 9: PENgeCEKAN SEBELUM LOCALSTORAGE ====================
function safeSaveToLocalStorage(key, data) {
    if (!window.localStorage) {
        alert('Browser tidak mendukung LocalStorage');
        return false;
    }
    try {
        const serialized = JSON.stringify(data);
        // Perkiraan batas 5MB (5 * 1024 * 1024 bytes)
        if (serialized.length > 5 * 1024 * 1024) {
            throw new Error('Ukuran data melebihi 5MB');
        }
        localStorage.setItem(key, serialized);
        return true;
    } catch (e) {
        console.error('Gagal simpan ke localStorage:', e);
        alert('Penyimpanan gagal: ' + e.message);
        return false;
    }
}

// Ubah fungsi saveAbsensiToLocal dan saveJadwalToLocal menggunakan safeSave
function saveAbsensiToLocal(data) {
    let absensiList = JSON.parse(localStorage.getItem('absensiData')) || [];
    absensiList.push(data);
    safeSaveToLocalStorage('absensiData', absensiList);
}

function saveJadwalToLocal(data) {
    let jadwalList = JSON.parse(localStorage.getItem('jadwalData')) || [];
    jadwalList.push(data);
    safeSaveToLocalStorage('jadwalData', jadwalList);
}