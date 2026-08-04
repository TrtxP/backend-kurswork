import React, { useEffect, useState, useRef } from "react";
import type { Chat, Message, User } from "../../types";

export default function Messenger({
  onClose,
  currentUser,
}: {
  onClose: () => void;
  currentUser: User | null;
}) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  
  const ws = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const activeChatRef = useRef<Chat | null>(null);

  useEffect(() => {
    activeChatRef.current = activeChat;
  }, [activeChat]);

  // Fetch chats on mount
  useEffect(() => {
    fetchChats();
  }, []);

  // Initialize WebSocket when currentUser is available
  useEffect(() => {
    if (!currentUser) return;
    
    // Встановлюємо з'єднання
    ws.current = new WebSocket(`ws://localhost:8080/?userId=${currentUser.id}`);
    
    ws.current.onopen = () => console.log("WebSocket підключено");
    
    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.action === "new_message") {
        const newMsg = data.message as Message;
        
        // Якщо повідомлення належить до активного чату, додаємо його до списку
        setMessages(prev => {
          // Якщо це повідомлення для поточного чату
          if (activeChatRef.current && newMsg.chat_id === activeChatRef.current.id) {
            // Перевіряємо, чи немає його вже (уникаємо дублів)
            if (!prev.find(m => m.id === newMsg.id)) {
              return [...prev, newMsg];
            }
          }
          return prev;
        });

        // Оновлюємо список чатів (щоб показати останнє повідомлення)
        fetchChats();
      }
    };

    ws.current.onerror = (error) => console.error("WebSocket помилка:", error);
    
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [currentUser]);

  // Скрол до останнього повідомлення
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchChats = () => {
    fetch("http://localhost/backend-kurswork/public/api/chats", { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        if (data.status === "success") setChats(data.chats);
      });
  };

  const fetchMessages = (chatId: number) => {
    fetch(`http://localhost/backend-kurswork/public/api/chats/messages?chat_id=${chatId}`, { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        if (data.status === "success") setMessages(data.messages);
      });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (q.length > 2) {
      fetch(`http://localhost/backend-kurswork/public/api/users/search?q=${q}`, { credentials: "include" })
        .then(res => res.json())
        .then(data => {
          if (data.status === "success") setSearchResults(data.users);
        });
    } else {
      setSearchResults([]);
    }
  };

  const startChat = (partnerId: number, partnerName: string, partnerAvatar?: string | null) => {
    fetch("http://localhost/backend-kurswork/public/api/chats/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ partner_id: partnerId }),
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === "success") {
          const newChat: Chat = {
            id: data.chat_id,
            partner_id: partnerId,
            partner_name: partnerName,
            partner_avatar: partnerAvatar,
            updated_at: new Date().toISOString()
          };
          setActiveChat(newChat);
          fetchMessages(data.chat_id);
          setSearchQuery("");
          setSearchResults([]);
          fetchChats();
        }
      });
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !activeChat || !ws.current) return;

    const payload = {
      action: "send_message",
      chat_id: activeChat.id,
      receiver_id: activeChat.partner_id,
      message_text: messageText
    };

    ws.current.send(JSON.stringify(payload));
    setMessageText("");
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Повідомлення</h3>
        <button className="btn btn-outline-secondary btn-sm" onClick={onClose}>
          Повернутися до Дашборду
        </button>
      </div>

      <div className="row" style={{ height: "70vh" }}>
        {/* Список чатів */}
        <div className="col-md-4 d-flex flex-column border-end h-100">
          <div className="p-2 border-bottom">
            <input
              type="text"
              className="form-control"
              placeholder="Пошук користувачів..."
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          
          <div className="flex-grow-1 overflow-auto">
            {searchResults.length > 0 ? (
              <ul className="list-group list-group-flush">
                {searchResults.map(user => (
                  <li 
                    key={`search-${user.id}`} 
                    className="list-group-item list-group-item-action"
                    style={{ cursor: "pointer" }}
                    onClick={() => startChat(user.id, user.full_name, user.avatar_url)}
                  >
                    {user.full_name} <br/>
                    <small className="text-muted">{user.role === 'admin' ? 'Викладач' : 'Студент'}</small>
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="list-group list-group-flush">
                {chats.map(chat => (
                  <li
                    key={`chat-${chat.id}`}
                    className={`list-group-item list-group-item-action ${activeChat?.id === chat.id ? 'active' : ''}`}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setActiveChat(chat);
                      fetchMessages(chat.id);
                    }}
                  >
                    <div className="d-flex align-items-center">
                      <div className="rounded-circle bg-light d-flex justify-content-center align-items-center border me-3 flex-shrink-0 overflow-hidden" style={{ width: "40px", height: "40px" }}>
                        {chat.partner_avatar ? (
                          <img src={`http://localhost/backend-kurswork/public${chat.partner_avatar}`} alt="Аватар" className="w-100 h-100" style={{objectFit: "cover"}} />
                        ) : (
                          <span>{chat.partner_name.charAt(0).toUpperCase()}</span>
                        )}
                      </div>
                      <div className="text-truncate">
                        <strong>{chat.partner_name}</strong>
                        <div className="text-truncate small" style={{ opacity: 0.8 }}>
                          {chat.last_message || "Немає повідомлень"}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Вікно чату */}
        <div className="col-md-8 d-flex flex-column h-100">
          {activeChat ? (
            <>
              <div className="p-3 border-bottom d-flex align-items-center">
                <div className="rounded-circle bg-light d-flex justify-content-center align-items-center border me-3 flex-shrink-0 overflow-hidden" style={{ width: "40px", height: "40px" }}>
                  {activeChat.partner_avatar ? (
                    <img src={`http://localhost/backend-kurswork/public${activeChat.partner_avatar}`} alt="Аватар" className="w-100 h-100" style={{objectFit: "cover"}} />
                  ) : (
                    <span>{activeChat.partner_name.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <h5 className="mb-0">{activeChat.partner_name}</h5>
              </div>
              
              <div className="flex-grow-1 overflow-auto p-3" style={{ backgroundColor: "#f8f9fa" }}>
                {messages.map(msg => {
                  const isMine = msg.sender_id === currentUser?.id;
                  return (
                    <div key={msg.id} className={`d-flex mb-3 ${isMine ? 'justify-content-end' : 'justify-content-start'}`}>
                      <div 
                        className={`p-2 rounded-3 ${isMine ? 'bg-primary text-white' : 'bg-white border'}`}
                        style={{ maxWidth: "75%" }}
                      >
                        {msg.message_text}
                        <div className="text-end" style={{ fontSize: "0.7rem", opacity: 0.8, marginTop: "4px" }}>
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-3 border-top">
                <form onSubmit={sendMessage} className="d-flex gap-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Введіть повідомлення..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                  />
                  <button type="submit" className="btn btn-primary" disabled={!messageText.trim()}>
                    Відправити
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="h-100 d-flex justify-content-center align-items-center text-muted">
              Виберіть чат або знайдіть користувача, щоб почати спілкування
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
