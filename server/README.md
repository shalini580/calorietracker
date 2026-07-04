## Server setup

1. Install dependencies

```bash
cd server
npm install
```

2. Create `.env` from `.env.example` and fill database credentials.

3. Create MySQL database and table (example SQL):

```sql
CREATE DATABASE IF NOT EXISTS calorie_tracker;
USE calorie_tracker;

CREATE TABLE IF NOT EXISTS foods (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  calories INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

4. Run server

```bash
npm run dev
```

API

- `GET /api/ping` — health check
- `GET /api/foods` — list recent foods
- `POST /api/foods` — add a food { name: string, calories: number }
