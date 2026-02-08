# Full Stack Intern Test Project

Project ini adalah solusi lengkap untuk **Full Stack Web Developer Intern Test**, menggabungkan **Laravel 12 (Backend)** dan **React 19 + Vite 7 (Frontend)** menjadi aplikasi web modern, responsif, dan dinamis.

Project ini dirancang dengan arsitektur **Decoupled (Terpisah)** antara Frontend dan Backend, berkomunikasi melalui **REST API** dengan autentikasi **JWT (JSON Web Token)**.

---

## 🛠️ Tech Stack

### **Backend (Server-Side)**
*   **Framework:** Laravel 12.x
*   **Language:** PHP 8.2+
*   **Database:** MySQL 8.0
*   **Authentication:** `tymon/jwt-auth` (JWT)
*   **API Testing:** Postman / Thunder Client

### **Frontend (Client-Side)**
*   **Framework:** React 19
*   **Build Tool:** Vite 7
*   **Styling:** Tailwind CSS 3.4 (Pure Utility Classes)
*   **Routing:** React Router DOM 7
*   **HTTP Client:** Axios
*   **Animations:** Framer Motion, GSAP, React Parallax Tilt
*   **State Management:** React Hooks (`useState`, `useEffect`, `useContext`) + URL Search Params

---

## ✨ Fitur Unggulan

### **1. Autentikasi & Keamanan**
*   ✅ **JWT Authentication:** Login aman menggunakan token stateless.
*   ✅ **Persistent Login:** Sesi pengguna bertahan meskipun halaman di-refresh (menyimpan token di LocalStorage).
*   ✅ **Protected Routes:** Halaman Dashboard dan CRUD tidak dapat diakses tanpa login.
*   ✅ **Auto-Redirect:** Pengguna yang belum login otomatis diarahkan ke `/login`.

### **2. Manajemen Data (CRUD Karyawan)**
*   ✅ **Create:** Tambah karyawan baru dengan validasi input & upload gambar.
*   ✅ **Read:** Menampilkan daftar karyawan dengan **Pagination Custom** (tanpa library UI).
*   ✅ **Update:** Edit data karyawan secara real-time.
*   ✅ **Delete:** Hapus data karyawan dengan konfirmasi.

### **3. UI/UX Modern (Frontend)**
*   ✅ **Pure Tailwind CSS:** Tidak menggunakan library komponen (seperti MUI/Chakra/Bootstrap). Semua komponen (Modal, Card, Dropdown, Pagination) dibuat dari nol (scratch).
*   ✅ **State Persistence via URL:** Pencarian dan filter tersimpan di URL (contoh: `?q=Budi&division_id=1&page=2`). Saat di-refresh, hasil pencarian tidak hilang.
*   ✅ **Glassmorphism Design:** Tampilan modern dengan efek blur dan transparansi.
*   ✅ **Dark Mode Support:** Mengikuti preferensi sistem operasi pengguna.
*   ✅ **3D Animations:** Efek interaktif pada kartu dan elemen UI.

---

## 📂 Struktur Folder Project

```
TestProject2/
├── FullStackTest/          # Folder Utama Project
│   ├── api-laravel/        # Backend Laravel Application
│   │   ├── app/            # Controllers, Models, Middleware
│   │   ├── routes/         # Definisi Route API (api.php)
│   │   ├── database/       # Migrations & Seeders
│   │   └── .env            # Konfigurasi Environment (DB, JWT)
│   │
│   └── client/             # Frontend React Application
│       ├── src/
│       │   ├── components/ # Reusable Components (Card, Modal, etc)
│       │   ├── pages/      # Halaman Utama (Login, Dashboard)
│       │   ├── lib/        # Konfigurasi Axios (api.js)
│       │   └── assets/     # Gambar & Icons
│       └── .env            # Konfigurasi API URL
│
└── BackendNilaiTambah/     # (Legacy/Deprecated) Folder backend lama
```

---

## 🚀 Panduan Instalasi (Local Development)

Ikuti langkah-langkah ini untuk menjalankan project di komputer lokal Anda.

