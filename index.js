import * as THREE     from "/build/three.module.js"
import { GLTFLoader } from '/build/GLTFLoader.js';

console.log("script")
const scene  = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
      camera.position.z = 6;
      camera.position.y = 1;
      camera.rotation.x = (-10*Math.PI)/180

let canvas = document.getElementById("canvas")
let context = canvas.getContext("webgl")

const renderer = new THREE.WebGLRenderer( { canvas: canvas } );
      renderer.setSize( window.innerWidth/3, window.innerHeight/3 );
      
//constructors
const Plane  = function(color,x,z,w,h,v) {
		this.geometry = new THREE.PlaneGeometry();
		switch( color )  {
			case "brown" : {
				this.material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
			}break; 
			case "green" : {
				this.material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
			}break; 
			case "black" : {
				this.material = new THREE.MeshBasicMaterial( { color: 0x000000 } );
			}break; 
		}
		this.obj = new THREE.Mesh( this.geometry , this.material );
		this.obj.name = "ground_plane_"+(""+Math.random()).slice(2,)
		this.obj.position.x = x
		this.obj.position.z = z
		if(v)this.obj.rotation.x = (-90*Math.PI)/180 
		if(w)this.obj.scale.x = w
		if(h)this.obj.scale.y = h
		if(color == "green") this.obj.scale.set(1,1,)
		else  this.obj.scale.set(2,2,)
		scene.add(this.obj)
	       }


//preload
var brown = new Plane("brown",0,6,1,1,true)
var green = new Plane("green",0,6,1,1,true)
var black = new Plane("black",0,6,1,1,true)


