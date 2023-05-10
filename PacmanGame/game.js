import TileMap from "./TileMap.js";
import Pacman from "./pacman.js";
import Ghost from "./Ghost.js";

export default class Game {
  constructor(canvas, ctx, tileSize) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.tileSize = tileSize;

    this.tileMap = new TileMap(tileSize);
    //this.pacman = new Pacman(0, 0, tileSize / 2, tileSize);
    //const pacmanStartPosition = this.tileMap.getPacmanStartPosition();
    this.pacman = new Pacman(this.tileMap.getPacmanStartPosition(), tileSize / 2, tileSize);
    //this.pacman = new Pacman(1, 2, tileSize / 2, tileSize);
    this.ghost = new Ghost(this.tileMap.getGhostStartPosition(), tileSize / 2, tileSize);
    //crear un objeto dots 
    this.dots=new this.dots(this.tileMap.getDotStartPosition(),tileSize/2,tileSize);

    this.gameState = {
      score: 0,
      lives: 3,
      level: 1,
    };

    if (localStorage.getItem("gameState")) {
      this.gameState = JSON.parse(localStorage.getItem("gameState"));
    }

    document.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        this.pacman.direction = "left";
      } else if (event.key === "ArrowUp") {
        this.pacman.direction = "up";
      } else if (event.key === "ArrowRight") {
        this.pacman.direction = "right";
      } else if (event.key === "ArrowDown") {
        this.pacman.direction = "down";
      }
    });

    this.preload();

    setInterval(() => this.gameLoop(), 1000 / 60);
  }

//colision entre pacman y dots
    checkCollisionDots(pacman,dots)
    {
      let dx=pacman.x-dots.x;
      let dy=pacman.y-dots.y
      let distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < pacman.radius + dots.radius) {
        // Devuelve true si los objetos se están tocando
        return true;
      } else {
        // Devuelve false si los objetos no se están tocando
        return false;
      }
    }



  async preload() {
    // Carga los sprites para Pacman
    const pacmanSprites = [];
    //si detecta una dot entonces carga la animacion
    if(checkCollisionDots(pacman,dots)!=false){
        for (let i = 1; i <= 3; i++) {
          const sprite = new Image();
          sprite.src = `img/pac${i}.png`;
          pacmanSprites.push(sprite);
        
        }
      }
    // Agrega los sprites a la propiedad sprites del objeto Pacman
    this.pacman.sprites = pacmanSprites;

    // Wait for all images to load
    await Promise.all(pacmanSprites.map(sprite => new Promise(resolve => {
      sprite.onload = () => resolve();
    })));

    // Start the game loop once all images are loaded
    setInterval(() => this.gameLoop(), 1000 / 60);
  }


  gameLoop() {
    this.tileMap.draw(this.canvas, this.ctx);

    this.pacman.move(this.tileMap);

    this.pacman.draw(this.ctx, this.tileMap.pacman);

    for (const ghost of this.ghosts) {
      ghost.move();
      ghost.draw(this.ctx, this.tileMap.ghosts);
    }

    localStorage.setItem("gameState", JSON.stringify(this.gameState));
  }
}





