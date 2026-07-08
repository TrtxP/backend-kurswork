<?php 

namespace app\Models;

use PDO;
use PDOException;

class Database {
    private string $db_host = "localhost";
    private string $db_name = "backend_kurswork_test";
    private string $db_user = "root";
    private string $db_pass = "";
    private string $db_charset = "utf8mb4";
    private ?PDO $conn = null;

    public function getConnection(): ?PDO {
        try {
            if ($this->conn === null) {
                $dsn = "mysql:host=$this->db_host;dbname=$this->db_name;charset=$this->db_charset";
                $this->conn = new PDO($dsn, $this->db_user, $this->db_pass, [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false
                ]);
            }
        } catch (PDOException $e) {
            die('<p>Помилка підключення до БД: ' . $e->getMessage() . '</p>');
        }

        return $this->conn;
    }
}

?>