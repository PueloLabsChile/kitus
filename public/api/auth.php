<?php
declare(strict_types=1);
session_name('kitus_editor');
session_set_cookie_params(['httponly' => true, 'secure' => true, 'samesite' => 'Strict', 'path' => '/']);
session_start();
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
$config = '/home/geogescl/.kitus-editor-users.php';
if (!is_file($config)) { http_response_code(503); echo json_encode(['ok' => false, 'error' => 'La sala editorial aún no está configurada.']); exit; }
$users = require $config;
$input = json_decode(file_get_contents('php://input'), true) ?: [];
$action = $input['action'] ?? $_GET['action'] ?? 'me';
function current_user(): ?array { return $_SESSION['kitus_editor'] ?? null; }
if ($action === 'me') { echo json_encode(['ok' => true, 'user' => current_user()]); exit; }
if ($action === 'logout') { $_SESSION = []; session_destroy(); echo json_encode(['ok' => true]); exit; }
if ($action === 'login') {
  $email = strtolower(trim((string)($input['email'] ?? '')));
  $password = (string)($input['password'] ?? '');
  $user = $users[$email] ?? null;
  $hash = $user ? hash_pbkdf2('sha256', $password, $user['salt'], 210000, 64) : '';
  if (!$user || !hash_equals($user['hash'], $hash)) { http_response_code(401); echo json_encode(['ok' => false, 'error' => 'Correo o contraseña incorrectos.']); exit; }
  session_regenerate_id(true);
  $_SESSION['kitus_editor'] = ['email' => $email, 'name' => $user['name'], 'role' => $user['role']];
  echo json_encode(['ok' => true, 'user' => $_SESSION['kitus_editor']]); exit;
}
http_response_code(400); echo json_encode(['ok' => false, 'error' => 'Acción no válida.']);