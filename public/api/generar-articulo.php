<?php
ini_set('display_errors', '1'); error_reporting(E_ALL);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
if (!isset($_SERVER['REQUEST_METHOD']) || $_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo json_encode(array('error' => 'Metodo no permitido.')); exit; }
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
$originHost = parse_url($origin, PHP_URL_HOST);
if ($originHost !== 'kitus.cl' && $originHost !== 'www.kitus.cl') { http_response_code(403); echo json_encode(array('error' => 'Origen no autorizado.')); exit; }
$data = $_POST;
if (!$data) { $raw = file_get_contents('php://input'); $data = json_decode($raw ? $raw : '', true); }
$prompt = trim(isset($data['prompt']) ? $data['prompt'] : '');
if ($prompt === '' || strlen($prompt) > 5000) { http_response_code(422); echo json_encode(array('error' => 'El encargo debe tener entre 1 y 5.000 caracteres.')); exit; }
$ip = isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : 'unknown';
$rateFile = sys_get_temp_dir() . '/kitus-ai-' . hash('sha256', $ip);
$requests = is_file($rateFile) ? json_decode(file_get_contents($rateFile), true) : array();
if (!is_array($requests)) { $requests = array(); }
$now = time(); $valid = array(); foreach ($requests as $requestTime) { if ($requestTime > $now - 3600) { $valid[] = $requestTime; } }
if (count($valid) >= 12) { http_response_code(429); echo json_encode(array('error' => 'Limite de generacion alcanzado. Intenta nuevamente en una hora.')); exit; }
$valid[] = $now; file_put_contents($rateFile, json_encode($valid), LOCK_EX);
$configPath = dirname(dirname(dirname(__DIR__))) . '/.kitus-openai.php';
if (!is_file($configPath)) { http_response_code(503); echo json_encode(array('error' => 'La IA aun no esta configurada.')); exit; }
$config = require $configPath; $key = isset($config['openai_api_key']) ? $config['openai_api_key'] : '';
if (!$key) { http_response_code(503); echo json_encode(array('error' => 'La IA aun no esta configurada.')); exit; }
$seccion = trim(isset($data['seccion']) ? $data['seccion'] : ''); $titulo = trim(isset($data['titulo']) ? $data['titulo'] : ''); $bajada = trim(isset($data['bajada']) ? $data['bajada'] : ''); $fuentes = trim(isset($data['fuentes']) ? $data['fuentes'] : '');
$instrucciones = "Eres asistente de una redaccion periodistica. Genera un borrador en espanol. No inventes hechos, cifras, fechas, declaraciones, fuentes ni citas. Si faltan antecedentes, indica [VERIFICAR: dato necesario]. Devuelve exclusivamente JSON valido con las claves titulo, bajada y texto, sin Markdown.\n\nSeccion: $seccion\nTitular existente: $titulo\nBajada existente: $bajada\nFuentes proporcionadas: $fuentes\n\nEncargo:\n$prompt";
$payload = json_encode(array('model' => 'gpt-5', 'input' => $instrucciones, 'store' => false));
if (!function_exists('curl_init')) { http_response_code(503); echo json_encode(array('error' => 'El hosting no tiene cURL PHP habilitado.')); exit; }
$curl = curl_init('https://api.openai.com/v1/responses'); curl_setopt($curl, CURLOPT_POST, true); curl_setopt($curl, CURLOPT_POSTFIELDS, $payload); curl_setopt($curl, CURLOPT_HTTPHEADER, array('Content-Type: application/json', 'Authorization: Bearer ' . $key)); curl_setopt($curl, CURLOPT_RETURNTRANSFER, true); curl_setopt($curl, CURLOPT_TIMEOUT, 90);
$response = curl_exec($curl); $status = curl_getinfo($curl, CURLINFO_HTTP_CODE); curl_close($curl);
if ($response === false || $status < 200 || $status >= 300) { http_response_code(502); echo json_encode(array('error' => 'La IA no pudo generar el borrador. Codigo HTTP: ' . $status)); exit; }
$answer = json_decode($response, true); $text = isset($answer['output_text']) ? trim($answer['output_text']) : ''; $article = json_decode($text, true);
if (!is_array($article)) { http_response_code(502); echo json_encode(array('error' => 'La IA devolvio un formato no valido. Intenta nuevamente.')); exit; }
echo json_encode(array('titulo' => isset($article['titulo']) ? trim($article['titulo']) : '', 'bajada' => isset($article['bajada']) ? trim($article['bajada']) : '', 'texto' => isset($article['texto']) ? trim($article['texto']) : ''), JSON_UNESCAPED_UNICODE);