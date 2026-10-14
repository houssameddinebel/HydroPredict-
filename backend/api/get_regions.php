<?php
// GET → list agricultural regions (mirrors src/data/regions.js).
require_once __DIR__ . '/../config/db.php';
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') jsonResponse(['ok' => true]);

try {
    $pdo = db();
    $rows = $pdo->query('SELECT * FROM regions ORDER BY name_fr')->fetchAll();
    jsonResponse(['ok' => true, 'data' => $rows]);
} catch (Throwable $e) {
    jsonResponse(['ok' => false, 'error' => 'DB error: ' . $e->getMessage()], 500);
}
