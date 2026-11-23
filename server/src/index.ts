import 'dotenv/config';
import { createApp } from './app';
import { initDb } from './db';

const PORT = process.env.PORT || 4000;

initDb();

const app = createApp();
app.listen(PORT, () => {
  console.log(`Campus Recycling API listening on http://localhost:${PORT}`);
});
