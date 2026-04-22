# LocalLink - Frontend & Backend Start Guide

Ky dokument tregon si me i startu serverat lokal per frontend dhe backend.

## Prerequisites

- Node.js (per frontend)
- Python 3.x (per backend)
- `pip` (per Python dependencies)

## 1) Frontend Setup (React + Vite)

Nga root i projektit (`/LocalLink`):

1. Instalo dependencies:
   ```bash
   npm install
   ```
2. Krijo/ploteso `.env.local`:
   ```env
   GEMINI_API_KEY=your_key_here
   # optional
   VITE_API_URL=http://localhost:8000
   ```
3. Nise frontend:
   ```bash
   npm run dev
   ```

Frontend hapet zakonisht ne:
- `http://localhost:3000`
- nese 3000 eshte i zene, Vite kalon automatikisht ne port tjeter (p.sh. `3001`)

## 2) Backend Setup (FastAPI)

Nga folderi `backend`:

1. Hy ne backend:
   ```bash
   cd backend
   ```
2. Aktivizo virtual environment:
   ```bash
   source venv/bin/activate
   ```
3. Instalo dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Nise backend:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

Backend endpoint-et kryesore:
- API root: `http://localhost:8000/`
- Health check: `http://localhost:8000/health`
- Swagger docs: `http://localhost:8000/docs`

## 3) Run Both Together

Per me punu app normalisht:
- mbaje backend ndezur ne `8000`
- mbaje frontend ndezur ne `3000/3001`

Frontend thirr backend-in ne `http://localhost:8000` (ose sipas `VITE_API_URL`).

## Troubleshooting

- **White screen ne frontend**
  - kontrollo terminalin e frontend-it per compile/runtime errors
  - bej hard refresh ne browser (`Cmd + Shift + R`)

- **Port already in use**
  - ndrro portin ose mbyll procesin qe po e perdor portin
  - frontend kalon vet automatikisht ne port tjeter

- **Backend nuk starton**
  - sigurohu qe je ne `backend/`
  - aktivizo `venv`
  - ekzekuto perseri:
    ```bash
    pip install -r requirements.txt
    ```
