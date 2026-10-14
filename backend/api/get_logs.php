<?php
// GET ?limit=20&region_id=agadir → recent forecast + selection logs.
require_once __DIR__ . '/../config/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') jsonResponse(['ok' => true]);

$limit = max(1, min(100, (int)($_GET['limit'] ?? 20)));
$regionId = trim((string)($_GET['region_id'] ?? ''));

try {
    $pdo = db();

    if ($regionId !== '') {
        $stmt = $pdo->prepare('SELECT * FROM forecast_logs WHERE region_id = :r ORDER BY created_at DESC LIMIT ' . (int)$limit);
        $stmt->execute([':r' => $regionId]);
    } else {
        $stmt = $pdo->query('SELECT * FROM forecast_logs ORDER BY created_at DESC LIMIT ' . (int)$limit);
    }
    $forecasts = $stmt->fetchAll();

    $stmt = $pdo->query(
        'SELECT l.*, r.name_fr, u.name AS user_name FROM user_logs l
         LEFT JOIN regions r ON r.id = l.region_id
         LEFT JOIN users u ON u.id = l.user_id
         ORDER BY l.created_at DESC LIMIT ' . (int)$limit
    );
    jsonResponse(['ok' => true, 'forecasts' => $forecasts, 'selections' => $stmt->fetchAll()]);
} catch (Throwable $e) {
    jsonResponse(['ok' => false, 'error' => 'DB error: ' . $e->getMessage()], 500);
}
