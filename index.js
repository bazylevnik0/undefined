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
      
//document.body.appendChild( canvas );

const Menu         = {}
const Select_car   = {}
const Select_level = {}
const Game         = {}

//game
const Global = {
	speed : 1,
	game_status : true
}

const Track = {
	time : 0,
	pos  : 0
}
      Track.count = function() {
		let delta 
		let r1 = Math.random()*2
		let r2 = Math.floor(Math.random())*2
		if (r2 == 0) {
		      r2 = -1
		}else r2 =  1
		    delta = r1 * r2
		return delta
       }

const Plane  = function(color,x,z) {
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
		this.mesh = new THREE.Mesh( this.geometry , this.material );
		this.mesh.name = "ground_plane_"+(""+Math.random()).slice(2,)
		this.mesh.rotation.x = (-90*Math.PI)/180 
		this.mesh.position.x = x
		this.mesh.position.z = z
		if(color == "green") this.mesh.scale.set(1,1,)
		else  this.mesh.scale.set(2,2,)
		scene.add(this.mesh)
	       }

var brown = new Plane("brown",0,6)
var green = new Plane("green",0,6)
var black = new Plane("black",0,6)


const Ground = {
		data: [ [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [] ],
		build: function() {
			for (let j = 0; j <= 18; j++){
				for (let i = 0; i <= 18 ; i++){
					if(i >= 8 && i <= 12 || j % 2 == 0) {
						let temp = {
							type: "red",
							obj :  brown.mesh.clone()
						}
						Ground.data[j].push(temp)
						temp.obj.position.x = Ground.convert_x(i)
						temp.obj.position.z = Ground.convert_z(j)
						scene.add(temp.obj)
					} else {
						let temp = {
							type: "green",
							obj :  green.mesh.clone()
						}
						Ground.data[j].push(temp)
						temp.obj.position.x = Ground.convert_x(i)
						temp.obj.position.z = Ground.convert_z(j)
						scene.add(temp.obj)
					}
				}
			}
		},
		move: {
			status : false,
			direction : "straight",
			run : function() {
				Ground.move.status = true
				for (let i = 1; i < 7; i ++) {
					let time = Math.random()*5000 + 5000
					let seed = Math.floor(Math.random()*2)
					let dir
					switch (seed) {
						case 0 : dir = "left" ; break;
						case 1 : dir = "right"; break;
					}
					setTimeout( ()=>{Ground.move.direction = dir} , time * i  ) 
				}
				let timer = setInterval( function() {
					if(Ground.move.status == false){
						clearInterval(timer)
					} else {
						Ground.data.forEach( line=>{
							line.forEach(  el=>{
								el.obj.position.z += Global.speed;
							})
						})
						if (Ground.data[0][0].obj.position.z > 5){
							switch (Ground.move.direction) {
								case "straight" : {
									if ( camera.rotation.y < 0) {
										camera.rotation.y += 0.005
									}else if(camera.rotation.y >= 0) {
										camera.rotation.y -= 0.005
									}
									Ground.push("straight")
									Ground.shift()
								}break;	
								case "left" : {
									if ( camera.rotation.y < -0.25) {
										camera.rotation.y += 0.025
									}else if(camera.rotation.y > -0.25) {
										camera.rotation.y -= 0.025
									}
									Ground.push("left")
									Ground.shift()
								}break;	
								case "right" : {
									if ( camera.rotation.y < 0.25) {
										camera.rotation.y += 0.025
									}else if(camera.rotation.y > 0.25) {
										camera.rotation.y -= 0.025
									}
									Ground.push("right")
									Ground.shift()
								}break;
							}
						}
					}
				},100)
			}
		},
		shift: function() {
			//for test:
				let temp = Ground.data[0]  
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
				Ground.data[0] = null
				Ground.data.shift()
			//
		},
		push:  function(direction) {
			//for test:
				Ground.data[18] = []
					let delta = Track.count()
					let delta_time = Math.random()*30
					Track.time += (delta_time*Math.PI)/180
					Track.time = Track.time % 4
					Track.pos = Math.sin(Track.time)*2 + delta
				if(direction == "left")  {
					Track.pos < 5  ? Track.pos = 4  : false
					setTimeout( () => {Ground.move.direction = "straight"} , 3000 )
			        }  
				if(direction == "right")  {
					Track.pos > -5  ? Track.pos = -4  : false
					setTimeout( () => {Ground.move.direction = "straight"} , 3000 )
			        }  
				let temp = []
				for (let i = 0; i <= 18 ; i++){
					if(i >= (Track.pos + 10)-3 && i <= (Track.pos + 10)+3 ) {
						temp[i] = {
							type: "way",
							obj :  brown.mesh.clone()
							}
						temp[i].obj.position.x = Ground.convert_x(i)
						temp[i].obj.position.z = Ground.convert_z(18)
						scene.add(temp[i].obj)
					} else {
						temp[i] = {
							type: "green",
							obj :  green.mesh.clone()
							}
						temp[i].obj.position.x = Ground.convert_x(i)
						temp[i].obj.position.z = Ground.convert_z(18)
						scene.add(temp[i].obj)
					}
				}
				//
				let seed_a = Math.floor(Math.random()*30)
				if  (seed_a == 0) {
					let seed_a_dir = Math.floor(Math.random()*2)
					switch (seed_a_dir) {
						case 0 : {					
							temp[9].obj.material = black.mesh.material
							temp[8].obj.material = black.mesh.material
							temp[7].obj.material = black.mesh.material
							temp[6].obj.material = black.mesh.material
							temp[5].obj.material = black.mesh.material
							temp[9].type =	temp[8].type =	temp[7].type =	temp[6].type = temp[5].type = "black"
						}break;
						case 1 : {
							temp[10].obj.material = black.mesh.material
							temp[11].obj.material = black.mesh.material
							temp[12].obj.material = black.mesh.material
							temp[13].obj.material = black.mesh.material
							temp[14].obj.material = black.mesh.material
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
							temp[0+seed_a_place].obj.material = black.mesh.material
							temp[1+seed_a_place].obj.material = black.mesh.material
							temp[0+seed_a_place].type =	temp[1+seed_a_place].type = "black"
						}break;
						case 1 : {						
							let seed_a_place = Math.floor(Math.random()*8)+4
							temp[18-seed_a_place].obj.material = black.mesh.material
							temp[17-seed_a_place].obj.material = black.mesh.material
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
							temp[0+seed_a_place].obj.material = black.mesh.material
							temp[0+seed_a_place].type = "black"
						}break;
						case 1 : {						
							let seed_a_place = Math.floor(Math.random()*8)+8
							temp[18-seed_a_place].obj.material = black.mesh.material
							temp[18-seed_a_place].type = "black"
						}break;
					} 
				}
			
				Ground.data[18] = temp;
			//
		},
		convert_x: function(x) {
			return x -10
		},
		convert_z: function(z) {
			return (z -5)*(-1)
		}
}
Ground.build()
Ground.move.run()
//for test:
let Sky_geometry = new THREE.PlaneGeometry()
let Sky_material = new THREE.MeshBasicMaterial( { color: 0x0000ff } )
let Sky_mesh     = undefined
    Sky_mesh = new THREE.Mesh( Sky_geometry , Sky_material )
    Sky_mesh.name = "Sky"
    Sky_mesh.position.z = -16
    Sky_mesh.scale.set(150,150,)
scene.add(Sky_mesh)	
//


//for test:
let Out_geometry = new THREE.PlaneGeometry()
let Out_material = new THREE.MeshBasicMaterial( { color: 0xffff00 } )
let Out_mesh     = undefined
    Out_mesh = new THREE.Mesh( Out_geometry , Out_material )
    Out_mesh.name = "out"
    Out_mesh.scale.set(150,150,)
    Out_mesh.position.y = -0.1
    Out_mesh.rotation.x = (-90*Math.PI)/180 
scene.add(Out_mesh)	
//

//for test:
let Car_geometry = new THREE.BoxGeometry()
let Car_material = new THREE.MeshBasicMaterial( { color: 0xffffff } )
let Car_mesh     = undefined
    Car_mesh = new THREE.Mesh( Car_geometry , Car_material )
    Car_mesh.name = "Car"
    Car_mesh.position.z = 4
    Car_mesh.scale.set(1,1,2)
scene.add(Car_mesh)	

document.addEventListener("keydown", function(event){
	//console.log(event.code)
	switch(event.code){
		case "ArrowRight" : {
			Car_mesh.rotation.y = (15*Math.PI)/180
			Car_mesh.position.x += 0.25
		}break;
		case "ArrowLeft" : {
			Car_mesh.rotation.y = (-15*Math.PI)/180
			Car_mesh.position.x += -0.25
		}break;
		case "ArrowUp" : {
			Global.speed += 0.025
			Car_mesh.position.z -= 0.1
			if(Car_mesh.position.z < 3.0) {
				Car_mesh.position.z += 0.1
				Global.speed -= 0.025
			}
		}break;		
		case "ArrowDown" : {
			Global.speed -= 0.025
			Car_mesh.position.z += 0.1
			if(Car_mesh.position.z > 4.0) {
				Car_mesh.position.z -= 0.1
				Global.speed += 0.025
			}
		}break;
	}
})
document.addEventListener("keyup", function(event){
	//console.log(event.code)
	switch(event.code){
		case "ArrowRight" : {
			Car_mesh.rotation.y = 0
		}break;
		case "ArrowLeft" : {
			Car_mesh.rotation.y = 0
		}break;
	}
})
let check = setInterval( function () {
	if (Global.game_status == true) {
		if(Car_mesh.position.x > 0) Car_mesh.position.x -= 0.005
		if(Car_mesh.position.x < 0) Car_mesh.position.x += 0.005
	}
})
//



const animate = function () {

	requestAnimationFrame( animate );

	//cube.rotation.x += 0.01;
	//cube.rotation.y += 0.01;

	renderer.render( scene, camera );
};

animate();