### **Prasyarat**
Pastikan Anda sudah menginstall:
1.  **PHP** >= 8.2 & **Composer**
2.  **Node.js** (LTS) & **NPM**
3.  **MySQL Server** (XAMPP/Laragon)

---

### **Langkah 1: Setup Backend (Laravel)**

1.  Buka terminal dan masuk ke folder backend:
    ```bash
    cd FullStackTest/api-laravel
    ```

2.  Install dependency PHP:
    ```bash
    composer install
    ```

3.  Duplikasi file konfigurasi `.env`:
    ```bash
    cp .env.example .env
    ```

4.  **PENTING:** Edit file `.env` dan sesuaikan konfigurasi Database Anda.
    *   Jika menggunakan default XAMPP/Laragon:
    ```env
    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306        # Ganti ke 3307 jika menggunakan port custom
    DB_DATABASE=fullstack_test
    DB_USERNAME=root
    DB_PASSWORD=
    ```

5.  Generate App Key & JWT Secret:
    ```bash
    php artisan key:generate
    php artisan jwt:secret --force
    ```

6.  Jalankan Migrasi Database & Seeder (Untuk data awal Admin & Divisi):
    ```bash
    php artisan migrate --seed
    ```

7.  Jalankan Server Backend:
    ```bash
    php artisan serve
    ```
    *Server akan berjalan di `http://127.0.0.1:8000`*

---

### **Langkah 2: Setup Frontend (React)**

1.  Buka terminal **baru** (jangan matikan terminal backend) dan masuk ke folder client:
    ```bash
    cd FullStackTest/client
    ```

2.  Install dependency Node.js:
    ```bash
    npm install
    ```

3.  Pastikan file `.env` (atau buat jika belum ada) mengarah ke backend yang benar:
    ```env
    VITE_API_URL=http://127.0.0.1:8000/api
    ```

4.  Jalankan Server Frontend:
    ```bash
    npm run dev
    ```
    *Aplikasi akan berjalan di `http://localhost:5173`*

---

### **Langkah 3: Login Aplikasi**

Buka browser dan akses `http://localhost:5173`. Gunakan kredensial berikut (dari Seeder):

*   **Username:** `admin`
*   **Password:** `password`

---

## 🌐 Panduan Deployment (Saran)

Untuk deployment ke production, disarankan memisahkan hosting Frontend, Backend, dan Database agar lebih stabil dan hemat biaya.

### **1. Database (PostgreSQL/MySQL)**
*   **Platform:** **Supabase** (Free Tier sangat bagus) atau **Railway**.
*   Buat database baru, dapatkan kredensial (Host, User, Pass, DB Name).

### **2. Backend (Laravel)**
*   **Platform:** **Render** (Free) atau **Railway** (Recommended).
*   Upload kode `api-laravel` ke GitHub.
*   Connect ke Render/Railway.
*   Set Environment Variables (`DB_HOST`, `DB_PASSWORD`, dll) sesuai data dari Supabase.
*   Jalankan command build: `composer install --no-dev --optimize-autoloader`.

### **3. Frontend (React)**
*   **Platform:** **Vercel** atau **Netlify** (Free).
*   Upload kode `client` ke GitHub.
*   Connect ke Vercel.
*   Set Environment Variable:
    ```env
    VITE_API_URL=https://url-backend-anda-di-render.com/api
    ```
*   Vercel akan otomatis melakukan build (`npm run build`).

---

## 🔌 API Endpoints (Dokumentasi Singkat)

Berikut adalah daftar endpoint utama yang tersedia di Backend:

| Method | Endpoint | Deskripsi | Auth? |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/login` | Login user & dapatkan token | ❌ |
| `POST` | `/api/logout` | Logout & invalidasi token | ✅ |
| `GET` | `/api/me` | Ambil data user yang sedang login | ✅ |
| `GET` | `/api/employees` | List karyawan (support search/filter) | ✅ |
| `POST` | `/api/employees` | Tambah karyawan baru | ✅ |
| `PUT` | `/api/employees/{id}` | Update data karyawan | ✅ |
| `DELETE` | `/api/employees/{id}` | Hapus karyawan | ✅ |
| `GET` | `/api/divisions` | List semua divisi | ✅ |

---

**Author:** Trae AI Assistant & User
**License:** MIT
