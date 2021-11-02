import * as THREE     from "/build/three.module.js"
import { GLTFLoader } from '/build/GLTFLoader.js';

console.log("script")
const scene  = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
      camera.position.z = 6;
      camera.position.y = 1;
      camera.rotation.x = (-10*Math.PI)/180

const renderer = new THREE.WebGLRenderer();
      renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const Global = {
	speed : 0.25,
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
		}
		this.mesh = new THREE.Mesh( this.geometry , this.material );
		this.mesh.name = ("ground_plane_"+Math.random()).slice(2,)
		this.mesh.rotation.x = (-90*Math.PI)/180 
		this.mesh.position.x = x
		this.mesh.position.z = z
		scene.add(this.mesh)
	       }


const Ground = {
		data: [ [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [] ],
		build: function() {
			for (let j = 0; j <= 18; j++){
				for (let i = 0; i <= 20 ; i++){
					if(i >= 7 && i <= 13 || j % 2 == 0) {
						Ground.data[j].push({
							type: "red",
							obj :  new Plane("brown",Ground.convert_x(i),Ground.convert_z(j))
							})
					} else {
						Ground.data[j].push({
							type: "green",
							obj :  new Plane("green",Ground.convert_x(i),Ground.convert_z(j))
							})
					}
				}
			}
		},
		move: {
			status : false,
			run : function() {
				Ground.move.status = true
				let timer = setInterval( function() {
					if(Ground.move.status == false){
						clearInterval(timer)
					} else {
						Ground.data.forEach( line=>{
							line.forEach(  el=>{
								el.obj.mesh.position.z += Global.speed;
							})
						})
						if (Ground.data[0][0].obj.mesh.position.z > 5){
							Ground.shift()
							Ground.push()
						}
					}
				},10)
			}
		},
		shift: function() {
			//for test:
				Ground.data[0].forEach(el=>{
					scene.remove(el.obj.mesh)
					delete el.obj
					el = undefined
				})
				Ground.data.shift()
			//
		},
		push:  function() {
			//for test:
				Ground.data.push([])
					let delta = Track.count()
					let delta_time = Math.random()*30
					Track.time += (delta_time*Math.PI)/180
					Track.pos = Math.sin(Track.time)*1.5 + delta
				
				for (let i = 0; i <= 20 ; i++){
					if(i >= (Track.pos + 10)-3 && i <= (Track.pos + 10)+3 ) {
						Ground.data[18][i] = {
							type: "way",
							obj :  new Plane("brown",Ground.convert_x(i),Ground.convert_z(18))
							}
					} else {
						Ground.data[18][i] = {
							type: "way",
							obj :  new Plane("green",Ground.convert_x(i),Ground.convert_z(18))
							}
					}
				}
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
    Sky_mesh.scale.set(100,100,)
scene.add(Sky_mesh)	
//


//for test:
let Out_geometry = new THREE.PlaneGeometry()
let Out_material = new THREE.MeshBasicMaterial( { color: 0xffff00 } )
let Out_mesh     = undefined
    Out_mesh = new THREE.Mesh( Out_geometry , Out_material )
    Out_mesh.name = "out"
    Out_mesh.scale.set(100,100,)
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
		if(Car_mesh.position.x > 0) Car_mesh.position.x -= 0.025
		if(Car_mesh.position.x < 0) Car_mesh.position.x += 0.025
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
