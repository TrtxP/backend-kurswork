<?php

namespace Humans;

use Humans\Human;

class Programmer extends Human {
    private array $programLangs;
    private string $workExperience;

    public function __construct(int $height, float $weight, int $year, array $programLangs, string $workExperience)
    {
        parent::__construct($height, $weight, $year);
        $this->programLangs = $programLangs;
        $this->workExperience = $workExperience;
    }

    public function getProgramLangs(): array {
        return $this->programLangs;
    }

    public function getWorkExperience(): string {
        return $this->workExperience;
    }

    public function setProgramLangs(array $programLangs): void {
        $this->programLangs = $programLangs;
    }

    public function setWorkExperience(string $workExperience): void {
        $this->workExperience = $workExperience;
    }

    public function addProgramLang(string $lang): void {
        $this->programLangs[] = $lang;
    }

    public function birthMessage(): void
    {
        echo("Програміст повідомляє про народження дитини");
    }

    public function cleaningRoom(): void
    {
        echo("Програміст прибирає кімнату");
    }

    public function cleaningKitchen(): void
    {
        echo("Програміст прибирає кухню");
    }
}

?>