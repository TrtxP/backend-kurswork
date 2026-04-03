<?php 

namespace Services;

class FileManager {
    private static string $dir = "text";

    public static function read($filename): bool | string {
        $path = self::$dir.DIRECTORY_SEPARATOR.$filename;
        return file_exists($path) ? file_get_contents($path) : false;
    }

    public static function write($filename, $text): void {
        $path = self::$dir.DIRECTORY_SEPARATOR.$filename;
        file_put_contents($path, $text, FILE_APPEND);
    }

    public static function clear($filename): void {
        $path = self::$dir.DIRECTORY_SEPARATOR.$filename;
        file_exists($path) ? file_put_contents($path, "") : false;
    }
}

?>