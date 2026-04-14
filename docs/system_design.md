# Smart Patient Queue & Appointment Predictor

## System Architecture

- Patient Mobile UI (React)
- Admin Dashboard (React)
- FastAPI Backend
- PostgreSQL Database
- Machine Learning Prediction Service
- Notification Service

## Run Order

1. Create PostgreSQL database: `smart_patient_queue`
2. Run `database/schema.sql`
3. Start backend: `uvicorn main:app --reload --port 8000`
4. Start frontend apps separately

## Swagger

- http://127.0.0.1:8000/docs

## Important Notes

- If doctors are not visible, check `/api/doctors/`
- If dashboard is empty, insert doctors and register at least one patient
- Use `/debug/db-check` to confirm table row counts
