<?php

function getConnection(string $dbFile): PDO
{
    $pdo = new PDO('sqlite:' . $dbFile);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

    // Garante que a tabela existe (não recria se já houver dados)
    $pdo->exec('CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        stock INTEGER NOT NULL,
        category TEXT NOT NULL
    )');

    return $pdo;
}

// Nome diferente de "getAllProducts" de propósito — essa já existe em services.php,
// e PHP não permite duas funções com o mesmo nome no mesmo escopo global.
function queryProducts(string $dbFile, ?string $nameFilter = null): array
{
    $pdo = getConnection($dbFile);

    if ($nameFilter !== null && trim($nameFilter) !== '') {
        $stmt = $pdo->prepare('SELECT * FROM products WHERE name LIKE :name ORDER BY id');
        $stmt->execute(['name' => '%' . $nameFilter . '%']);
    } else {
        $stmt = $pdo->query('SELECT * FROM products ORDER BY id');
    }

    return $stmt->fetchAll();
}

function findProductById(string $dbFile, int $id): ?array
{
    $pdo = getConnection($dbFile);
    $stmt = $pdo->prepare('SELECT * FROM products WHERE id = :id');
    $stmt->execute(['id' => $id]);
    $result = $stmt->fetch();
    return $result === false ? null : $result;
}

function insertProduct(string $dbFile, array $product): array
{
    $pdo = getConnection($dbFile);
    $stmt = $pdo->prepare(
        'INSERT INTO products (name, price, stock, category) VALUES (:name, :price, :stock, :category)'
    );
    $stmt->execute($product);
    $product['id'] = (int) $pdo->lastInsertId();
    return $product;
}

function updateProduct(string $dbFile, int $id, array $fields): ?array
{
    if (findProductById($dbFile, $id) === null) {
        return null;
    }

    $pdo = getConnection($dbFile);
    $setParts = array_map(fn($key) => "$key = :$key", array_keys($fields));
    $fields['id'] = $id;

    $stmt = $pdo->prepare('UPDATE products SET ' . implode(', ', $setParts) . ' WHERE id = :id');
    $stmt->execute($fields);

    return findProductById($dbFile, $id);
}

function deleteProduct(string $dbFile, int $id): ?array
{
    $existing = findProductById($dbFile, $id);
    if ($existing === null) {
        return null;
    }

    $pdo = getConnection($dbFile);
    $stmt = $pdo->prepare('DELETE FROM products WHERE id = :id');
    $stmt->execute(['id' => $id]);

    return $existing;
}