<?php

namespace Views;

/**
 * Клас UserView для відображення даних користувача
 */
class UserView {
    /**
     * Метод render для виводу даних користувача
     * @param mixed $data
     * @return void
     */
    public function render($data): void {
        echo "View: " . $data. "<br>";
    }
}

?>