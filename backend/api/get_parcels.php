<?php
// GET → list parcels (+ optional ?user_id=1). POST {user_id,name,region_id,crop,soil,area_ha} → create.
require_once __DIR__ . '/../config/db.php';
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') jsonResponse(['ok' => true]);
try {
  $pdo = db();
  if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $b = readJsonBody();
    $stmt = $pdo->prepare("INSERT INTO parcels (user_id, name, region_id, crop, soil, area_ha) VALUES (:u, :n, :r, :c, :s, :a)");
    $stmt->execute([
      ':u' => (int)($b['user_id'] ?? 1),
      ':n' => substr(trim((string)($b['name'] ?? 'Parcelle')), 0, 100),
      ':r' => substr(trim((string)($b['region_id'] ?? 'agadir')), 0, 50),
      ':c' => substr(trim((string)($b['crop'] ?? 'tomato')), 0, 50),
      ':s' => substr(trim((string)($b['soil'] ?? 'loam')), 0, 50),
      ':a' => max(0.1, min(5000, (float)($b['area_ha'] ?? 1)))
    ]);
    jsonResponse(['ok' => true, 'id' => (int)$pdo->lastInsertId()]);
  }
  $uid = (int)($_GET['user_id'] ?? 1);
  $stmt = $pdo->prepare('SELECT * FROM parcels WHERE user_id = :u ORDER BY id DESC');
  $stmt->execute([':u' => $uid]);
  jsonResponse(['ok' => true, 'data' => $stmt->fetchAll()]);
} catch (Throwable $e) {
  jsonResponse(['ok' => false, 'error' => 'DB error: ' . $e->getMessage()], 500);
}
