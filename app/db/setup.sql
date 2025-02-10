-- This file contains the SQL schema, it drops all tables and recreates them

DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS timesheets;
DROP TABLE IF EXISTS documents;

-- Create employees table with all required and bonus fields
CREATE TABLE employees
(
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name     TEXT           NOT NULL,
    email         TEXT           NOT NULL UNIQUE,
    phone_number  TEXT,
    date_of_birth DATE           NOT NULL,

    job_title     TEXT           NOT NULL,
    department    TEXT           NOT NULL,
    salary        DECIMAL(10, 2) NOT NULL,
    start_date    DATE           NOT NULL,
    end_date      DATE,

    photo_path    TEXT,
    is_active     BOOLEAN  DEFAULT true,
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    CHECK (salary >= 15000),
    CHECK (start_date <= COALESCE(end_date, start_date)),
    CHECK (email LIKE '%_@__%.__%')
);

-- Create documents table for storing employee documents (Bonus feature)
CREATE TABLE documents
(
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id   INTEGER NOT NULL,
    document_type TEXT    NOT NULL, -- e.g., 'CV', 'ID', 'CONTRACT'
    file_path     TEXT    NOT NULL,
    upload_date   DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees (id) ON DELETE CASCADE,
    CHECK (document_type IN ('CV', 'ID', 'CONTRACT', 'OTHER'))
);

-- Create timesheets table with all required and bonus fields
CREATE TABLE timesheets
(
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER  NOT NULL,
    start_time  DATETIME NOT NULL,
    end_time    DATETIME NOT NULL,
    summary     TEXT,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (employee_id) REFERENCES employees (id) ON DELETE CASCADE,
    CHECK (end_time > start_time),
    CHECK (strftime('%s', end_time) - strftime('%s', start_time) <= 86400)
);

CREATE INDEX idx_employees_email ON employees (email);
CREATE INDEX idx_timesheets_employee_id ON timesheets (employee_id);
CREATE INDEX idx_timesheets_dates ON timesheets (start_time, end_time);
CREATE INDEX idx_documents_employee_id ON documents (employee_id);