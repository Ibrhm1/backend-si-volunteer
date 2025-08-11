# 📌 Backend API - siVolunteer

Backend untuk platform **siVolunteer**, sebuah sistem manajemen kegiatan kerelawanan dengan fitur autentikasi, manajemen user, organizer, event, kategori, volunteer, image, dan region.  
Dibangun menggunakan **Express.js** dengan arsitektur RESTful, dokumentasi API via **Swagger**, dan sistem **Role-Based Access Control (ACL)**.

---

## 🚀 Teknologi yang Digunakan

- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose**
- **Swagger** untuk dokumentasi API
- **JSON Web Token (JWT)** untuk autentikasi
- **Bcrypt** untuk hashing password
- **Multer** untuk upload file
- **Cors**, **Helmet**, dan **morgan** untuk keamanan & logging
- **dotenv** untuk konfigurasi environment
- **yup** untuk validasi data
- **zoho** provider untuk mengirim email
- **cloudinary** provider untuk mengupload gambar

---

## 📂 Struktur Proyek

```bash
📦src
 ┣ 📂controllers
 ┃ ┣ 📜auth.controller.ts
 ┃ ┣ 📜categories.controller.ts
 ┃ ┣ 📜events.controller.ts
 ┃ ┣ 📜eventVolunteer.controller.ts
 ┃ ┣ 📜faq.controller.ts
 ┃ ┣ 📜image.controller.ts
 ┃ ┣ 📜organizer.controller.ts
 ┃ ┣ 📜region.controller.ts
 ┃ ┗ 📜user.controller.ts
 ┣ 📂middlewares
 ┃ ┣ 📜acl.middleware.ts
 ┃ ┣ 📜auth.middleware.ts
 ┃ ┣ 📜errorGlobal.middleware.ts
 ┃ ┗ 📜media.middleware.ts
 ┣ 📂models
 ┃ ┣ 📜categories.model.ts
 ┃ ┣ 📜events.model.ts
 ┃ ┣ 📜eventVolunteer.model.ts
 ┃ ┣ 📜faq.model.ts
 ┃ ┣ 📜organizers.model.ts
 ┃ ┣ 📜region.model.ts
 ┃ ┗ 📜user.model.ts
 ┣ 📂routes
 ┃ ┗ 📜api.ts
 ┣ 📂utils
 ┃ ┣ 📂mails
 ┃ ┃ ┣ 📂templates
 ┃ ┃ ┃ ┣ 📜registration-organizer.ejs
 ┃ ┃ ┃ ┗ 📜registration-succes.ejs
 ┃ ┃ ┗ 📜mail.ts
 ┃ ┣ 📜constant.ts
 ┃ ┣ 📜database.ts
 ┃ ┣ 📜encryption.ts
 ┃ ┣ 📜env.ts
 ┃ ┣ 📜interfaces.ts
 ┃ ┣ 📜jwt.ts
 ┃ ┣ 📜response.ts
 ┃ ┗ 📜uploader.ts
 ┗ 📜index.ts
```

---

## ⚙️ Instalasi

1. **Clone repository**
   ```bash
   git clone https://github.com/Ibrhm1/backend-si-volunteer.git
   cd sivolunteer-backend
   ```
2. **Install depedencies**
   ```bash
   npm install
   ```
3. **Buat file .env**

   ```env
   DATABASE_URL=""
   SECRET="your_secret"
   EMAIL_SMTP_SECURE=boolean
   EMAIL_SMTP_PASS="your_password"
   EMAIL_SMTP_USER="your_email"
   EMAIL_SMTP_PORT=your_port
   EMAIL_SMTP_HOST="smtp.zoho.com"
   EMAIL_SMTP_SERVICE_NAME="Zoho"
   CLIENT_HOST=""
   API_CLOUDINARY_NAME="your_name"
   API_CLOUDINARY_KEY="your_key"
   API_CLOUDINARY_SECRET="your_secret"
   API_CLOUDINARY_URL="your_url"
   ```

4. **Jalankan server**
   ```bash
   npm run dev
   ```

---

## 🔑 Role-Based Access Control (ACL)

1. **Admin**: Mengelola semua data (User, Organizer, Event, Kategori, Volunteer, Region)
2. **Organizer**: Membuat dan mengelola event, melihat daftar volunteer yang mendaftar pada event
3. **Member**: Melihat event, mendaftar sebagai volunteer

---

## 📖 Dokumentasi API

