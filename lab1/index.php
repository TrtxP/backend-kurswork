<?php

echo "<h1>Завдання 2</h1>";

echo "<pre>
Полину в мріях в купель океану,
Відчую <b>шовковистість</b> глибини,
 Чарівні мушлі з дна собі дістану,
   Щоб <i><b>взимку</b></i>
     <ins>тішили</ins>
        мене
          вони...
</pre>";

echo "<hr>";

echo "<h1>Завдання 3</h1>";

$uah = 1500;
$usd = round($uah / 43, 0);
echo $uah." грн. можна обміняти на ".$usd." доларів";

echo "<hr>";

echo "<h1>Завдання 4</h1>";

$season = "";
$month = 4;

if ($month == 12 || $month == 1 || $month == 2) {
    $season = "зима";
} elseif ($month == 3 || $month == 4 || $month == 5) {
    $season = "весна";
} elseif ($month == 6 || $month == 7 || $month == 8) {
    $season = "літо";
} elseif ($month == 9 || $month == 10 || $month == 11) {
    $season = "осінь";
} else {
    echo "Невірний номер місяця!";
}

echo $season;

echo "<hr>";

echo "<h1>Завдання 5</h1>";

$char = "а";

switch ($char) {
    case "а":
    case "е":
    case "є":
    case "и":
    case "і":
    case "ї":
        echo $char." - голосна літера";
        break;
    default:
        echo $char." - приголосна літера";
        break;
}

echo "<hr>";

echo "<h1>Завдання 6</h1>";

$random_number = mt_rand(100, 999);
echo "Згенероване трьохзначне число: ".$random_number;

$fisrt_digit = floor($random_number / 100);
$second_digit = floor(($random_number % 100) / 10);
$third_digit = $random_number % 10;

$sum = $fisrt_digit + $second_digit + $third_digit;

echo "<br>Сума числа ".$random_number.": ".$sum;

$reversed_random_number = $third_digit * 100 + $second_digit * 10 + $fisrt_digit;
echo "<br>Зворотне число: ".$reversed_random_number;

$sorted_digits = array($fisrt_digit, $second_digit, $third_digit);
rsort($sorted_digits);
echo "<br>Цифри в порядку спадання: ".implode("", $sorted_digits);

echo "<hr>";

echo "<h1>Завдання 7.1</h1>";

function table($rows, $cols) {
    echo "<table border='1' cellpadding='20' cellspacing='0'>";
    for ($i = 1; $i <= $rows; $i++) {
        echo "<tr>";
        for ($j = 1; $j <= $cols; $j++) {
            echo "<td style='background-color: rgb(
                        ".mt_rand(30, 255).", 
                        ".mt_rand(30, 255).", 
                        ".mt_rand(30, 255).")'>
                  </td>";
        }
        echo "</tr>";
    }
    echo "</table>";
}

table(5, 5);

echo "<hr>";

echo "<h1 style='color: black; position: relative; z-index: 10;'>Завдання 7.2</h1>";

function drawSquares($n) {
    echo "<style> .container {
                      position: relative;
                      margin: 20px 0;
                      background-color: black; 
                      margin: 0; 
                      overflow: hidden; 
                      width: 800px; 
                      height: 450px; 
                    } 

                  .square { 
                      position: absolute; 
                      background-color: red; 
                    } 
           </style>";

    echo "<div class='container'>";
    for ($i = 0; $i < $n; $i++) {
        $size = mt_rand(34, 90);
        $top = mt_rand(0, 90);
        $left = mt_rand(0, 90);

        echo "<div class='square' style='
                        width: {$size}px; 
                        height: {$size}px; 
                        top: {$top}%; 
                        left: {$left}%;
               '></div>";
    }
    echo "</div>";
}

drawSquares(10);

echo "<hr>";

?>