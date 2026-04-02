function showSection(sectionId) {
    const sections = document.querySelectorAll(".content-section");
    sections.forEach(section => {
        section.classList.add("hidden");
    });
    document.getElementById(sectionId).classList.remove("hidden");
}


const daftarSiswa = [
    "Rifki Subhan Arifin",
    "Eriska Putri",
    "Arisula",
    "Hakim",
    "Muadz"
];

const daftarJadwal = [
    { mapel: "Matematika", guru: "Pak Ahmad", hari: "Senin", jam: "07:00" },
    { mapel: "Bahasa Indonesia", guru: "Bu Rina", hari: "Selasa", jam: "08:00" },
    { mapel: "Pemrograman Web", guru: "Pak Hakim", hari: "Rabu", jam: "09:00" },
    { mapel: "Basis Data", guru: "Bu Siti", hari: "Kamis", jam: "10:00" },
    { mapel: "Jaringan Komputer", guru: "Pak Muadz", hari: "Jumat", jam: "11:00" }
];

let dataAbsensi = JSON.parse(localStorage.getItem("dataAbsensi")) || [];


const selectSiswa = document.getElementById("namaSiswa");

function generateDropdownSiswa() {
    daftarSiswa.forEach(nama => {
        const option = document.createElement("option");
        option.value = nama;
        option.textContent = nama;
        selectSiswa.appendChild(option);
    });
}


const formAbsensi = document.getElementById("formAbsensi");
const tabelAbsensi = document.querySelector("#tabelAbsensi tbody");

function renderAbsensi() {
    tabelAbsensi.innerHTML = "";

    dataAbsensi.forEach((item, index) => {
        const row = `
            <tr>
                <td>${index + 1}</td>
                <td>${item.nama}</td>
                <td>${item.tanggal}</td>
                <td>${item.status}</td>
                <td>
                    <button onclick="hapusAbsensi(${index})">Hapus</button>
                </td>
            </tr>
        `;
        tabelAbsensi.innerHTML += row;
    });

    localStorage.setItem("dataAbsensi", JSON.stringify(dataAbsensi));
}

function hapusAbsensi(index) {
    dataAbsensi.splice(index, 1);
    renderAbsensi();
}

formAbsensi.addEventListener("submit", function (e) {
    e.preventDefault();

    const nama = document.getElementById("namaSiswa").value;
    const tanggal = document.getElementById("tanggalAbsensi").value;
    const status = document.getElementById("statusAbsensi").value;

    if (!nama || !tanggal || !status) {
        alert("Semua field harus diisi!");
        return;
    }

    const absensiBaru = {
        nama,
        tanggal,
        status
    };

    dataAbsensi.push(absensiBaru);
    formAbsensi.reset();
    renderAbsensi();
});


const tabelJadwal = document.querySelector("#tabelJadwal tbody");

function renderJadwal() {
    tabelJadwal.innerHTML = "";

    daftarJadwal.forEach((item, index) => {
        const row = `
            <tr>
                <td>${index + 1}</td>
                <td>${item.mapel}</td>
                <td>${item.guru}</td>
                <td>${item.hari}</td>
                <td>${item.jam}</td>
            </tr>
        `;
        tabelJadwal.innerHTML += row;
    });
}

document.addEventListener("DOMContentLoaded", function () {
    generateDropdownSiswa();
    renderAbsensi();
    renderJadwal();
});

// Vanilla JS Local Storage Validation
function safeSave(key, data) {
  if (typeof data !== 'object' || data === null) return false;
  const json = JSON.stringify(data);
  if (json.length > 5000000) return false; // cek quota
  try {
    localStorage.setItem(key, json);
    return true;
  } catch (e) { return false; }
}

const formLogin = document.getElementById('loginForm');
    // Secara otomatis, tombol tipe submit akan bereaksi terhadap 'Enter'
    formLogin.addEventListener('submit', function(event) {
        event.preventDefault();
        console.log('Form berhasil disubmit dengan Enter!');
        // Lakukan validasi atau aksi lainnya di sini
    });