Dokumentasi API lengkap menggunakan swagger pada link berikut:
[Dokumetasi API SIVOLUNTEER](https://api-si-volunteer.vercel.app/api-docs/)

---

## 📌 Endpoint Utama

1. AUTH
   **_Login user dan organizer_**
   ```
   POST /auth/login
   ```
   **_Activasi akun setelah registrasi_**
   ```
   POST /auth/activation
   ```
   **_Mengambil user atau organizer yang sudah login_**
   ```
   GET /auth/get-progile
   ```
2. USER
   **_Registrasi Member_**

   ```
   POST /auth/register
   ```

   **_Ambil Semua Member_**

   ```
   GET /member
   ```

   **_Ambil Member Berdasarkan Id_**

   ```
   GET /member/{id}
   ```

   **_Update Profile Member_**

   ```
   PUT /auth/update-profile
   ```

   **_Update Password Member_**

   ```
   PUT /auth/update-password
   ```

3. ORGANIZER
   **_Registrasi Organizer_**

   ```
   POST /auth/register/organizers
   ```

   **_Ambil Semua Organizer_**

   ```
   GET /organizers
   ```

   **_Ambil Organizer Berdasarkan Id_**

   ```
   GET /organizers/{id}
   ```

   **_Update Profile Organizer_**

   ```
   PUT /auth/update-profile/organizers
   ```

   **_Update Password Organizer_**

   ```
   PUT /auth/update-password/organizers
   ```

4. CATEGORY
   **_Membuat Category_**

   ```
   POST /category
   ```

   **_Ambil Semua Category_**

   ```
   GET /category
   ```

   **_Ambil Category Berdasarkan Id_**

   ```
   GET /category/{id}
   ```

   **_Update Category_**

   ```
   PUT /category/{id}
   ```

   **_Hapus Category_**

   ```
   DELETE /category/{id}

   ```

5. EVENTS
   **_Membuat Event_**

   ```
   POST /events
   ```

   **_Ambil Semua Event_**

   ```
   GET /events
   ```

   **_Ambil Event Berdasarkan Token Organizer_**

   ```
   GET /events/organizers
   ```

   **_Ambil Event Berdasarkan Id_**

   ```
   GET /events/{id}
   ```

   **_Update Event_**

   ```
   PUT /events/{id}
   ```

   **_Hapus Event_**

   ```
   DELETE /events/{id}
   ```

   **_Ambil Event Berdasarakan CreatedBy_**

   ```
   GET /events/createdBy/{organizerId}
   ```

   **_Ambil Event Berdasarkan Slug_**

   ```

   GET /events/{slug}/slug
   ```

6. Frequently Asked Questions
   **_Membuat Faq_**

   ```
   POST /faqs
   ```

   **_Ambil Semua Faq_**

   ```
   GET /faqs
   ```

   **_Ambil Faq Berdasarkan Id_**

   ```
   GET /faqs/{id}
   ```

   **_Update Faq_**

   ```
   PUT /faqs/{id}
   ```

   **_Hapus Faq_**

   ```
   DELETE /faqs/{id}

   ```

7. Event Volunteer
   **_Member Mendaftar Event_**

   ```
   POST /event-volunteers/{eventId}
   ```

   **_Ambil Event Volunteer Berdasarkan Event Id_**

   ```
   GET /event-volunteers/{eventId}
   ```

   **_Ambil Semua Event Volunteer_**

   ```
   GET /event-volunteers
   ```

   **_Ambil Event Volunter Berdasarkan Token Member_**

   ```
   GET /event-volunteers/member
   ```

   **_Update Status Event Volunteer_**

   ```
   PUT /event-volunteers/{eventVolunteerId}/status
   ```

   **_Hapus Event Volunteer_**

   ```
   DELETE /event-volunteers/{eventVolunteerId}
   ```

8. Image File
   **_Upload 1 Gambar_**

   ```
   POST /image/upload-single
   ```

   **_Hapus Gambar_**

   ```
   DELETE /image/delete-file
   ```

9. Regions
   **_Ambil Semua Regions (Daerah)_**
   ```
   GET /regions
   ```
   **_Ambil Regions Berdasarkan Id Provinsi_**
   ```
   GET /regions/{id}/province
   ```
   **_Ambil Regions Berdasarkan Id Kabupaten/Kota_**
   ```
   GET /regions/{id}/regency
   ```
   **_Ambil Regions Berdasarkan Id Daerah_**
   ```
   GET /regions/{id}/district
   ```
   **_Ambil Regions Berdasarkan Id Desa_**
   ```
   GET /regions/{id}/village
   ```
   **_Ambil Regions Berdasarkan Pencarian Nama Kota_**
   ```
   GET /regions-search
   ```
