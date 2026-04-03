<?php

/**
 * Перевірка результату роботи створення об'єктів 
 * через простіри імен та перевірка результату 
 * роботи сетерів та гетерів та функції
 * перевірки перетину кіл у об'єкті 
 * $circle класу Circle
 */

require_once 'autoload.php';

use Models\UserModel;
use Models\Circle;
use Controllers\UserController;
use Views\UserView;
use Services\FileManager;
use Humans\Student;
use Humans\Programmer;

echo("<h3>MVC</h3>");
$user = new UserModel();
$controller = new UserController();
$view = new UserView();
$view->render($controller->showInfo()); // user

echo("<hr>");

echo("<h3>Circle</h3>");

$circle = new Circle(2.34, 2.84, 4.34); // Створення кола

printf("x: %.2f<br>", $circle->getX()); // 2.34
printf("y: %.2f<br>", $circle->getY()); // 2.84
printf("радіус: %.2f<br>", $circle->getRadius()); // 4.34

echo("<br>");

$circle->setX(3.45);
$circle->setY(3.12);
$circle->setRadius(4.5);
printf("Новий x: %.2f<br>", $circle->getX()); // 3.45
printf("Новий y: %.2f<br>", $circle->getY()); // 3.12
printf("Новий радіус: %.2f<br>", $circle->getRadius()); // 4.5

echo("<br>");

echo($circle->isIntersect(new Circle(2.67, 3.24, 4.5)) ? "Перетинаються" : "Не перетинаються"); // Перетинаються

echo("<hr>");

echo("<h3>Files</h3>");

if (FileManager::read("file1.txt") || FileManager::read("file2.txt") || FileManager::read("file3.txt")) {
    for ($i = 1; $i <= 3; $i++) {
        FileManager::clear("file$i.txt"); // Очищення файлів
    }
} else {
    for ($i = 1; $i <= 3; $i++) {
        FileManager::write("file$i.txt", "Тестовий текст для файлу file$i.txt"); // Запис даних у 3 файли
        echo(FileManager::read("file$i.txt")); // Виведення даних з файлів
        echo("<br>");
    }
}

echo("<hr>");

echo("<h3>Humans</h3>");

$student = new Student(170, 67, 20, "ZTU", 1);  
$student->birthMessage(); // Студет повідомляє про народження дитини
echo("<br>");
printf("Ріст студента: %d<br>", $student->getHeight()); // 170
printf("Вага студента: %d<br>", $student->getWeight()); // 67
printf("Вік студента: %d<br>", $student->getYear()); // 20
printf("Навчальний заклад: %s<br>", $student->getUniversity()); // ZTU
printf("Курс: %d<br>", $student->getCourse()); // 1
$student->nextCourse();
printf("Наступний курс: %d<br>", $student->getCourse()); // 2
$student->cleaningRoom(); // Студент прибирає кімнату

echo("<br><br>");

$programmer = new Programmer(180, 70, 21, ["Python"], "Junior");
$programmer->birthMessage(); // Програміст повідомляє про народження дитини
echo("<br>");
printf("Ріст програмістa: %d<br>", $programmer->getHeight()); // 180
printf("Вага програмістa: %d<br>", $programmer->getWeight()); // 70
printf("Вік програмістa: %d<br>", $programmer->getYear()); // 21
printf("Стек мов програміста: ", $programmer->getProgramLangs()); // Python
printf("Досвід програміста: %s<br>", $programmer->getWorkExperience()); // Junior
$programmer->addProgramLang("Java");
printf("Мова програмування для вивчення: %s<br>", $programmer->getProgramLangs()[1]); // Java
$programmer->cleaningKitchen(); // Програміст прибирає кухню

echo("<hr>");

?>