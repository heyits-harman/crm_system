# CRM Lead Management System

A full-stack CRM (Customer Relationship Management) application built as part of a software engineering assessment. The application enables organizations to manage customer leads through a secure dashboard with role-based access control, notes, activity tracking, and analytics.

---

## 🚀 Live Demo

**Frontend:** https://your-frontend-url.vercel.app

**Backend API:** https://your-backend-url.onrender.com

---

## ✨ Features

### Authentication
- JWT Authentication
- Role-Based Access Control (Admin & Member)
- Protected Routes
- Secure Password Hashing

### Lead Management
- Create Lead
- View Leads
- Update Lead Information
- Delete Lead
- Search Leads
- Filter by Status
- Pagination

### Notes
- Add Notes to Leads
- View Lead Notes

### Activity Timeline
- Automatically tracks lead activities
- Displays chronological history of actions

### Dashboard
- Total Leads
- Status-wise Statistics
- CRM Overview

### Public Lead Submission
- Public contact form
- Automatically creates new leads
- No authentication required

---

## 🛠️ Tech Stack

### Frontend

- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios
- React Hook Form
- React Hot Toast

### Backend

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication
- bcrypt
- Zod Validation

### Database

- PostgreSQL (Neon)

### Deployment

- Frontend → Vercel
- Backend → Render
- Database → Neon

### Testing

- Vitest
- Supertest

---

## 📁 Project Structure

```
project-root
│
├── backend
│   ├── prisma
│   ├── src
│   │   ├── controllers
│   │   ├── middleware
│   │   ├── routes
│   │   ├── services
│   │   └── utils
│   └── tests
│
└── frontend
    ├── src
    │   ├── components
    │   ├── pages
    │   ├── hooks
    │   ├── context
    │   ├── api
    │   └── utils
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git

cd YOUR_REPO
```

---

### Backend

```bash
cd backend

npm install
```

Create a `.env` file

```env
DATABASE_URL=your_database_url

JWT_SECRET=your_secret_key

PORT=3000
```

Run migrations

```bash
npx prisma migrate deploy

npx prisma generate
```

Start backend

```bash
npm start
```

---

### Frontend

```bash
cd frontend

npm install
```

Create `.env`

```env
VITE_API_URL=http://localhost:3000
```

Run

```bash
npm run dev
```

---

## 🔐 Authentication

Every protected endpoint requires

```
Authorization: Bearer <JWT Token>
```

---

## 👥 Demo Credentials

### Admin

```
Email:
admin@example.com

Password:
admin123
```

### Member

```
Email:
member1@example.com

Password:
member123
```

---

## 🧪 Running Tests

```bash
npm test
```

---

## 📌 API Endpoints

### Authentication

| Method | Endpoint |
|----------|----------------|
| POST | /users/login |

---

### Dashboard

| Method | Endpoint |
|----------|----------------|
| GET | /dashboard/stats |

---

### Leads

| Method | Endpoint |
|----------|----------------|
| POST | /leads/create |
| GET | /leads/get |
| PATCH | /leads/update/:id |
| DELETE | /leads/delete/:id |

---

### Notes

| Method | Endpoint |
|----------|----------------|
| POST | /leads/:id/notes |
| GET | /leads/:id/notes |
| DELETE | /leads/:id/notes |

---

### Activity

| Method | Endpoint |
|----------|----------------|
| GET | /leads/:id/activity |

---

## 📸 Screenshots

Add screenshots here if available.

- Login Page
- Dashboard
- Lead Table
- Lead Details
- Public Lead Form

---

## 📈 Future Improvements

- Email Notifications
- File Attachments
- Kanban Board
- Advanced Reporting
- WebSocket Notifications
- Audit Logs

---

## 👨‍💻 Author

**Harman Singh Gill**
