<?php
// POST { user_id, region_id } → saves preferred zone + logs the selection.
require_once __DIR__ . '/../config/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') jsonResponse(['ok' => true]);
if ($_SERVER['REQUEST_METHOD'] !== 'POST') jsonResponse(['ok' => false, 'error' => 'POST only'], 405);

$body = readJsonBody();
$userId = (int)($body['user_id'] ?? 1);
$regionId = trim((string)($body['region_id'] ?? ''));

if ($regionId === '') {
    jsonResponse(['ok' => false, 'error' => 'region_id required'], 400);
}

try {
    $pdo = db();

    // Validate against the regions table so new cities work without code changes.
    $stmt = $pdo->prepare('SELECT id FROM regions WHERE id = :r');
    $stmt->execute([':r' => $regionId]);
    if (!$stmt->fetch()) {
        jsonResponse(['ok' => false, 'error' => 'Unknown region_id: ' . $regionId], 400);
    }

    $pdo->beginTransaction();

    // Optional farm profile (crop + field area), persisted on the user row.
    $crop = substr(trim((string)($body['crop'] ?? '')), 0, 50);
    $areaHa = (float)($body['area_ha'] ?? 0);
    $extra = '';
    $params = [':r' => $regionId, ':u' => $userId];
    if ($crop !== '') { $extra .= ', preferred_crop = :c'; $params[':c'] = $crop; }
    if ($areaHa > 0 && $areaHa <= 5000) { $extra .= ', field_area_ha = :a'; $params[':a'] = $areaHa; }

    $stmt = $pdo->prepare('UPDATE users SET preferred_region = :r' . $extra . ' WHERE id = :u');
    $stmt->execute($params);
    if ($stmt->rowCount() === 0) {
        // Ensure the row exists (column defaults apply), then re-apply.
        $stmt = $pdo->prepare('INSERT IGNORE INTO users (id) VALUES (:u)');
        $stmt->execute([':u' => $userId]);
        $stmt = $pdo->prepare('UPDATE users SET preferred_region = :r' . $extra . ' WHERE id = :u');
        $stmt->execute($params);
    }

    $stmt = $pdo->prepare("INSERT INTO user_logs (user_id, region_id, action) VALUES (:u, :r, 'select_zone')");
    $stmt->execute([':u' => $userId, ':r' => $regionId]);

    $pdo->commit();
    jsonResponse(['ok' => true, 'user_id' => $userId, 'region_id' => $regionId]);
} catch (Throwable $e) {
    if (isset($pdo) && $pdo->inTransaction()) $pdo->rollBack();
    jsonResponse(['ok' => false, 'error' => 'DB error: ' . $e->getMessage()], 500);
}
