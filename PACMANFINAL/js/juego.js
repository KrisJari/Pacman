let canvas;
let ctx;
let FPS = 50;

let anchoF = 50;
let altoF = 50;

let muro = '#044f14';
let puerta = '#3a1700';
let tierra = '#c6892f';
let llave = '#c6bc00';

let protagonista;

let enemigo=[]; // Array de enemigos

let imagenAntorcha; 

let tileMap;

let musica;
let sonido1, sonido2, sonido3;

let puntos=0;
let vidas=3;
let tieneLlave='SI';
let noTieneLlave='NO';

let victoria=false;
let highscore=0;


musica = new Howl({
  src: ['music/fortaleza.mp3'],
  loop: false
});

sonido1 = new Howl({
  src: ['sound/fuego.wav'],
  loop: false
});

sonido2 = new Howl({
  src: ['sound/llave.wav'],
  loop: false
});

sonido3 = new Howl({
  src: ['sound/puerta.wav'],
  loop: false
});


let escenario = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,2,2,2,2,2,0,0,2,2,2,2,2,2,0],
  [0,2,2,2,2,2,0,0,2,2,2,2,2,2,0],
  [0,2,2,2,2,2,2,2,2,2,2,2,2,2,0],
  [0,2,2,2,2,2,2,2,2,2,2,2,2,2,0],
  [0,2,2,2,2,2,2,2,2,3,2,2,2,2,0],
  [0,2,2,2,2,2,2,2,2,2,2,2,2,2,0],
  [0,2,2,2,2,2,0,0,2,2,2,1,2,2,0],
  [0,2,2,2,2,2,0,0,2,2,2,2,2,2,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
]

let escenario1 = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,2,2,2,2,2,0,0,2,2,2,0,2,2,0],
  [0,2,2,2,2,2,0,0,2,2,2,0,2,2,0],
  [0,0,2,2,2,2,0,0,2,2,2,0,2,2,0],
  [0,2,2,2,2,2,2,2,2,2,2,0,2,2,0],
  [0,2,2,2,2,2,2,3,2,3,2,2,2,2,0],
  [0,2,2,2,2,0,2,2,0,0,2,2,2,2,0],
  [0,2,2,0,0,0,0,0,0,0,2,1,0,0,0],
  [0,2,2,0,0,0,0,0,0,0,2,2,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
]

// DIBUJO EL ESCENARIO

function dibujaEscenario(){

  for(y=0;y<10;y++){
    for(x=0;x<15;x++){

      if(victoria!=true){
      let tile = escenario[y][x];
      ctx.drawImage(tileMap,tile*32,0,32,32,anchoF*x,altoF*y,anchoF,altoF);
      }
      else{

        let tile = escenario1[y][x];
        ctx.drawImage(tileMap,tile*32,0,32,32,anchoF*x,altoF*y,anchoF,altoF);
      }


    }
  }
}


let antorcha = function(x,y){
  this.x = x;
  this.y = y;

  this.retraso = 10;
  this.contador = 0;
  this.fotograma = 0; //0-3


  this.cambiaFotograma = function(){
    if(this.fotograma < 3) {
      this.fotograma++;
    }
    else{
      this.fotograma = 0;
    }

  }


  this.dibuja = function(){

    if(this.contador < this.retraso){
      this.contador++;
    }
    else{
      this.contador = 0;
      this.cambiaFotograma();
    }

    ctx.drawImage(tileMap,this.fotograma*32,64,32,32,anchoF*x,altoF*y,anchoF,altoF);
  }

}


//CLASE ENEMIGO
let malo = function(x,y){
    this.x = x;
    this.y = y;

    this.direccion = Math.floor(Math.random()*4);

    this.retraso = 50;
    this.fotograma = 0;


    this.dibuja = function(){
      ctx.drawImage(tileMap,0,32,32,32,this.x*anchoF,this.y*altoF,anchoF,altoF);
    }


    this.compruebaColision = function(x,y){
        let colisiona = false;

        if(escenario[y][x]==0 || escenario1[y][x]==0){
          colisiona = true;
        }
        return colisiona;
    }


    this.mueve = function(){

      protagonista.colisionEnemigo(this.x, this.y);


      if(this.contador < this.retraso){
        this.contador++;
      }

      else{
        this.contador = 0;

        //ARRIBA
        if(this.direccion == 0){
          if(this.compruebaColision(this.x, this.y - 1)==false){
            this.y--;
          }
          else{
            this.direccion = Math.floor(Math.random()*4);
          }
        }


        //ABAJO
        if(this.direccion == 1){
          if(this.compruebaColision(this.x, this.y + 1)==false){
            this.y++;
          }
          else{
            this.direccion = Math.floor(Math.random()*4);
          }
        }

        //IZQUIERDA
        if(this.direccion == 2){
          if(this.compruebaColision(this.x - 1, this.y)==false){
            this.x--;
          }
          else{
            this.direccion = Math.floor(Math.random()*4);
          }
        }

        //IZQUIERDA
        if(this.direccion == 3){
          if(this.compruebaColision(this.x + 1, this.y)==false){
            this.x++;
          }
          else{
            this.direccion = Math.floor(Math.random()*4);
          }
        }
      }

    }

}


