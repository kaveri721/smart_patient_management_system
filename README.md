# Smart Patient Queue & Appointment Predictor

## Folder Structure

- backend/
- frontend/admin_dashboard/
- frontend/patient_mobile_ui/
- database/
- ml/
- docs/

## Backend Setup

```bash
pip install fastapi uvicorn sqlalchemy psycopg2-binary scikit-learn joblib numpy pandas pydantic
cd backend
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

## Database Setup

Create DB:

```sql
CREATE DATABASE smart_patient_queue;
```

Run schema:

```bash
psql -U postgres -d smart_patient_queue -f database/schema.sql
```

## ML Training

```bash
python ml/training_script.py
```

## Frontend

Create React/Vite apps and replace `src/App.jsx` with provided files.

## Debug

- API docs: `http://127.0.0.1:8000/docs`
- DB check: `http://127.0.0.1:8000/debug/db-check`
- Doctors API: `http://127.0.0.1:8000/api/doctors/`
