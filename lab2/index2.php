<?php

echo "<h1>Завдання 2.1</h1>";

$array = array("A","Cat","Dog","A","Dog");
$counts = array_count_values($array);

print_r($counts);

function arrayWithRepeatedItems($counts) {

    echo '<ul style="margin: 0; padding: 0;">';

    foreach ($counts as $repeatedItems => $count) {
        if ($count > 1) {
            echo "<li>".$repeatedItems."</li>";
        }
    }

    echo "</ul>";
}

echo "<br>Елементи, які повторюються:";
arrayWithRepeatedItems($counts);

echo "<hr>";

?>

<?php

echo "<h1>Завдання 2.2</h1>";

$syllables = ['mi', 'ki', 'pa', 'lo', 'na'];

function generatePetName($parts) {
    $name = '';
    for ($i = 0; $i < 3; $i++) {
        $name .= $parts[rand(0, count($parts) - 1)];
    }
    return $name;
}

echo ucfirst(generatePetName($syllables));

echo "<hr>";

?>

<?php

echo "<h1>Завдання 2.3</h1>";

$randLength = rand(3, 7);

function createArray($length) {
    $array = [];
    for ($i = 0; $i < $length; $i++) {
        $array[] = rand(10, 20);
    }
    return $array;
}

$res = createArray($randLength);

echo "Створений масив:<br>";
print_r($res);

$first = createArray($randLength);
$second = createArray($randLength);

function mergedArray($array1, $array2) {
    $merge = array_merge($array1, $array2);
    $unique = array_unique($merge);
    sort($unique);
    return $unique;
}

echo "<br>";

echo "<br>Злитий масив:<br>";
print_r(mergedArray($first, $second));

echo "<hr>";

?>

<?php

echo "<h1>Завдання 2.4</h1>";

echo "Відсортований асоціативний масив за віком:<br>";

$arr = array("Peter"=>"43","Ben"=>"37","Joe"=>"33");

function sortAssociativeArray($arr, $sortBy) {
    switch ($sortBy) {
        case 'name':
            ksort($arr);
            break;
        case 'age':
            asort($arr);
            break;
        default:
            echo '<span style="color: red;">Невірний параметр сортування.</span><br>';
            $arr = [];
            break;
    }

    foreach ($arr as $key => $value) {
        echo "Name=" . $key . ", Age=" . $value;
        echo "<br>";
    }
}

echo sortAssociativeArray($arr, 'age');

echo "<br>";

echo "Відсортований асоціативний масив за іменем:<br>";

echo sortAssociativeArray($arr, 'name');

echo "<hr>";

?>