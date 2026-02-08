# Minimalism Blog Platform

A full-stack blog application built with the **MERN stack** (MongoDB, Express, React, Node.js). This project demonstrates a modern, responsive, and feature-rich blogging platform where users can read, create, edit, and delete posts, as well as manage their profiles and comments.

## 🚀 Live Demo

- **Frontend (Netlify):** https://minimalismdav.netlify.app/
- **Backend (Heroku):** https://minimalism-a93d11758d8d.herokuapp.com
- Link Assignment Video Recording (Behavioral): (https://drive.google.com/file/d/1s1ku9yK_Ja__nAx_3zsbxv_wkHvOj9XW/view?usp=sharing)

## 🛠 Tech Stack

### Frontend
- **Framework:** React 19 (Vite)
- **Styling:** Tailwind CSS, `@tailwindcss/typography`
- **Animation:** Framer Motion, GSAP, React Parallax Tilt
- **State/Routing:** React Router DOM v7, Context API
- **HTTP Client:** Axios
- **Markdown:** `react-markdown`, `remark-gfm`

### Backend
- **Runtime:** Node.js (v20.x), Express.js
- **Database:** MongoDB Atlas (Mongoose ODM)
- **Authentication:** JWT (JSON Web Tokens), Bcrypt

### Tools & DevOps
- **Monorepo Management:** `npm-run-all`
- **Version Control:** Git
- **Deployment:** Netlify (Client) + Heroku (Server)

## ✨ Features

- **User Authentication:** Register, Login, Logout (JWT-based).
- **CRUD Operations:**
  - **Posts:** Create, Read, Update, Delete (Owner protected).
  - **Comments:** Add, Edit, Delete comments on posts.
- **Search & Pagination:** Filter posts by title/content and navigate through pages.
- **Rich Content:** Write posts using **Markdown** syntax.
- **Profile Management:** View user profiles and upload profile pictures.
- **Responsive Design:** Fully optimized for Mobile, Tablet, and Desktop.
- **Modern UI:** Clean aesthetic with smooth animations and transitions.

## 📂 Project Structure

This project uses a **Monorepo** structure:

```
FullStackTest/
├── client/         # React Frontend
│   ├── src/
│   └── ...
├── server/         # Express Backend
│   ├── src/
│   ├── uploads/    # Static file storage
│   └── ...
└── package.json    # Root scripts
```

## ⚙️ Installation & Local Setup

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (Local or Atlas Connection String)

### Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd FullStackTest
   ```

2. **Install Dependencies** (Root, Client, and Server)
   ```bash
   npm run setup
   ```

3. **Environment Configuration**

   **Backend:**
   - Create `server/.env` based on `server/.env.example`.
   - Required variables:
     ```env
     PORT=5001
     MONGO_URI=mongodb://localhost:27017/blog_platform
     JWT_SECRET=your_super_secret_key
     CLIENT_ORIGIN=http://localhost:5173
     ```

   **Frontend:**
   - Create `client/.env` based on `client/.env.example`.
   - Required variables:
     ```env
     VITE_API_URL=http://localhost:5001
     ```

4. **Seed Database (Optional)**
   Populate the database with dummy users and posts:
   ```bash
   node server/seed.js
   ```

5. **Run Development Server**
   Start both Client and Server concurrently:
   ```bash
   npm run dev
   ```
   - Frontend: `http://localhost:5173`
   - Backend: `http://localhost:5001`

## 📖 API Documentation

### Auth
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout

### Posts
- `GET /posts` - List all posts (Supports `?page=1&limit=10&q=keyword`)
- `GET /posts/:id` - Get single post details
- `POST /posts` - Create new post (Auth required)
- `PUT /posts/:id` - Update post (Owner only)
- `DELETE /posts/:id` - Delete post (Owner only)

### Comments
- `GET /posts/:id/comments` - Get comments for a post
- `POST /posts/:id/comments` - Add comment (Auth required)
- `PUT /comments/:id` - Update comment (Owner only)
- `DELETE /comments/:id` - Delete comment (Owner only)

### Users
- `GET /users/me` - Get current user profile
- `POST /users/me/avatar` - Upload profile picture

## 💡 Design Decisions & Assumptions

1.  **Monorepo Structure:** Chosen to keep the codebase unified and easy to manage for a single developer, allowing shared linting and easier full-stack execution.
2.  **JWT Authentication:** Used Stateless JWT for authentication to ensure scalability and ease of deployment across different domains (Client on Netlify, Server on Heroku).
3.  **Local Image Storage:** For simplicity in this task, images are uploaded to the local filesystem (`uploads/` directory) and served statically. In a production environment, this would be replaced with Cloudinary or AWS S3.
4.  **Markdown:** Chosen for post content to allow rich text formatting without the complexity of a heavy WYSIWYG editor.

