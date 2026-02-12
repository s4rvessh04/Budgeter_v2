# Budgeter

A full-stack web app focused on helping users handle personal expenses 💰
![Landing-page](https://github.com/s4rvessh04/Budgeter_v2/assets/68328137/e207b8ff-3389-4e94-b105-1238a40a687d)

## Getting Started 🚀

### Prerequisites

- Python 3.10+
- Node.js 18+
- pnpm (or npm)

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate    # Linux/Mac
# venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your settings (SECRET_KEY, DEBUG, etc.)

# Run migrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Start dev server
python manage.py runserver
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
pnpm install

# Start dev server
pnpm dev
```

The frontend runs at `http://localhost:5173` and the backend at `http://localhost:8000`.

### Docker (Alternative)

```bash
# From project root
docker compose up
```

This starts both backend and frontend with hot-reload.

### Running Tests

```bash
cd backend
source venv/bin/activate
python manage.py test
```

## Built with ⚒️

- Django
- Django Rest Framework
- Django cors headers
- React w/ vite
- React Query
- Axios
- Chakra UI

## Features ✨
Has a lot of important features like:

### Signup and Login 🔐

https://github.com/s4rvessh04/Budgeter_v2/assets/68328137/cef67035-f99a-44b8-9f42-c9ed3e2439ee

### Add your expenses ➕

https://github.com/s4rvessh04/Budgeter_v2/assets/68328137/ab491e7e-dae0-4d99-bcbe-8d78ef52dc84

### Add Friends to share expenses 👥

https://github.com/s4rvessh04/Budgeter_v2/assets/68328137/34fb3078-d680-4553-a9dd-8b98128642a8

### Shared Expenses 🍻

https://github.com/s4rvessh04/Budgeter_v2/assets/68328137/478bf75c-1426-4f84-beed-0ac6e939569a

### Account info update ✍️

https://github.com/s4rvessh04/Budgeter_v2/assets/68328137/46fbd114-e06f-44f8-bd41-4276ad127ad1

### Dark Mode 🖤

https://github.com/s4rvessh04/Budgeter_v2/assets/68328137/8eb8ec3b-b685-4b20-bcea-8b953de4be8d
