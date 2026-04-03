<?php

namespace Models;

/**
 * Клас UserModel для взаємодії з даними користувачів у сховищі.
 */
class UserModel {
    private string $user = "user";

    /**
     * Отримує дані з користувача через атрибут $user
     * * @return string|array (в залежності від того, що повертає метод getUser)
     */
    public function getUser() {
        return $this->user;
    }
}

?>