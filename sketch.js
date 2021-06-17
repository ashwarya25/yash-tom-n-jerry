var PLAY=1;
var END=0;
var gameState=PLAY;

var tom,tomImg,tomImg2;
var jerry,jerryImg;
var spike,spikeImg,spikeImg2;
var coin,coinImg,coinsGroup;
var obstacle,o1,o2,o3,obstaclesGroup;
var bg;
var gameOver;

var score=0;
var coinpoints=0;
var jumpsound,bgsound,mousesound,gameoversound,barksound


function preload()
{
  bgImage=loadImage("bg.jpg")
   
  tomImg=loadAnimation("tom/t1.png","tom/t2.png","tom/t3.png","tom/t4.png","tom/t5.png","tom/t6.png",
  "tom/t7.png","tom/t8.png");
  tomImg2=loadAnimation("tom/t3.png");
  jerryImg=loadAnimation("jerry/j1.png","jerry/j2.png","jerry/j3.png","jerry/j4.png","jerry/j5.png",
 "jerry/j6.png","jerry/j7.png","jerry/j8.png","jerry/j9.png","jerry/j10.png", "jerry/j11.png","jerry/j12.png",
 "jerry/j13.png","jerry/j14.png","jerry/j15.png","jerry/j16.png","jerry/j17.png","jerry/j18.png","jerry/j19.png");

 spikeImg=loadAnimation("spike/spike1.png","spike/spike2.png","spike/spike3.png","spike/spike4.png")
 spikeImg2=loadAnimation("spike/spike3.png")
  coinImg=loadImage("coin.png")
  o1 =loadImage("o1.png");
  o2 =loadImage("o2.png");
  o3 =loadImage("o3.png");

  gameOverImg = loadImage("gameover.png");
  restartImg = loadImage("restart.png");

  jumpsound=loadSound("sounds/jump.mp3")
  mousesound=loadSound("sounds/mouse.mp3")
  barksound=loadSound("sounds/bark.mp3")
  gameoversound=loadSound("sounds/Gameover.mp3")
 

}

function setup()
 {
  createCanvas(windowWidth,windowHeight);

  ground=createSprite(600,windowHeight-160,1400,10);
  ground.shapeColor="brown";

  bg= createSprite(600,140, 1200,640);
  bg.addImage(bgImage)
  bg.x=bg.width/2
  bg.scale=2.7
 
 

  tom= createSprite(330, windowHeight-170, 50, 50);
  tom.addAnimation("running" , tomImg)
  tom.addAnimation("collided", tomImg2);
  tom.scale=1.2;
  tom.setCollider("rectangle",0,0,100,150);

  jerry=createSprite(windowWidth-500,windowHeight-230,20,20);
  jerry.addAnimation("teasing",jerryImg);
  jerry.scale=0.6;
  jerry.visible=false;
 
  spike=createSprite(70,windowHeight-270,20,20);
  spike.addAnimation("bite",spikeImg);
  spike.addAnimation("collided", spikeImg2);
  spike.scale=1;
  spike.visible=true
 
  obstaclesGroup=new Group()
  coinsGroup=new Group()
  
  gameOver = createSprite(windowWidth/2,windowHeight/2-150);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 1;
  gameOver.visible = false;

  restart = createSprite(windowWidth/2,windowHeight/2);
  restart.addImage(restartImg);
  restart.scale = 0.4; 
  restart.visible = false;
  
}

function draw()
{
  background("pink"); 
  
  if (gameState===PLAY){
  
    score = score + Math.round(getFrameRate()/60);
    
   if(frameCount%20===0){
     barksound.play()
   }

  if(bg.x<0){
    bg.x=bg.width/2;
  }
  bg.velocityX=-(7+score/100);
  if ((touches.length > 0 || keyDown("space") &&tom.y>windowHeight-300)) 
  {
    tom.velocityY=-14;   
    jumpsound.play();
    touches = [];
  }
  tom.velocityY=tom.velocityY+0.5;
  spawnObstacles()
  spawnCoins();

  if(obstaclesGroup.isTouching(tom))
  {
    gameState = END;
    mousesound.play()
    setTimeout(() => { gameoversound.play() }, 1000);
    
  
   
  }
  if(coinsGroup.isTouching(tom))
  {
    coinpoints+=1
    coinsGroup.destroyEach()
  }
}
else if (gameState === END) {
  gameOver.visible = true;
  restart.visible = true;
  jerry.visible=true;
  spike.y= tom.y+70
  spike.x=tom.x-170;
  tom.x=270
  
  //set velcity of each game object to 0
  bg.velocityX = 0;
  tom.velocityY = 0;
  obstaclesGroup.setVelocityXEach(0);
  coinsGroup.setVelocityXEach(0);
  
  //change the  animation
  tom.changeAnimation("collided",tomImg2);
  spike.changeAnimation("collided", spikeImg2);
  //set lifetime of the game objects so that they are never destroyed
  obstaclesGroup.setLifetimeEach(-1);
  coinsGroup.setLifetimeEach(1);
  
  if(mousePressedOver(restart)) {
    reset();
  }
}

  tom.collide(ground);
  drawSprites();
  textSize(30)
  fill("red")
  text("Score: "+ score, windowWidth-300,50);
  text("Coins:- "+ coinpoints, 50,50);
}
function reset()
{
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  spike.visible=false;
  tom.changeAnimation("running" , tomImg);
  spike.changeAnimation("bite" , spikeImg);
  obstaclesGroup.destroyEach();
  coinsGroup.destroyEach();
  score = 0;
  coinpoints=0;
  jerry.visible=false
  spike.visible=true;
  spike.y= 450
  spike.x=70;
  tom.x=300
  tom.y=550

}
function spawnCoins() {
  //write code here to spawn the clouds
  //var k =Math.round(random(80,110))
  if (frameCount % 80 === 0) {
    var coin = createSprite(1000,120,40,10);
    coin.y = Math.round(random(300,400));
    coin.addImage(coinImg);
    coin.scale = 0.5;
    coin.velocityX = -10;
    
     //assign lifetime to the variable
     coin.lifetime = 200;
    
    //adjust the depth
    coin.depth = tom.depth;
   
    
    //add each cloud to the group
    coinsGroup.add(coin);
  }
  
}

function spawnObstacles() {
  if(frameCount % 100 === 0) {
    var obstacle = createSprite(1000,windowHeight-230,10,40);
    //obstacle.debug = true;
    obstacle.velocityX = -(10+score/100)
    obstacle.setCollider("rectangle",0,0,100,300);
    
    //generate random obstacles
    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: obstacle.addImage(o1);
              break;
      case 2: obstacle.addImage(o2);
              break;
      case 3: obstacle.addImage(o3);
              break;

      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.3
    obstacle.lifetime = 70;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}