psql -U postgres -c "CREATE DATABASE patient_queue_db;"
psql -U postgres -d patient_queue_db -f database/schema.sql