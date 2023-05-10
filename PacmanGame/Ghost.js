import Pacman from "./pacman.js";

export default class Ghost {
    constructor(startPosition, radius, tileSize, speed) {
    this.x = startPosition.x;
    this.y = startPosition.y;
    this.radius = radius;
    this.tileSize = tileSize;
    this.speed = tileSize / 20;
    
    }
  
  
  }
  