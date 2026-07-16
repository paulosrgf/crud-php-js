<?php

require_once __DIR__ . '/controllers.php';

$method = $_SERVER['REQUEST_METHOD'];

match ($method) {
    'GET' => handleGet($dbFile),
    'POST' => handlePost($dbFile),
    'PUT' => handlePut($dbFile),
    'PATCH' => handlePatch($dbFile),
    'DELETE' => handleDelete($dbFile),
    default => handleMethodNotAllowed(),
};