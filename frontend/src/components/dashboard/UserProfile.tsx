import React, { useEffect, useRef, useState } from "react";
import type { User } from "../../types";

interface UserProfileProps {
  onClose: () => void;
}

export default function UserProfile({ onClose }: UserProfileProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchProfile = () => {
    fetch("http://localhost/backend-kurswork/public/api/profile", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Не вдалося завантажити профіль");
        return res.json();
      })
      .then((data: User) => {
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    fetch("http://localhost/backend-kurswork/public/api/profile/avatar/upload", {
      method: "POST",
      body: formData,
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          fetchProfile(); // Refresh profile to show new avatar
        } else {
          alert(data.message || "Помилка завантаження");
        }
      })
      .catch((err) => {
        alert("Помилка мережі при завантаженні");
      });
  };

  const handleDeleteAvatar = () => {
    if (!confirm("Ви впевнені, що хочете видалити аватар?")) return;

    fetch("http://localhost/backend-kurswork/public/api/profile/avatar/delete", {
      method: "DELETE",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          fetchProfile();
        } else {
          alert(data.message || "Помилка видалення");
        }
      })
      .catch((err) => {
        alert("Помилка мережі при видаленні");
      });
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Завантаження...</span>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">Помилка: {error || "Користувача не знайдено"}</div>
        <button className="btn btn-secondary" onClick={onClose}>
          Повернутися
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="card shadow p-4 mx-auto" style={{ maxWidth: "600px" }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Профіль користувача</h2>
          <button className="btn btn-outline-secondary btn-sm" onClick={onClose}>
            Закрити
          </button>
        </div>
        
        <div className="text-center mb-4">
          <div 
            className="rounded-circle bg-light d-inline-flex justify-content-center align-items-center border overflow-hidden position-relative"
            style={{ width: "120px", height: "120px", cursor: "pointer" }}
            onClick={handleAvatarClick}
            title="Натисніть, щоб змінити аватар"
          >
            {user.avatar_url ? (
              <img 
                src={`http://localhost/backend-kurswork/public${user.avatar_url}`} 
                alt="Аватар" 
                className="w-100 h-100" 
                style={{ objectFit: "cover" }} 
              />
            ) : (
              <span className="text-muted fs-1">
                {user.full_name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="d-none" 
          />
          
          {user.avatar_url && (
            <div className="mt-2">
              <button 
                className="btn btn-outline-danger btn-sm" 
                onClick={handleDeleteAvatar}
              >
                Видалити фото
              </button>
            </div>
          )}
        </div>

        <div className="mb-3">
          <p className="text-muted mb-1">ПІБ</p>
          <h5>{user.full_name}</h5>
        </div>
        
        <div className="mb-3">
          <p className="text-muted mb-1">Логін</p>
          <h5>{user.login}</h5>
        </div>
        
        <div className="mb-3">
          <p className="text-muted mb-1">Роль</p>
          <h5>{user.role === "admin" ? "Викладач" : "Студент"}</h5>
        </div>
        
        <div className="mb-4">
          <p className="text-muted mb-1">Група / Кафедра</p>
          <h5>{user.group_name || "Не вказано"}</h5>
        </div>
      </div>
    </div>
  );
}
