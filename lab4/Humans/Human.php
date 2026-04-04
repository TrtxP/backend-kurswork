<?php 

namespace Humans;

use Humans\CleaningHouse;

abstract class Human implements CleaningHouse {
    protected int $height;
    protected int $weight;
    protected int $year;

    public function __construct(int $height, int $weight, int $year)
    {
        $this->height = $height;
        $this->weight = $weight;
        $this->year = $year;
    }

    public function getHeight(): int {
        return $this->height;
    }

    public function getWeight(): int { 
        return $this->weight;
    }

    public function getYear(): int {
        return $this->year;
    }

    public function setHeight(int $height): void {
        $this->height = $height;
    }

    public function setWeight(int $weight): void {
        $this->weight = $weight;
    }

    public function setYear(int $year): void {
        $this->year = $year;
    }

    protected abstract function birthMessage(): void;
}

?>