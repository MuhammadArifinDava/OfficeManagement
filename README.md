# Full Stack Intern Test Project

**Status:** ✅ Completed & Deployed  
**License:** MIT

---

## 🚀 Live Demo

Berikut adalah link aplikasi yang sudah dideploy:

| Component | URL | Status | Platform |
| :--- | :--- | :---: | :--- |
| **Frontend (Client)** | [https://officedeck.netlify.app/](https://officedeck.netlify.app/) | 🟢 Online | Netlify |
| **Backend (API)** | [https://officedeck-f0267d5616c5.herokuapp.com/api](https://officedeck-f0267d5616c5.herokuapp.com/api) | 🟢 Online | Heroku |

> **Catatan Login:** Gunakan kredensial statis (Admin) yang telah disediakan di soal/database seeder.
> *   **Username:** `admin`
> *   **Password:** `password`

---

## 📖 Tentang Project

Project ini adalah solusi lengkap untuk **Full Stack Web Developer Intern Test**. Repository ini mencakup dua bagian utama:
1.  **FullStackTest**: Aplikasi utama (Employee Management System) dengan Laravel & React.
2.  **BackendNilaiTambah**: Implementasi logika backend khusus untuk pengolahan nilai (Bonus Task).

---

## 📂 Struktur Project

```bash
TestProject2/
├── FullStackTest/          # [UTAMA] Aplikasi Employee Management System
│   ├── api-laravel/        # Backend API (Laravel 12 + JWT)
│   └── client/             # Frontend (React 19 + Vite + Tailwind)
│
└── BackendNilaiTambah/     # [NILAI TAMBAH] Logika Pengolahan Data Khusus
    ├── app/Http/Controllers/NilaiController.php  # Logika Hitung RT & ST
    ├── start_db.bat        # Script start MySQL Port 3307
    └── ...
```

---

## ⭐ Bagian 1: Full Stack Test (Employee Management)

Aplikasi manajemen karyawan modern dengan fitur CRUD, autentikasi, dan pencarian real-time.

### **Fitur Unggulan**
*   **Autentikasi Aman:** Login menggunakan JWT (JSON Web Token) dengan persistent session.
*   **Manajemen Karyawan:** Create, Read, Update, Delete data karyawan dengan validasi lengkap.
*   **Pencarian & Filter:** Filter berdasarkan nama dan divisi yang tersimpan di URL (state persistence).
*   **UI Modern:** Dibangun dari nol menggunakan **Tailwind CSS** (tanpa library UI component) dengan desain Glassmorphism.
*   **Deploy Ready:** Sudah dikonfigurasi untuk deployment ke Heroku (Backend) dan Netlify (Frontend).

### **Tech Stack**
*   **Backend:** Laravel 12, MySQL 8, JWT-Auth.
*   **Frontend:** React 19, Vite 7, Axios, React Router v7.

---

## 🌟 Bagian 2: Backend Nilai Tambah (Bonus Task)

Folder `BackendNilaiTambah` berisi implementasi logika backend kompleks untuk pengolahan data nilai siswa.

### **Detail Implementasi (`NilaiController.php`)**

Saya telah mengerjakan logika perhitungan nilai sesuai instruksi pada controller ini:

#### **1. Endpoint `nilaiRT`**
*   **Logika:** Mengambil data nilai dengan `materi_uji_id = 7`.
*   **Filter:** Mengecualikan mata pelajaran "Pelajaran Khusus".
*   **Transformasi:** Melakukan grouping berdasarkan NISN dan mapping mata pelajaran menjadi key lowercase dinamis.
*   **Output:** JSON Report Card per siswa.

#### **2. Endpoint `nilaiST`**
*   **Logika:** Menghitung total skor bobot dengan `materi_uji_id = 4`.
*   **Pembobotan:**
    *   Verbal: x 41.67
    *   Kuantitatif: x 29.67
    *   Penalaran: x 100
    *   Figural: x 23.81
*   **Sorting:** Mengurutkan siswa berdasarkan Total Nilai tertinggi (Ranking).
*   **Teknis:** Menggunakan Raw SQL Query untuk performa kalkulasi agregasi yang efisien.

### **Setup Khusus (BackendNilaiTambah)**
Karena port 3306 digunakan oleh project utama, project ini dikonfigurasi menggunakan **MySQL Port 3307**.
*   Gunakan script `start_db.bat` di dalam folder untuk menjalankan instance MySQL lokal khusus project ini.
*   Konfigurasi `.env` telah disesuaikan ke `DB_PORT=3307`.

---

## 🚀 Panduan Instalasi (Local Development)

### **Setup FullStackTest (Utama)**

1.  **Backend (Laravel):**
    ```bash
    cd FullStackTest/api-laravel
    composer install
    cp .env.example .env  # Atur DB_PORT=3306
    php artisan key:generate
    php artisan migrate --seed
    php artisan serve
    ```

2.  **Frontend (React):**
    ```bash
    cd FullStackTest/client
    npm install
    npm run dev
    ```

### **Setup BackendNilaiTambah**

1.  Jalankan database khusus:
    ```bash
    cd BackendNilaiTambah
    start_db.bat
    ```
2.  Jalankan aplikasi:
    ```bash
    composer install
    php artisan serve
    ```

---

**Author:** Muhammad Arifin Dava
