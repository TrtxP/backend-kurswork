<?php

echo "<h1>Завдання 3</h1>";

$currLang = $_COOKIE['user_lang'] ?? '';

if (isset($_GET['lang'])) {
    setcookie('user_lang', $_GET['lang'], time() + (6 * 30 * 24 * 60 * 60), '/');
    $currLang = $_GET['lang'];
}

session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $_SESSION['data'] = [
        'login' => test_input($_POST['login']),
        'password' => test_input($_POST['password']),
        'repeatPass' => test_input($_POST['repeatPass']),
        'gender' => $_POST['gender'] ?? 'не вказано',
        'city' => $_POST['city'],
        'games' => $_POST['game'] ?? [],
        'aboutSelf' => test_input($_POST['aboutSelf'])
    ];

    if (isset($_FILES['photo']) && $_FILES['photo']['error'] === 0) {
        $dir = "uploads/";
        if (!is_dir($dir)) mkdir($dir);

        $filePath = $dir . basename($_FILES['photo']['name']);
        move_uploaded_file($_FILES['photo']['tmp_name'], $filePath);
        $_SESSION['data']['photo'] = $filePath;
    }

    header('Location: success.php');
    exit();
}

function test_input($data)
{
    $data = trim($data);
    $data = stripcslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="form.css">
</head>

<body>
    <div class="languages">
        <a href="index3.php?lang=ua"><img src="ukraine.png" alt="Українська мова" class="language-icon"></a>
        <a href="index3.php?lang=ru"><img src="russia.png" alt="Російська мова" class="language-icon"></a>
        <a href="index3.php?lang=po"><img src="poland.png" alt="Польська мова" class="language-icon"></a>
        <a href="index3.php?lang=en"><img src="united-states.png" alt="Англійська мова" class="language-icon"></a>
        <a href="index3.php?lang=ge"><img src="germany.png" alt="Німецька мова" class="language-icon"></a>
        <a href="index3.php?lang=fr"><img src="france.png" alt="Французька мова" class="language-icon"></a><br>
        <span><?php switch ($currLang) {
                    case 'ua':
                        echo 'Вибрана мова: Українська';
                        break;
                    case 'ru':
                        echo 'Вибрана мова: Російська';
                        break;
                    case 'po':
                        echo 'Вибрана мова: Польська';
                        break;
                    case 'en':
                        echo 'Вибрана мова: Англійська';
                        break;
                    case 'ge':
                        echo 'Вибрана мова: Німецька';
                        break;
                    case 'fr':
                        echo 'Вибрана мова: Французька';
                        break;
                    default:
                        break;
                } ?></span>
    </div>
    <form action="index3.php" enctype="multipart/form-data" method="post">
        <div class="form-group">
            <label>Логін: </label>
            <div class="centered">
                <input type="text" class="inputs" name="login" value="<?php if (isset($_SESSION['data']['login'])) {
                                                                            echo $_SESSION['data']['login'];
                                                                        } ?>">
            </div>
        </div>
        <div class="form-group">
            <label>Пароль: </label>
            <div class="centered">
                <input type="text" class="inputs" name="password" value="<?php if (isset($_SESSION['data']['password'])) {
                                                                                echo $_SESSION['data']['password'];
                                                                            } ?>">
            </div>
        </div>
        <div class="form-group">
            <label>Пароль (ще раз): </label>
            <div class="centered">
                <input type="text" class="inputs" name="repeatPass" value="<?php if (isset($_SESSION['data']['repeatPass'])) {
                                                                                echo $_SESSION['data']['repeatPass'];
                                                                            } ?>">
            </div>
        </div>
        <div class="form-group">
            <label>Стать: </label>
            <div class="centered">
                <input type="radio" name="gender" value="Чоловік" <?= (isset($_SESSION['data']['gender']) && $_SESSION['data']['gender'] === 'Чоловік') ? 'checked' : ''; ?>><span>Чоловік</span>
                <input type="radio" name="gender" value="Жінка" <?= (isset($_SESSION['data']['gender']) && $_SESSION['data']['gender'] === 'Жінка') ? 'checked' : ''; ?>><span>Жінка</span>
            </div>
        </div>
        <div class="form-group">
            <label>Місто: </label>
            <div class="centered">
                <select name="city">
                    <option value="Київ" <?= (isset($_SESSION['data']['city']) && $_SESSION['data']['city'] === 'Київ') ? 'selected' : ''; ?>>Київ</option>
                    <option value="Львів" <?= (isset($_SESSION['data']['city']) && $_SESSION['data']['city'] === 'Львів') ? 'selected' : ''; ?>>Львів</option>
                    <option value="Житомир" <?= (isset($_SESSION['data']['city']) && $_SESSION['data']['city'] === 'Житомир') ? 'selected' : ''; ?>>Житомир</option>
                    <option value="Коростень" <?= (isset($_SESSION['data']['city']) && $_SESSION['data']['city'] === 'Коростень') ? 'selected' : ''; ?>>Коростень</option>
                    <option value="Інше" <?= (isset($_SESSION['data']['city']) && $_SESSION['data']['city'] === 'Інше') ? 'selected' : ''; ?>>Інше</option>
                </select>
            </div>
        </div>
        <div class="form-group">
            <label>Улюблені ігри: </label>
            <div class="centered columned">
                <div><input type="checkbox" name="game[]" value="футбол" <?= (isset($_SESSION['data']['games']) && in_array('футбол', $_SESSION['data']['games'])) ? 'checked' : ''; ?>><span>футбол</span></div>
                <div><input type="checkbox" name="game[]" value="баксетбол" <?= (isset($_SESSION['data']['games']) && in_array('баксетбол', $_SESSION['data']['games'])) ? 'checked' : ''; ?>><span>баксетбол</span></div>
                <div><input type="checkbox" name="game[]" value="волейбол" <?= (isset($_SESSION['data']['games']) && in_array('волейбол', $_SESSION['data']['games'])) ? 'checked' : ''; ?>><span>волейбол</span></div>
                <div><input type="checkbox" name="game[]" value="шахи" <?= (isset($_SESSION['data']['games']) && in_array('шахи', $_SESSION['data']['games'])) ? 'checked' : ''; ?>><span>шахи</span></div>
                <div><input type="checkbox" name="game[]" value="World Of Tanks" <?= (isset($_SESSION['data']['games']) && in_array('World Of Tanks', $_SESSION['data']['games'])) ? 'checked' : ''; ?>><span>World Of Tanks</span></div>
            </div>
        </div>
        <div class="form-group">
            <label>Про себе: </label>
            <div class="centered">
                <textarea name="aboutSelf" cols="30" rows="10"><?= $_SESSION['data']['aboutSelf'] ?? ''; ?></textarea>
            </div>
        </div>
        <div class="form-group">
            <label>Фотографія: </label>
            <div class="centered">
                <input type="file" name="photo">
            </div>
        </div>
        <div class="form-group">
            <div class="centered">
                <div class="centered-btn"><button type="submit">Зареєструватися</button></div>
            </div>
        </div>
    </form>
</body>

</html>