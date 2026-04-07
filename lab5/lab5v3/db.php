<?php

define('DB_HOST', 'localhost');
define('DB_NAME', 'company_db');
define('DB_USER', 'homeuser');
define('DB_PASS', 'tdolaj-Wutr7*v.T');
define('DB_CHARSET', 'utf8');

function getDB()
{
    try {
        $pdo = new PDO(
            'mysql:host=' . DB_HOST .
                ';dbname=' . DB_NAME .
                ';charset=' . DB_CHARSET,
            DB_USER,
            DB_PASS
        );

        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

        return $pdo;
    } catch (PDOException $e) {
        die('<p style="color: red;">Помилка підключення до БД: ' . $e->getMessage() . '</p>');
    }
}
?>