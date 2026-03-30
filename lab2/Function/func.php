<?php

$x = 0;
$y = 0;

function power($x, $y)
{
    return pow($x, $y);
}

function factorial($x)
{
    $result = 1;
    for ($i = 1; $i <= $x; $i++) {
        $result *= $i;
    }
    return $result;
}

function my_tg($x)
{
    return sine($x) / cosine($x);
}

function sine($x) {
    return sin($x);
}

function cosine($x) {
    return cos($x);
}

function tg($x) {
    return tan($x);
}
?>