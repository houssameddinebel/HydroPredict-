<?php
// POST { region_id, forecast: {...}, risk } → stores a forecast snapshot.
require_once __DIR__ . '/../config/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') jsonResponse(['ok' => true]);
if ($_SERVER['REQUEST_METHOD'] !== 'POST') jsonResponse(['ok' => false, 'error' => 'POST only'], 405);

$body = readJsonBody();
$regionId = trim((string)($body['region_id'] ?? ''));
$forecast = $body['forecast'] ?? [];
$risk = trim((string)($body['risk'] ?? 'normal'));
if (!in_array($risk, ['normal', 'moderate', 'high'], true)) $risk = 'normal';

if ($regionId === '') jsonResponse(['ok' => false, 'error' => 'region_id required'], 400);

try {
    $pdo = db();
    $syn = $forecast['synthesis'] ?? [];
    $stmt = $pdo->prepare(
        'INSERT INTO forecast_logs (region_id, forecast_date, tmax_avg, rain_total, et0_avg, risk, payload)
         VALUES (:r, CURDATE(), :t, :rain, :et0, :risk, :payload)'
    );
    $stmt->execute([
        ':r' => $regionId,
        ':t' => $syn['avgTemp'] ?? null,
        ':rain' => $syn['totalRain'] ?? null,
        ':et0' => $syn['avgET0'] ?? null,
        ':risk' => $risk,
        ':payload' => json_encode($forecast, JSON_UNESCAPED_UNICODE),
    ]);
    jsonResponse(['ok' => true, 'id' => (int)$pdo->lastInsertId()]);
} catch (Throwable $e) {
    jsonResponse(['ok' => false, 'error' => 'DB error: ' . $e->getMessage()], 500);
}
