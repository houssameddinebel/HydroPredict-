<?php
// GET ?user_id=1 → tasks. POST {user_id,title,parcel_id,done} → create/update. DELETE ?id= → delete via POST {delete_id}.
require_once __DIR__ . '/../config/db.php';
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') jsonResponse(['ok' => true]);
try {
  $pdo = db();
  if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $b = readJsonBody();
    if (!empty($b['delete_id'])) {
      $stmt = $pdo->prepare('DELETE FROM tasks WHERE id = :i');
      $stmt->execute([':i' => (int)$b['delete_id']]);
      jsonResponse(['ok' => true, 'deleted' => (int)$b['delete_id']]);
    }
    if (!empty($b['toggle_id'])) {
      $stmt = $pdo->prepare('UPDATE tasks SET done = 1 - done WHERE id = :i');
      $stmt->execute([':i' => (int)$b['toggle_id']]);
      jsonResponse(['ok' => true, 'toggled' => (int)$b['toggle_id']]);
    }
    $stmt = $pdo->prepare('INSERT INTO tasks (user_id, parcel_id, title) VALUES (:u, :p, :t)');
    $stmt->execute([
      ':u' => (int)($b['user_id'] ?? 1),
      ':p' => !empty($b['parcel_id']) ? (int)$b['parcel_id'] : null,
      ':t' => substr(trim((string)($b['title'] ?? '')), 0, 255)
    ]);
    jsonResponse(['ok' => true, 'id' => (int)$pdo->lastInsertId()]);
  }
  $uid = (int)($_GET['user_id'] ?? 1);
  $stmt = $pdo->prepare('SELECT * FROM tasks WHERE user_id = :u ORDER BY done ASC, id DESC LIMIT 100');
  $stmt->execute([':u' => $uid]);
  jsonResponse(['ok' => true, 'data' => $stmt->fetchAll()]);
} catch (Throwable $e) {
  jsonResponse(['ok' => false, 'error' => 'DB error: ' . $e->getMessage()], 500);
}