//OBJETO JUGADOR
let jugador = function(){
  this.x = 1;
  this.y = 1;
  this.color = '#820c01';
  this.llave = false;

  

  this.dibuja = function(){
    ctx.drawImage(tileMap,32,32,32,32,this.x*anchoF,this.y*altoF,anchoF,altoF);
  }


  this.colisionEnemigo = function(x,y){
    if(this.x == x && this.y == y){
        this.muerte();
        
    }

  }


  this.margenes = function(x,y){
    let colision = false;

    if(escenario[y][x]==0|| escenario1[y][x]==0){
      colision = true;
    }

    return(colision);
  }



  this.arriba = function(){
    if(this.margenes(this.x, this.y-1)==false){
      this.y--;
      this.logicaObjetos();
    }
  }


  this.abajo = function(){
    if(this.margenes(this.x, this.y+1)==false){
      this.y++;
      this.logicaObjetos();
    }
  }

  this.izquierda = function(){
    if(this.margenes(this.x-1, this.y)==false){
      this.x--;
      this.logicaObjetos();
    }
  }

  this.derecha = function(){
    if(this.margenes(this.x+1, this.y)==false){
      this.x++;
      this.logicaObjetos();
    }
  }

  this.victoria = function(){

    sonido3.play();
    console.log('Has ganado!');


    this.x = 1;
    this.y = 1;

    this.llave = false;   //el jugador ya no tiene la llave
    escenario[8][3] = 3;  //volvemos a poner la llave en su sitio
    escenario1[5][7]=3;
     puntos=puntos+100;

    if(puntos>highscore)
    {
      highscore=puntos;
      localStorage.setItem("hscore",puntos);
      document.getElementById("hscore").innerHTML=localStorage.getItem("hscore");
  
    } 
       victoria=true;
  }


  this.muerte = function(){

    sonido1.play();
    this.x = 1;
    this.y = 1;
    if(vidas!==0)
    {
    vidas=vidas-1;
    }
    else{
       console.log('Has perdido!');
    }
    sessionStorage.setItem("llave",noTieneLlave);
    document.getElementById("llave").innerHTML=sessionStorage.getItem("llave");

    sessionStorage.setItem("life",vidas);
    document.getElementById("life").innerHTML=sessionStorage.getItem("life");
    this.llave = false;   //el jugador ya no tiene la llave
    escenario[8][3] = 3; 
    escenario1[5][7]=3; //volvemos a poner la llave en su sitio
  }




  this.logicaObjetos = function(){
    let objeto = escenario[this.y][this.x];
    let objeto2=   escenario1[this.y][this.x];

    //OBTIENE LLAVE
    if(objeto == 3||objeto2==3){

      sonido2.play();

      this.llave = true;
      escenario[this.y][this.x]=2;
      escenario1[this.y][this.x]=2;
     
      sessionStorage.setItem("llave",tieneLlave);
      document.getElementById("llave").innerHTML=sessionStorage.getItem("llave");

      puntos=puntos+50;
      sessionStorage.setItem("puntitos",puntos);
      document.getElementById("puntitos").innerHTML= sessionStorage.getItem("puntitos");

      console.log('Has obtenido la llave!!');
    
    }



    //ABRIMOS LA PUERTA
    if(objeto == 1){
      if(this.llave == true)
        this.victoria();
      else{
        
        sessionStorage.setItem("llave",noTieneLlave);
        document.getElementById("llave").innerHTML=sessionStorage.getItem("llave");
        console.log('No tienes la llave, no puedes pasar!');
      }
    }


  }

}

// BUCLE PRINCIPAL

function inicializa(){
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');

  tileMap = new Image();
  tileMap.src = 'img/tilemap.png';

  musica.play();

  //CREAMOS AL JUGADOR
  protagonista = new jugador();

  //CREAMOS LA ANTORCHA
  imagenAntorcha = new antorcha(7,2);
  imagenAntorcha1 = new antorcha(7,7); 
   imagenAntorcha2 = new antorcha(0,2);
  //CREAMOS LOS ENEMIGOS
  enemigo.push(new malo(3,3));
  enemigo.push(new malo(5,7));
  enemigo.push(new malo(7,7));

  //LECTURA DEL TECLADO
  document.addEventListener('keydown',function(tecla){

    if(tecla.keyCode == 38){
      protagonista.arriba();
    }

    if(tecla.keyCode == 40){
      protagonista.abajo();
    }

    if(tecla.keyCode == 37){
      protagonista.izquierda();
    }

    if(tecla.keyCode == 39){
      protagonista.derecha();
    }

  });

  setInterval(function(){
    principal();
  },1000/FPS);
}


function borraCanvas(){
  canvas.width=750;
  canvas.height=500;
}

// GENERA TODO EL MOVIMIENTO DEL JUEGO

function principal(){
  borraCanvas();
  dibujaEscenario();
 
  imagenAntorcha.dibuja();
  imagenAntorcha1.dibuja();
  imagenAntorcha2.dibuja();
  protagonista.dibuja();


  for(c=0; c<enemigo.length; c++){
    enemigo[c].mueve();
    enemigo[c].dibuja();
  }
}