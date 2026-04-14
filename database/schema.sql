CREATE TABLE IF NOT EXISTS patients (
    patient_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age INTEGER NOT NULL CHECK (age >= 0 AND age <= 120),
    phone VARCHAR(15) UNIQUE NOT NULL,
    symptoms TEXT,
    priority_score DECIMAL(4,2) DEFAULT 1.0 CHECK (priority_score >= 0 AND priority_score <= 10),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS doctors (
    doctor_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    available_slots INTEGER DEFAULT 20 CHECK (available_slots >= 0),
    consultation_duration_mins INTEGER DEFAULT 15 CHECK (consultation_duration_mins > 0),
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS appointments (
    appointment_id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL REFERENCES patients(patient_id) ON DELETE CASCADE,
    doctor_id INTEGER NOT NULL REFERENCES doctors(doctor_id) ON DELETE RESTRICT,
    token_number INTEGER NOT NULL,
    predicted_wait_time DECIMAL(6,2),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','confirmed','in_progress','completed','cancelled')),
    appointment_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS queue_logs (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL REFERENCES patients(patient_id),
    doctor_id INTEGER REFERENCES doctors(doctor_id),
    arrival_time TIMESTAMPTZ DEFAULT NOW(),
    consultation_start TIMESTAMPTZ,
    consultation_end TIMESTAMPTZ,
    wait_time_actual DECIMAL(6,2)
);

CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL REFERENCES patients(patient_id),
    message TEXT NOT NULL,
    notification_type VARCHAR(20) DEFAULT 'sms' CHECK (notification_type IN ('sms','email','push')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','sent','failed')),
    sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO doctors (name, specialization, available_slots, consultation_duration_mins, is_available)
VALUES
('Dr. Priya Mehta', 'Cardiology', 10, 20, true),
('Dr. Arun Kumar', 'General Medicine', 12, 15, true),
('Dr. Sneha Pillai', 'Pediatrics', 8, 12, true),
('Dr. Rahul Nair', 'Orthopedics', 6, 25, true),
('Dr. Divya Krishnan', 'Neurology', 5, 30, true)
ON CONFLICT DO NOTHING;
