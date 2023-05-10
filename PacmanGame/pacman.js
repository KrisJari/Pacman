
import TileMap from "./TileMap.js";


export default class Pacman {
  constructor(startPosition, radius, tileSize, sprites) {
    this.x = startPosition.x;
    this.y = startPosition.y;
    this.radius = radius;
    this.tileSize = tileSize;
    this.direction = "right";
    this.speed = tileSize / 20;
    this.sprites = sprites;
    this.spriteIndex = 0;
    this.eatenDots = 0;
  }

  move(tileMap) {
    // Calcular la nueva posición de Pacman según su dirección.
    let newX = this.x;
    let newY = this.y;
    if (this.direction === "right") {
      newX += this.speed;
    } else if (this.direction === "left") {
      newX -= this.speed;
    } else if (this.direction === "up") {
      newY -= this.speed;
    } else if (this.direction === "down") {
      newY += this.speed;
    }

    // Comprobar si Pacman choca con una pared o un borde del canvas.
    const collision = this.checkCollision(newX, newY, this.tileSize, tileMap);
    if (!collision) {
      this.x = newX;
      this.y = newY;
    }
    //verifica si se comió el punto
    const tileHungry=tileMap.getTile();
    //Cambiar el valor de spriteIndex para que la imagen mostrada cambie a la siguiente en la secuencia de animación.
    this.spriteIndex = (this.spriteIndex + 1) % (this.sprites.length * 2);

  }

  draw(ctx) {
    // Dibujar el sprite actualizado en la nueva posición.
    ctx.drawImage(
      this.sprites[this.spriteIndex % this.sprites.length],
      this.x - this.radius,
      this.y - this.radius,
      this.radius * 2,
      this.radius * 2
    );
  }

  //TODO: Implementar el método checkCollision
  checkCollision(newX, newY, tileSize, map) {
    // Calculate the tile indices based on the new position
    const tileX = Math.floor(newX / tileSize);
    const tileY = Math.floor(newY / tileSize);

    // Check if the new position is outside the map boundaries
    if (tileX < 0 || tileY < 0 || tileX >= map.width || tileY >= map.height) {
      return true; // There is a collision
    }

    // Check if the new position is inside a wall (assuming walls are represented by '1' in the map)
    if (map.map[tileY][tileX] === 1) {
      return true; // There is a collision
    }

    return false; // There is no collision
  }

}
