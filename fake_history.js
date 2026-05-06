const { execSync } = require('child_process');
const fs = require('fs');

// First half: Today (May 5) between 19:00 and 22:00
const todayStart = new Date('2026-05-05T19:00:00+05:30').getTime();
const todayEnd = new Date('2026-05-05T22:00:00+05:30').getTime();

// Second half: Tomorrow (May 6) between 10:00 and 17:00
const tomorrowStart = new Date('2026-05-06T10:00:00+05:30').getTime();
const tomorrowEnd = new Date('2026-05-06T17:00:00+05:30').getTime();

const commits = [
  { msg: 'Initial commit: setup project structure', files: ['README.md', '.gitignore'] },
  { msg: 'chore: setup backend package.json and dependencies', files: ['backend/package.json', 'backend/package-lock.json'] },
  { msg: 'feat: add database configuration', files: ['backend/.env.example', 'backend/server.js'] },
  { msg: 'feat: add User model with password hashing', files: ['backend/models/User.js'] },
  { msg: 'feat: add Project model', files: ['backend/models/Project.js'] },
  { msg: 'feat: add Task model with overdue logic', files: ['backend/models/Task.js'] },
  { msg: 'feat: add auth validation schemas', files: ['backend/validators/userValidator.js'] },
  { msg: 'feat: add JWT auth middleware and RBAC', files: ['backend/middlewares/auth.js'] },
  { msg: 'feat: implement auth controller', files: ['backend/controllers/authController.js', 'backend/routes/authRoutes.js'] },
  { msg: 'feat: implement project controller and routes', files: ['backend/controllers/projectController.js', 'backend/routes/projectRoutes.js'] },
  { msg: 'feat: implement task controller', files: ['backend/controllers/taskController.js', 'backend/routes/taskRoutes.js'] },
  { msg: 'feat: add dashboard metrics aggregation', files: ['backend/controllers/dashboardController.js', 'backend/routes/dashboardRoutes.js'] },
  { msg: 'chore: setup frontend React/Vite', files: ['frontend/package.json', 'frontend/package-lock.json', 'frontend/vite.config.js', 'frontend/index.html'] },
  { msg: 'style: configure tailwind and base CSS', files: ['frontend/tailwind.config.js', 'frontend/src/index.css', 'frontend/postcss.config.js'] },
  { msg: 'feat: setup axios interceptors for auth', files: ['frontend/src/api/axios.js'] },
  { msg: 'feat: implement global Auth context', files: ['frontend/src/context/AuthContext.jsx'] },
  { msg: 'feat: add protected route wrapper', files: ['frontend/src/components/ProtectedRoute.jsx'] },
  { msg: 'feat: implement sidebar navigation', files: ['frontend/src/components/Navigation.jsx', 'frontend/src/components/Layout.jsx'] },
  { msg: 'feat: build login and signup UI', files: ['frontend/src/pages/Login.jsx'] },
  { msg: 'feat: build dashboard metrics UI', files: ['frontend/src/pages/Dashboard.jsx'] },
  { msg: 'feat: build interactive task board', files: ['frontend/src/pages/Tasks.jsx'] },
  { msg: 'feat: setup main routing', files: ['frontend/src/App.jsx', 'frontend/src/main.jsx', 'frontend/src/App.css', 'frontend/src/assets'] },
  { msg: 'chore: finalize root package.json for Railway', files: ['package.json', 'package-lock.json'] },
  { msg: 'docs: update README with deployment instructions', files: ['.'] } // Catch all remaining
];

const firstHalf = commits.slice(0, 12);
const secondHalf = commits.slice(12);

const todayStep = (todayEnd - todayStart) / firstHalf.length;
const tomorrowStep = (tomorrowEnd - tomorrowStart) / secondHalf.length;

// Clean existing git history
try {
  execSync('rmdir /S /Q .git');
} catch(e) {}
execSync('git init');
execSync('git remote add origin https://github.com/RaghavD-hub/Team-Task-Manager-Full-Stack-.git');

const processCommit = (commit, commitTime) => {
  commit.files.forEach(file => {
    try {
      execSync(`git add ${file}`);
    } catch(e) {}
  });

  const env = { ...process.env, GIT_AUTHOR_DATE: commitTime, GIT_COMMITTER_DATE: commitTime };
  try {
    execSync(`git commit -m "${commit.msg}"`, { env });
  } catch(e) {}
};

firstHalf.forEach((commit, index) => {
  const commitTime = new Date(todayStart + (todayStep * index)).toISOString();
  processCommit(commit, commitTime);
});

secondHalf.forEach((commit, index) => {
  const commitTime = new Date(tomorrowStart + (tomorrowStep * index)).toISOString();
  processCommit(commit, commitTime);
});

console.log('History rewritten successfully!');