//structure
const Movie        = {}
const Menu         = {}
const Select_car   = {}
const Select_level = {}
const Game         = {}
    /*Game
	  global.
		status.
		car.
	  local.
		track.
			count()
		ground.
			data[]
			build()
			move.
				status
				direction
				run()
				shift()
				push()
				convert_x()
				conver_z()
		sky
		   obj
		   items[]
		   build()
		out
		   obj
		   items[]
		   build()
    */

      //g
      Game.global = {
		status : true
      }
		
         Game.global.car = {
		geometry : new THREE.BoxGeometry(),
		material : new THREE.MeshBasicMaterial( { color: 0xffffff } )
	 } 
	    Game.global.car.build = function() {
			Game.global.car.obj = new THREE.Mesh( Game.global.car.geometry , Game.global.car.material )	
			Game.global.car.obj.name = "car"
			Game.global.car.obj.position.z = 4
			Game.global.car.obj.scale.set(1,1,2)
			scene.add(Game.global.car.obj)
	    }
      //l
      Game.local  = {
		speed : 1
      }
         Game.local.track   = {
		   time : 0,
		   pos  : 0
         }
         Game.local.track.count = function() {
		let delta 
		let r1 = Math.random()*2
		let r2 = Math.floor(Math.random())*2
		if (r2 == 0) {
		      r2 = -1
		}else r2 =  1
		    delta = r1 * r2
		return delta
         }
	 //gr
	 Game.local.ground = {
         	data: [ [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [] ]
	 }
		Game.local.ground.build = function() {
			for (let j = 0; j <= 18; j++){
				for (let i = 0; i <= 18 ; i++){
					if(i >= 8 && i <= 12 || j % 2 == 0) {
						let temp = {
							type: "red",
							obj :  brown.obj.clone()
						}
						Game.local.ground.data[j].push(temp)
						temp.obj.position.x = Game.local.ground.move.convert_x(i)
						temp.obj.position.z = Game.local.ground.move.convert_z(j)
						scene.add(temp.obj)
					} else {
						let temp = {
							type: "green",
							obj :  green.obj.clone()
						}
						Game.local.ground.data[j].push(temp)
						temp.obj.position.x = Game.local.ground.move.convert_x(i)
						temp.obj.position.z = Game.local.ground.move.convert_z(j)
						scene.add(temp.obj)
					}
				}
			}
		}
		Game.local.ground.move = {
			status : false,
			direction : "straight",
			run : function() {
				Game.local.ground.move.status = true
				for (let i = 1; i < 7; i ++) {
					let time = Math.random()*5000 + 5000
					let seed = Math.floor(Math.random()*2)
					let dir
					switch (seed) {
						case 0 : dir = "left" ; break;
						case 1 : dir = "right"; break;
					}
					setTimeout( ()=>{Game.local.ground.move.direction = dir} , time * i  ) 
				}
				let timer = setInterval( function() {
					if(Game.local.ground.move.status == false){
						clearInterval(timer)
					} else {
						Game.local.ground.data.forEach( line=>{
							line.forEach(  el=>{
								el.obj.position.z += Game.local.speed;
							})
						})
						if (Game.local.ground.data[0][0].obj.position.z > 5){
							switch (Game.local.ground.move.direction) {
								case "straight" : {
									if ( camera.rotation.y < 0) {
										camera.rotation.y += 0.005
									}else if(camera.rotation.y >= 0) {
										camera.rotation.y -= 0.005
									}
									Game.local.ground.move.push("straight")
									Game.local.ground.move.shift()
								}break;	
								case "left" : {
									if ( camera.rotation.y < -0.25) {
										camera.rotation.y += 0.025
									}else if(camera.rotation.y > -0.25) {
										camera.rotation.y -= 0.025
									}
									Game.local.ground.move.push("left")
									Game.local.ground.move.shift()
								}break;	
								case "right" : {
									if ( camera.rotation.y < 0.25) {
										camera.rotation.y += 0.025
									}else if(camera.rotation.y > 0.25) {
										camera.rotation.y -= 0.025
									}
									Game.local.ground.move.push("right")
									Game.local.ground.move.shift()
								}break;
							}
						}
					}
				},100)
			},
			shift: function() {
			//for test:
				let temp = Game.local.ground.data[0]  
				temp.forEach(el=>{
					scene.remove(el.obj)
					el.obj = null
					delete el.obj
					el.type = null
					delete el.type
					el = null
				})
				for (let i = 0; i < temp.length; i++){
					delete temp[i]
				}
				Game.local.ground.data[0] = null
				Game.local.ground.data.shift()
			//
			},
			push:  function(direction) {
			//for test:
				Game.local.ground.data[18] = []
					let delta = Game.local.track.count()
					let delta_time = Math.random()*30
					Game.local.track.time += (delta_time*Math.PI)/180
					Game.local.track.time = Game.local.track.time % 4
					Game.local.track.pos = Math.sin(Game.local.track.time)*2 + delta
				if(direction == "left")  {
					Game.local.track.pos < 5  ? Game.local.track.pos = 4  : false
					setTimeout( () => {Game.local.ground.move.direction = "straight"} , 3000 )
			        }  
				if(direction == "right")  {
					Game.local.track.pos > -5  ? Game.local.track.pos = -4  : false
					setTimeout( () => {Game.local.ground.move.direction = "straight"} , 3000 )
			        }  
				let temp = []
				for (let i = 0; i <= 18 ; i++){
					if(i >= (Game.local.track.pos + 10)-3 && i <= (Game.local.track.pos + 10)+3 ) {
						temp[i] = {
							type: "way",
							obj :  brown.obj.clone()
							}
						temp[i].obj.position.x = Game.local.ground.move.convert_x(i)
						temp[i].obj.position.z = Game.local.ground.move.convert_z(18)
						scene.add(temp[i].obj)
					} else {
						temp[i] = {
							type: "green",
							obj :  green.obj.clone()
							}
						temp[i].obj.position.x = Game.local.ground.move.convert_x(i)
						temp[i].obj.position.z = Game.local.ground.move.convert_z(18)
						scene.add(temp[i].obj)
					}
				}
				//
				let seed_a = Math.floor(Math.random()*30)
				if  (seed_a == 0) {
					let seed_a_dir = Math.floor(Math.random()*2)
					switch (seed_a_dir) {
						case 0 : {					
							temp[9].obj.material = temp[8].obj.material = temp[7].obj.material = temp[6].obj.material = temp[5].obj.material = black.obj.material
							temp[9].type =	temp[8].type =	temp[7].type =	temp[6].type = temp[5].type = "black"
						}break;
						case 1 : {
							temp[10].obj.material =	temp[11].obj.material = temp[12].obj.material = temp[13].obj.material = temp[14].obj.material = black.obj.material
							temp[10].type = temp[11].type =	temp[12].type =	temp[13].type =	temp[14].type = "black"
						}break;
					} 
				}
				let seed_b = Math.floor(Math.random()*20)
				if  (seed_b == 0) {
					let seed_a_dir = Math.floor(Math.random()*2)
					switch (seed_a_dir) {
						case 0 : {					
							let seed_a_place = Math.floor(Math.random()*8)+4
							temp[0+seed_a_place].obj.material = black.obj.material
							temp[1+seed_a_place].obj.material = black.obj.material
							temp[0+seed_a_place].type =	temp[1+seed_a_place].type = "black"
						}break;
						case 1 : {						
							let seed_a_place = Math.floor(Math.random()*8)+4
							temp[18-seed_a_place].obj.material = black.obj.material
							temp[17-seed_a_place].obj.material = black.obj.material
							temp[18-seed_a_place].type =	temp[17-seed_a_place].type = "black"
						}break;
					} 
				}
				let seed_c = Math.floor(Math.random()*10)
				if  (seed_c == 0) {
					let seed_a_dir = Math.floor(Math.random()*2)
					switch (seed_a_dir) {
						case 0 : {					
							let seed_a_place = Math.floor(Math.random()*8)+8
							temp[0+seed_a_place].obj.material = black.obj.material
							temp[0+seed_a_place].type = "black"
						}break;
						case 1 : {						
							let seed_a_place = Math.floor(Math.random()*8)+8
							temp[18-seed_a_place].obj.material = black.obj.material
							temp[18-seed_a_place].type = "black"
						}break;
					} 
				}
			
				Game.local.ground.data[18] = temp;
			//
			},
			convert_x: function(x) {
				return x -10
			},
			convert_z: function(z) {
				return (z -5)*(-1)
			}
        }
	//sk
	Game.local.sky = {
		geometry : new THREE.PlaneGeometry(),
		material : new THREE.MeshBasicMaterial( { color: 0x0000ff } )
	}
		Game.local.sky.build = function() {
			Game.local.sky.obj = new THREE.Mesh( Game.local.sky.geometry , Game.local.sky.material )	
			Game.local.sky.obj.name = "sky"
			Game.local.sky.obj.position.z = -16
			Game.local.sky.obj.scale.set(150,150,)
			scene.add(Game.local.sky.obj)
		}
	//ou
	Game.local.out = {
		geometry : new THREE.PlaneGeometry(),
		material : new THREE.MeshBasicMaterial( { color: 0xffff00 } )
	}
		Game.local.out.build = function() {
			Game.local.out.obj = new THREE.Mesh( Game.local.out.geometry , Game.local.out.material )	
			Game.local.out.obj.name = "out"
			Game.local.out.obj.position.y = -0.1
			Game.local.out.obj.scale.set(150,150,)
    			Game.local.out.obj.rotation.x = (-90*Math.PI)/180 
			scene.add(Game.local.out.obj)
		}



//load
Game.local.sky.build()
Game.local.out.build()
Game.local.ground.build()
Game.local.ground.move.run()
Game.global.car.build()
//show
const animate = function () {

	requestAnimationFrame( animate );

	//cube.rotation.x += 0.01;
	//cube.rotation.y += 0.01;

	renderer.render( scene, camera );
};

animate();

//control

document.addEventListener("keydown", function(event){
	//console.log(event.code)
	switch(event.code){
		case "ArrowRight" : {
			Game.global.car.obj.rotation.y = (15*Math.PI)/180
			Game.global.car.obj.position.x += 0.25
		}break;
		case "ArrowLeft" : {
			Game.global.car.obj.rotation.y = (-15*Math.PI)/180
			Game.global.car.obj.position.x += -0.25
		}break;
		case "ArrowUp" : {
			Game.local.speed += 0.025
			Game.global.car.obj.position.z -= 0.1
			if(Game.global.car.obj.position.z < 3.0) {
				Game.global.car.obj.position.z += 0.1
				Game.local.speed -= 0.025
			}
		}break;		
		case "ArrowDown" : {
			Game.local.speed -= 0.025
			Game.global.car.obj.position.z += 0.1
			if(Game.global.car.obj.position.z > 4.0) {
				Game.global.car.obj.position.z -= 0.1
				Game.local.speed += 0.025
			}
		}break;
	}
})
document.addEventListener("keyup", function(event){
	//console.log(event.code)
	switch(event.code){
		case "ArrowRight" : {
			Game.global.car.obj.rotation.y = 0
		}break;
		case "ArrowLeft" : {
			Game.global.car.obj.rotation.y = 0
		}break;
	}
})
let check = setInterval( function () {
	if (Game.global.status == true) {
		if(Game.global.car.obj.position.x > 0) Game.global.car.obj.position.x -= 0.005
		if(Game.global.car.obj.position.x < 0) Game.global.car.obj.position.x += 0.005
	}
})
//


//system
