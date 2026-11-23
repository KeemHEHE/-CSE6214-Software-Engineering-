-- EcoBin MMU: Campus Recycling and Waste Collection Management System
-- Mirrors the ERD in docs/PART_I_REPORT.md (Section 4).

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS USER (
  user_id           INTEGER PRIMARY KEY AUTOINCREMENT,
  name              TEXT NOT NULL,
  email             TEXT NOT NULL UNIQUE,
  password_hash     TEXT NOT NULL,
  phone             TEXT,
  role              TEXT NOT NULL CHECK (role IN ('STUDENT_STAFF', 'WORKER', 'OFFICER', 'ADMIN')),
  status            TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('PENDING', 'ACTIVE', 'LOCKED', 'INACTIVE')),
  failed_logins     INTEGER NOT NULL DEFAULT 0,
  locked_until      TEXT,
  verify_token_hash TEXT,
  reset_token_hash  TEXT,
  reset_expires_at  TEXT,
  email_notify      INTEGER NOT NULL DEFAULT 1,
  created_at        TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS RECYCLING_POINT (
  point_id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name             TEXT NOT NULL,
  building         TEXT NOT NULL,
  area_description TEXT,
  latitude         REAL,
  longitude        REAL,
  is_active        INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS BIN (
  bin_id          INTEGER PRIMARY KEY AUTOINCREMENT,
  point_id        INTEGER NOT NULL REFERENCES RECYCLING_POINT(point_id) ON DELETE RESTRICT,
  waste_type      TEXT NOT NULL CHECK (waste_type IN ('PAPER', 'PLASTIC', 'METAL', 'GLASS', 'EWASTE', 'GENERAL')),
  capacity_litres INTEGER NOT NULL DEFAULT 100,
  fill_status     TEXT NOT NULL DEFAULT 'EMPTY' CHECK (fill_status IN ('EMPTY', 'HALF', 'FULL', 'OVERFLOWING', 'DAMAGED')),
  qr_code         TEXT UNIQUE,
  last_emptied_at TEXT,
  is_active       INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS WASTE_REPORT (
  report_id       INTEGER PRIMARY KEY AUTOINCREMENT,
  reporter_id     INTEGER NOT NULL REFERENCES USER(user_id) ON DELETE RESTRICT,
  point_id        INTEGER NOT NULL REFERENCES RECYCLING_POINT(point_id) ON DELETE RESTRICT,
  bin_id          INTEGER REFERENCES BIN(bin_id) ON DELETE RESTRICT,
  duplicate_of_id INTEGER REFERENCES WASTE_REPORT(report_id) ON DELETE RESTRICT,
  category        TEXT NOT NULL CHECK (category IN ('FULL_BIN', 'OVERFLOW', 'DAMAGED_BIN', 'CONTAMINATION', 'ILLEGAL_DUMPING', 'OTHER')),
  description     TEXT NOT NULL,
  photo_path      TEXT,
  priority        TEXT NOT NULL DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH')),
  status          TEXT NOT NULL DEFAULT 'SUBMITTED' CHECK (status IN ('SUBMITTED', 'UNDER_REVIEW', 'ASSIGNED', 'RESOLVED', 'REJECTED', 'DUPLICATE')),
  created_at      TEXT NOT NULL DEFAULT (datetime('now')),
  resolved_at     TEXT
);

CREATE TABLE IF NOT EXISTS COLLECTION_SCHEDULE (
  schedule_id INTEGER PRIMARY KEY AUTOINCREMENT,
  point_id    INTEGER NOT NULL REFERENCES RECYCLING_POINT(point_id) ON DELETE RESTRICT,
  created_by  INTEGER NOT NULL REFERENCES USER(user_id) ON DELETE RESTRICT,
  waste_type  TEXT CHECK (waste_type IN ('PAPER', 'PLASTIC', 'METAL', 'GLASS', 'EWASTE', 'GENERAL')),
  time_slot   TEXT NOT NULL,
  is_active   INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS SCHEDULE_DAY (
  schedule_id INTEGER NOT NULL REFERENCES COLLECTION_SCHEDULE(schedule_id) ON DELETE RESTRICT,
  day_of_week TEXT NOT NULL CHECK (day_of_week IN ('MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT')),
  PRIMARY KEY (schedule_id, day_of_week)
);

CREATE TABLE IF NOT EXISTS COLLECTION_TASK (
  task_id        INTEGER PRIMARY KEY AUTOINCREMENT,
  point_id       INTEGER NOT NULL REFERENCES RECYCLING_POINT(point_id) ON DELETE RESTRICT,
  schedule_id    INTEGER REFERENCES COLLECTION_SCHEDULE(schedule_id) ON DELETE RESTRICT,
  report_id      INTEGER UNIQUE REFERENCES WASTE_REPORT(report_id) ON DELETE RESTRICT,
  worker_id      INTEGER REFERENCES USER(user_id) ON DELETE RESTRICT,
  waste_type     TEXT CHECK (waste_type IN ('PAPER', 'PLASTIC', 'METAL', 'GLASS', 'EWASTE', 'GENERAL')),
  scheduled_date TEXT NOT NULL,
  priority       TEXT NOT NULL DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH')),
  status         TEXT NOT NULL DEFAULT 'UNASSIGNED' CHECK (status IN ('UNASSIGNED', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'MISSED')),
  started_at     TEXT,
  completed_at   TEXT,
  remarks        TEXT,
  CHECK (schedule_id IS NOT NULL OR report_id IS NOT NULL)
);

CREATE TABLE IF NOT EXISTS COLLECTION_RECORD (
  record_id        INTEGER PRIMARY KEY AUTOINCREMENT,
  task_id          INTEGER NOT NULL REFERENCES COLLECTION_TASK(task_id) ON DELETE RESTRICT,
  bin_id           INTEGER NOT NULL REFERENCES BIN(bin_id) ON DELETE RESTRICT,
  weight_kg        REAL NOT NULL CHECK (weight_kg >= 0 AND weight_kg <= 500),
  fill_status_after TEXT NOT NULL CHECK (fill_status_after IN ('EMPTY', 'HALF', 'FULL', 'OVERFLOWING', 'DAMAGED')),
  recorded_at      TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (task_id, bin_id)
);

CREATE TABLE IF NOT EXISTS NOTIFICATION (
  notification_id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id         INTEGER NOT NULL REFERENCES USER(user_id) ON DELETE RESTRICT,
  type            TEXT NOT NULL,
  message         TEXT NOT NULL,
  link            TEXT,
  is_read         INTEGER NOT NULL DEFAULT 0,
  created_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS REWARD_TRANSACTION (
  txn_id     INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id    INTEGER NOT NULL REFERENCES USER(user_id) ON DELETE RESTRICT,
  report_id  INTEGER UNIQUE REFERENCES WASTE_REPORT(report_id) ON DELETE RESTRICT,
  points     INTEGER NOT NULL,
  reason     TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS STATUS_LOG (
  log_id     INTEGER PRIMARY KEY AUTOINCREMENT,
  report_id  INTEGER REFERENCES WASTE_REPORT(report_id) ON DELETE RESTRICT,
  task_id    INTEGER REFERENCES COLLECTION_TASK(task_id) ON DELETE RESTRICT,
  old_status TEXT,
  new_status TEXT NOT NULL,
  changed_by INTEGER NOT NULL REFERENCES USER(user_id) ON DELETE RESTRICT,
  changed_at TEXT NOT NULL DEFAULT (datetime('now')),
  CHECK ((report_id IS NULL) <> (task_id IS NULL))
);
