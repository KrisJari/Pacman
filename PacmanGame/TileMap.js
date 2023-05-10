import Pacman from "./pacman.js";
import Dots from "./dots.js";


export default class TileMap {
  constructor(tileSize) {
    this.tileSize = tileSize;
    this.wall = this.#image("wall.png");
    this.pacman = this.#image("pac1.png");
    this.dots = this.#image("yellowDot.png");
    this.ghost = this.#image("ghost.png");
  }

  #image(fileName) {
    const img = new Image();
    img.src = `img/${fileName}`;
    return img;
  }
  hasDot(row, col) {
    return this.map[row][col] === 1;
  }

  //1 - wall
  //0 - dots
  //2 - pacman
  //3 enemies
  map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, , 2, , , , , , , , , , , 3, 1],
    [1, , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, , 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1],
    [1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ];

  map1 = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, , 2, , , , , , , , , , , 1, 1],
    [1,3, 1, 1, 1, 1, 1, 1, , 1, 1, , , , 1],
    [1, , 1, , 0, 0, 0, 0, , , , , , , 1],
    [1, , , , 1, 1, 1, 1, , 1, 1, 1, 1, 0, 1],
    [1, , , , 1, 0, 0, 0, , 0, 0, 0, 0, 0, 1],
    [1, , 1, , 1, 0, 1, 1, , 1, 0, 1, 1, 0, 1],
    [1, , 1, , 1, 0, 1, 1, , 1, 0, 1, 1, 0, 1],
    [1, , 1, 0, 1, 0, 1, 1, , 1, 0, 1, 1, 0, 1],
    [1, , , 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ];

  draw(canvas, ctx) {
    this.#setCanvasSize(canvas);
    this.#clearCanvas(canvas, ctx);
    this.#drawMap(ctx);
  }

  #drawMap(ctx) {
    for (let row = 0; row < this.map.length; row++) {
      for (let column = 0; column < this.map[row].length; column++) {
        const tile = this.map[row][column];
        let image = null;
        switch (tile) {
          case 1:
            image = this.wall;
            break;
          case 0:
            image = this.dots;
            break;
          case 2:
            image = this.pacman;
            break;
          case 3:
            image = this.ghost;
            break;
        }

        if (image != null)
          ctx.drawImage(
            image,
            column * this.tileSize,
            row * this.tileSize,
            this.tileSize,
            this.tileSize
          );
      }
    }
  }


  #clearCanvas(canvas, ctx) {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  #setCanvasSize(canvas) {
    canvas.height = this.map.length * this.tileSize;
    canvas.width = this.map[0].length * this.tileSize;
  }

  getPacmanStartPosition() {
    for (let row = 0; row < this.map.length; row++) {
      for (let col = 0; col < this.map[row].length; col++) {
        if (this.map[row][col] === 2) {
          this.map[row][col] = 0;
          return {
            x: col * this.tileSize + this.tileSize / 2,
            y: row * this.tileSize + this.tileSize / 2,
          };
        }
      }
    }
  }
  getDotStartPosition() {
    for (let row = 0; row < this.map.length; row++) {
      for (let col = 0; col < this.map[row].length; col++) {
        if (this.map[row][col] === 0) {
          return {
            x: col * this.tileSize + this.tileSize / 2,
            y: row * this.tileSize + this.tileSize / 2,
          };
        }
      }
    }
  }
  getGhostStartPosition() {
    for (let row = 0; row < this.map.length; row++) {
      for (let col = 0; col < this.map[row].length; col++) {
        if (this.map[row][col] === 3) {
          return {
            x: col * this.tileSize + this.tileSize / 2,
            y: row * this.tileSize + this.tileSize / 2,
          };
        }
      }
    }
  }
}
