<?php
namespace app\WebSockets;

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;
use app\Models\Database;
use app\Models\MessageModel;

class ChatServer implements MessageComponentInterface {
    protected $clients;
    protected $users; // connection_id => user_id
    protected $db;
    protected $messageModel;

    public function __construct() {
        $this->clients = new \SplObjectStorage;
        $this->users = [];
        
        $this->db = new Database();
        $this->messageModel = new MessageModel($this->db->getConnection());
        echo "WebSocket Сервер запущено!\n";
    }

    public function onOpen(ConnectionInterface $conn) {
        $this->clients->attach($conn);
        
        $querystring = $conn->httpRequest->getUri()->getQuery();
        parse_str($querystring, $queryArray);
        
        if (isset($queryArray['userId'])) {
            $this->users[$conn->resourceId] = (int)$queryArray['userId'];
            echo "Нове з'єднання! ({$conn->resourceId}) - Користувач: {$queryArray['userId']}\n";
        } else {
            echo "З'єднання без userId ({$conn->resourceId})\n";
        }
    }

    public function onMessage(ConnectionInterface $from, $msg) {
        $data = json_decode($msg, true);
        
        if (isset($data['action']) && $data['action'] === 'send_message') {
            $senderId = $this->users[$from->resourceId] ?? null;
            $chatId = $data['chat_id'] ?? null;
            $text = $data['message_text'] ?? null;
            $receiverId = $data['receiver_id'] ?? null;

            if ($senderId && $chatId && $text) {
                // Збереження в базу
                $savedMessage = $this->messageModel->sendMessage($chatId, $senderId, $text);
                
                if ($savedMessage) {
                    $response = json_encode([
                        'action' => 'new_message',
                        'message' => $savedMessage
                    ]);

                    // Відправляємо повідомлення відправнику (щоб він побачив, що воно успішно збереглось)
                    $from->send($response);

                    // Шукаємо підключення отримувача і відправляємо йому
                    if ($receiverId) {
                        foreach ($this->clients as $client) {
                            if (isset($this->users[$client->resourceId]) && $this->users[$client->resourceId] == $receiverId) {
                                $client->send($response);
                            }
                        }
                    }
                }
            }
        }
    }

    public function onClose(ConnectionInterface $conn) {
        $this->clients->detach($conn);
        unset($this->users[$conn->resourceId]);
        echo "З'єднання {$conn->resourceId} закрито\n";
    }

    public function onError(ConnectionInterface $conn, \Exception $e) {
        echo "Помилка: {$e->getMessage()}\n";
        $conn->close();
    }
}
