<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8'); header('Cache-Control: no-store');
session_name('kitus_editor'); session_start();
$user=$_SESSION['kitus_editor']??null;
$canView=$user&&($user['role']??'')==='jefatura';
$now=new DateTimeImmutable('now',new DateTimeZone('America/Santiago'));
$temporary=$now<new DateTimeImmutable('2026-09-22 00:00:00',new DateTimeZone('America/Santiago'))&&hash_equals('kitus-metricas-21sep-2026',(string)($_GET['acceso']??''));
$file='/home/geogescl/.kitus-visitas.json';$data=is_file($file)?json_decode((string)file_get_contents($file),true):['total'=>0];
if(!isset($_COOKIE['kitus_visita'])){$data['total']=(int)($data['total']??0)+1;file_put_contents($file,json_encode($data),LOCK_EX);setcookie('kitus_visita','1',['expires'=>time()+86400,'path'=>'/','secure'=>!empty($_SERVER['HTTPS']),'httponly'=>true,'samesite'=>'Lax']);}
echo json_encode(($canView||$temporary)?['total'=>(int)($data['total']??0)]:['ok'=>true]);