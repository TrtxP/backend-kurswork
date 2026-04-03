<?php 

namespace Models;

class Circle {
    private float $x;
    private float $y;
    private float $radius;

    public function __construct(float $x, float $y, float $radius)
    {
        $this->x = $x;
        $this->y = $y;
        $this->radius = $radius;
    }

    public function __toString(): string
    {
        return "Коло з центром ({$this->x}, {$this->y}) та радіусом {$this->radius}";
    }

    public function getX(): float {
        return $this->x;
    }

    public function getY(): float {
        return $this->y;
    }

    public function getRadius(): float {
        return $this->radius;
    }

    public function setX(float $x): void {
        $this->x = $x;
    }

    public function setY(float $y): void {
        $this->y = $y;
    }

    public function setRadius($radius): void {
        $this->radius = $radius;
    }

    public function isIntersect(Circle $circle): bool {
        $dx = $circle->getX() - $this->x;
        $dy = $circle->getY() - $this->y;
        $d = sqrt($dx * $dx + $dy * $dy);

        return $d <= ($this->radius + $circle->getRadius());
    }
}

?>