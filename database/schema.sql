CREATE TABLE users(
id SERIAL PRIMARY KEY,
name VARCHAR(100),
email VARCHAR(120) UNIQUE,
password_hash TEXT,
role VARCHAR(20),
phone VARCHAR(15),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE patients(
id SERIAL PRIMARY KEY,
user_id INT REFERENCES users(id),
age INT,
gender VARCHAR(10),
medical_history TEXT
);

CREATE TABLE doctors(
id SERIAL PRIMARY KEY,
user_id INT REFERENCES users(id),
specialization VARCHAR(100)
);

CREATE TABLE symptoms_priority(
id SERIAL PRIMARY KEY,
symptom_name VARCHAR(100),
severity_score INT
);

CREATE TABLE appointments(
id SERIAL PRIMARY KEY,
patient_id INT REFERENCES patients(id),
doctor_id INT REFERENCES doctors(id),
booking_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
token_number INT,
predicted_wait_time INT,
priority_score FLOAT,
status VARCHAR(20)
);

CREATE TABLE queue_logs(
id SERIAL PRIMARY KEY,
appointment_id INT REFERENCES appointments(id),
arrival_time TIMESTAMP,
consultation_start_time TIMESTAMP,
consultation_end_time TIMESTAMP
);

CREATE TABLE notifications(
id SERIAL PRIMARY KEY,
user_id INT REFERENCES users(id),
message TEXT,
status VARCHAR(20),
timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);