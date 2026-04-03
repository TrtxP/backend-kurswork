<?php 

namespace Controllers;

use Models\UserModel;

/** 
 * Клас UserController для керування даними користувачами
*/
class UserController {
    /**
     * Отримуємо інформацію користувача через клас UserModel
     * * @return string|array (в залежності від того, що повертає getUser)
     */
    public function showInfo() {
        $user = new UserModel();
        return $user->getUser();
    }
}

?>