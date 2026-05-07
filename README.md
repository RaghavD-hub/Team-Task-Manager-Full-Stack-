# TeamSync: Role-Based Task Management System

TeamSync is a production-grade MERN stack application designed for collaborative project management. It implements a strictly enforced Role-Based Access Control (RBAC) system to differentiate between **Admin** and **Member** workflows.

---

## 🏗️ Technical Architecture

The project follows a **Monorepo** structure, facilitating simultaneous development of the frontend and backend.

- **Frontend**: React.js with Vite, leveraging Tailwind CSS for a responsive, glassmorphic UI.
- **Backend**: Node.js/Express.js REST API with MongoDB/Mongoose.
- **Security**: Stateless JWT-based authentication with Bcrypt password hashing.
- **Validation**: Zod-powered schema validation on both server and client sides.

---

## 🔑 Core Features & Logic

### 1. Role-Based Access Control (RBAC)
- **Admins**: Full orchestration rights. Can create/delete projects, assign tasks to any member, and view cross-project metrics.
- **Members**: Execution rights. Can view projects they belong to, update task statuses assigned to them, and monitor their own performance.

### 2. Task Lifecycle
Tasks transition through three distinct states:
- `Todo`: Newly created or pending start.
- `In-Progress`: Actively being worked on by a member.
- `Done`: Completed task (excludes from overdue calculations).

### 3. Intelligent Analytics
The system calculates real-time metrics, including:
- **Project Completion %**: Ratio of 'Done' tasks to total tasks per project.
- **Overdue Logic**: A virtual field `isPastDue` identifies incomplete tasks where `targetDate` < `currentDate`.

---

## 📂 Data Model Definitions

### User Schema
| Field | Type | Description |
| :--- | :--- | :--- |
| `fullName` | String | User's display name |
| `emailAddress` | String | Unique identifier (normalized to lowercase) |
| `accessLevel` | Enum | `Admin` or `Member` |
| `secretHash` | String | Salted Bcrypt hash |

### Task Schema
| Field | Type | Description |
| :--- | :--- | :--- |
| `headline` | String | Short title of the task |
| `assignedTo` | ObjectId | Reference to a User model |
| `parentProject` | ObjectId | Reference to a Project model |
| `currentStatus` | Enum | `Todo`, `In-Progress`, `Done` |
| `targetDate` | Date | Final deadline for the task |

---

## 🚀 Installation & Local Development

### Prerequisites
- Node.js (v20 or higher)
- MongoDB instance (Local or Atlas)

### Setup Steps
1. **Clone & Install**:
   ```bash
   npm run postinstall  # Installs both root and sub-package dependencies
   ```

2. **Environment Configuration**:
   Create a `.env` file in the root with:
   ```env
   MONGO_URI=mongodb+srv://... (Your Connection String)
   JWT_SECRET=... (Any secure string)
   PORT=5000
   ```

3. **Running the Dev Environment**:
   ```bash
   npm run dev  # Starts Frontend (Vite) and Backend (Nodemon) concurrently
   ```

---

## 🌐 API Reference (REST Endpoints)

### Auth & User Management
- `POST /api/auth/signup`: Register new user (Default: Member).
- `POST /api/auth/login`: Returns JWT and user payload.
- `GET /api/users`: List all users (Admin only, for task assignment).

### Projects & Tasks
- `GET /api/projects`: List projects relevant to user role.
- `POST /api/projects`: Create new project (Admin only).
- `PATCH /api/tasks/:id/status`: Update task state (Restricted to assignee or Admin).
- `GET /api/dashboard/metrics`: Comprehensive stats for the dashboard.

---

## 🛠️ Deployment Strategy

The application is configured for deployment on platforms like **Railway** or **Heroku**:
- **Build Step**: `npm run build` in the frontend directory.
- **Production Entry**: The backend `server.js` is configured to serve the `frontend/dist` directory when `NODE_ENV=production`.

---

<p align="center">
  <b>Developed for Modern Agile Teams.</b>
</p>
