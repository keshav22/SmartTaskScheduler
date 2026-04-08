# SmartTaskScheduler 🚀

Welcome to **SmartTaskScheduler**, the intelligent tool designed to turn your "to-do dump" into an actionable, focused plan.

## 🌟 Introduction

SmartTaskScheduler is a productivity tool where you can dump all your todos and actually get them done.

- **Focus Mode:** Features a "Start" button with configurable timers for each task, allowing you to engage in deep work without distractions.
- **Intelligent Rescheduling:** If you don't complete a task, you don't need to manually move it. Our tool automatically reschedules pending items based on **priority**, **deadlines**, and your **available time slots**.

---

## 🛠️ Setup & Installation

To run this application, you need to start the frontend and backend services separately.

### 🐍 Backend (FastAPI)

The backend is managed using **uv** for fast, reliable dependency management.

1.  **Navigate to the backend directory:**

    ```bash
    cd backend
    ```

2.  **Install dependencies:**
    This command will create a virtual environment and install all required packages from your `pyproject.toml`:

    ```bash
    uv sync
    ```

3.  **Run the below command and copy the template `.env.example` to `.env.development`**

    ```bash
    # Linux / macOS (bash/zsh)
    export APP_ENV=development

    # Windows CMD
    set APP_ENV=development

    # Windows PowerShell
    $env:APP_ENV="development"
    ```

4.  **Start the FastAPI server: the below command with \***localhost**\* is important for login to function correctly**
    ```bash
    uv run uvicorn main:app --reload --host localhost
    ```
    _The API will be live at `http://localhost:8000`_

---

### ⚛️ Frontend (Next.js)

The frontend is a Next.js application managed by **pnpm**.

1.  **Navigate to the frontend directory:**

    ```bash
    cd frontend
    ```

2.  **Install packages:**

    ```bash
    pnpm install
    ```

3.  **Copy the template `.env.example` to `.env.local or .env`**
4.  **Start the development server:**
    ```bash
    pnpm dev
    ```
    _the app will be live at `http://localhost:3000`_

---

## 🧪 Development Commands

| Task          | Backend (uv)           | Frontend (pnpm)             |
| :------------ | :--------------------- | :-------------------------- |
| **Run Tests** | `uv run pytest`        | `pnpm test`                 |
| **Linting**   | `uv run ruff check .`  | `pnpm lint`                 |
| **Format**    | `uv run ruff format .` | `pnpm build` (checks types) |

---

## 🛰️ CI/CD

This project uses **GitHub Actions**. Any push to the `main` branch or a Pull Request will trigger:

- Frontend linting and testing via `pnpm`.
- Backend linting (Ruff) and testing (Pytest) via `uv`.
