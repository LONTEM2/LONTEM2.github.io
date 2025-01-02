<?php
$file = 'scores.json';

// Obsługa odczytu wyników
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (file_exists($file)) {
        echo file_get_contents($file);
    } else {
        echo json_encode([]);
    }
    exit;
}

// Obsługa zapisu wyników
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['name']) || !isset($data['score'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Nieprawidłowe dane']);
        exit;
    }

    $scores = file_exists($file) ? json_decode(file_get_contents($file), true) : [];
    $scores[] = ['name' => $data['name'], 'score' => (int)$data['score']];

    // Sortowanie wyników i ograniczenie do 10
    usort($scores, fn($a, $b) => $b['score'] - $a['score']);
    $scores = array_slice($scores, 0, 10);

    file_put_contents($file, json_encode($scores, JSON_PRETTY_PRINT));
    echo json_encode(['success' => true]);
    exit;
}
