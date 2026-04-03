<?php

namespace Humans;

use Humans\Human;

class Student extends Human {
    private string $university;
    private int $course;

    public function __construct(int $height, float $weight, int $year, string $university, int $course)
    {
        parent::__construct($height, $weight, $year);
        $this->university = $university;
        $this->course = $course;
    }

    public function getUniversity(): string {
        return $this->university;
    }

    public function getCourse(): int {
        return $this->course;
    }

    public function setUniversity(string $university): void {
        $this->university = $university;
    }
    
    public function setCourse(int $course): void {
        $this->course = $course;
    }

    public function nextCourse(): void {
        $this->course++;
    }

    public function birthMessage(): void
    {
        echo("Студет повідомляє про народження дитини");
    }

    public function cleaningRoom(): void
    {
        echo("Студент прибирає кімнату");
    }

    public function cleaningKitchen(): void
    {
        echo("Студент прибирає кухню");
    }
}

?>