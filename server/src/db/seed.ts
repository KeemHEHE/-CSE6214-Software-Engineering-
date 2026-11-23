// WBS 2.1a: database schema script (from ERD) and seed data.
// Run with `npm run seed` after the server has created the schema once.
import bcrypt from 'bcryptjs';
import { db, initDb } from './index';

async function seed() {
  initDb();

  const passwordHash = await bcrypt.hash('Password123!', 10);

  const insertUser = db.prepare(
    "INSERT INTO USER (name, email, password_hash, role, status) VALUES (?, ?, ?, ?, 'ACTIVE')"
  );
  const admin = insertUser.run('Admin', 'admin@mmu.edu.my', passwordHash, 'ADMIN');
  const officer = insertUser.run('Officer Siti', 'siti@mmu.edu.my', passwordHash, 'OFFICER');
  const worker = insertUser.run('Worker Ali', 'ali@mmu.edu.my', passwordHash, 'WORKER');
  const student = insertUser.run('Student Dev', 'dev@student.mmu.edu.my', passwordHash, 'STUDENT_STAFF');

  const insertPoint = db.prepare(
    'INSERT INTO RECYCLING_POINT (name, building, area_description, latitude, longitude) VALUES (?, ?, ?, ?, ?)'
  );
  const p1 = insertPoint.run('FCI Building Lobby', 'FCI', 'Ground floor lobby', 2.9279, 101.6412);
  const p2 = insertPoint.run('Library Level 1', 'Library', 'Near entrance', 2.9268, 101.6428);

  const insertBin = db.prepare(
    'INSERT INTO BIN (point_id, waste_type, capacity_litres, qr_code) VALUES (?, ?, ?, ?)'
  );
  insertBin.run(p1.lastInsertRowid, 'PLASTIC', 100, 'qr-fci-plastic-001');
  insertBin.run(p1.lastInsertRowid, 'PAPER', 100, 'qr-fci-paper-001');
  insertBin.run(p2.lastInsertRowid, 'PAPER', 120, 'qr-lib-paper-001');

  console.log('Seeded database with:');
  console.log(`  Admin:   admin@mmu.edu.my / Password123! (user_id ${admin.lastInsertRowid})`);
  console.log(`  Officer: siti@mmu.edu.my / Password123! (user_id ${officer.lastInsertRowid})`);
  console.log(`  Worker:  ali@mmu.edu.my / Password123! (user_id ${worker.lastInsertRowid})`);
  console.log(`  Student: dev@student.mmu.edu.my / Password123! (user_id ${student.lastInsertRowid})`);
  console.log(`  Recycling points: ${p1.lastInsertRowid}, ${p2.lastInsertRowid}`);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
