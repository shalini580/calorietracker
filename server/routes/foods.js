const express = require('express');
const router = express.Router();
const { pool } = require('../db');

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name, calories, created_at FROM foods ORDER BY id DESC LIMIT 100');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

router.post('/', async (req, res) => {
  const { name, calories } = req.body;
  if (!name || typeof calories !== 'number') {
    return res.status(400).json({ error: 'Invalid payload' });
  }

  try {
    const [result] = await pool.query('INSERT INTO foods (name, calories) VALUES (?, ?)', [name, calories]);
    const [rows] = await pool.query('SELECT id, name, calories, created_at FROM foods WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
