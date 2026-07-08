<?php

spl_autoload_register(function ($class) {
    // Нормалізування назви класу 
    if (strpos($class, 'app\\') === 0) {
        $classWithoutPrefix = substr($class, 4);
    } else {
        $classWithoutPrefix = $class;
    }

    // Шлях до класу
    $classPath = str_replace('\\', DIRECTORY_SEPARATOR, $classWithoutPrefix) . '.php';

    // Повний шлях до класу
    $fullPath = __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'app' . DIRECTORY_SEPARATOR . $classPath;

    // Переводимо у низький регістр, якщо існують класи написані з маленькою літерою
    if (file_exists($fullPath)) {
        require_once $fullPath;
    } else {
        $lowerFullPath = strtolower($fullPath);
        if (file_exists($lowerFullPath)) {
            require_once $lowerFullPath;
        }
    }
});
