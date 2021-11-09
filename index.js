import * as THREE from "/build/three.module.js" 
import { GLTFLoader } from '/build/GLTFLoader.js';
const loader_green    = new GLTFLoader();
const loader_brown    = new GLTFLoader();
const loader_green_a  = new GLTFLoader();
const loader_green_b  = new GLTFLoader();
const loader_black_a  = new GLTFLoader();
const loader_black_b  = new GLTFLoader();
const loader_black_c  = new GLTFLoader();

const loader_car_red    = new GLTFLoader();
const loader_car_anim_a = new GLTFLoader();
const loader_car_anim_b = new GLTFLoader();
const loader_car_anim_c = new GLTFLoader();
const loader_car_anim_s = new GLTFLoader();
const clock = new THREE.Clock();
		
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
		this.items = []
		if(v)this.obj.rotation.x = (-90*Math.PI)/180 
		if(w)this.obj.scale.x = w
		if(h)this.obj.scale.y = h
		if(color == "green") this.obj.scale.set(1,1,)
		else  this.obj.scale.set(2,2,)
		Game.global.scene.add(this.obj)
	       }

const Box  = function(color,x,y,z,w,h,d) {
		this.geometry = new THREE.BoxGeometry();
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
		this.obj.name = "ground_box_"+(""+Math.random()).slice(2,)
		this.obj.position.x = x
		this.obj.position.y = y
		this.obj.position.z = z
		if(w)this.obj.scale.x = w
		if(h)this.obj.scale.y = h
		if(d)this.obj.scale.z = d
		Game.global.scene.add(this.obj)
	       }

const Obj = function(type,obj,items) {
	this.type = type;
	this.obj  = obj;
	this.items = items;
	this.items.forEach( el=> { Game.global.scene.add(el) })
}


//structure
const Movie        = {
	el : document.getElementById('movie')
}
const Menu         = {
	el : document.getElementById('menu')

}
	Menu.el.addEventListener( "click",function(event) {
	if(event.target.id == "new"){
		Menu.el.style.zIndex = -1
		Select_car.el.style.zIndex = 1;
		}
	})

const Select_car   = {
	el : document.getElementById('select_car')
}

	Select_car.el.addEventListener( "click", function(event) {
	switch (event.target.id){
		case "red" : {
			Game.global.actual.car = "red"
			next()
		}break;
		case "blue" : {
			Game.global.actual.car = "blue"
			next()
		}break;
	}
	function next() {
		Select_car.el.style.zIndex = -1
		Select_map.el.style.zIndex = 1
	}
	})

const Select_map = {
	el :document.getElementById('select_map')
}
	
	Select_map.el.addEventListener( "click", function(event) {
	switch (event.target.id){
		case "nature" : {
			Game.global.actual.map = "nature"
			next()
		}break;
		case "city" : {
			Game.global.actual.map = "city"
			next()
		}break;
		case "cyber" : {
			Game.global.actual.map = "cyber"
			next()
		}break;
	}
	function next() {
		Game.global.actual.film = Game.global.actual.map
		Select_map.el.style.zIndex = -1
		Movie.obj = new Image(); 
		Movie.obj.src = 'image1.png';
		Movie.el.appendChild(Movie.obj)
		Movie.el.style.zIndex = 1
		backLoad()
		let load = setInterval( ()=>{
			if( back_load.green !== undefined ) {
				clearInterval(load)
				Game.load()
			}
		},100)
		setTimeout( ()=> {
			let timer = setInterval( ()=>{
				if( Game.global.status == true) {
					Movie.el.style.zIndex = -1
					canvas.style.zIndex = 1
					Nav.el.style.zIndex = 2;
				}
			},100)
		},1000)
	}
	})

const Nav	   ={
	el :  document.getElementById('nav'),
	score : {
		el : document.getElementById('score')
	},
	speed : {
		el : document.getElementById('speed')
	}
}

const Game         = {}
    /*Game
	  canvas
		el
		ctx
	  renderer
	  animate()

	  global.
		scene
		camera
		light
			ambient
			point
		actual.
			car
			map
			film
		status.
		car.
	  local.
		track.
			count()
		ground.
			model.
				brown
				green
				green_a
				green_b
				black_a
				black_b
				black_c
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
	preload
	load
      */

      //g
      Game.canvas = {}
      Game.canvas.el = document.getElementById("canvas")
      Game.canvas.ctx = Game.canvas.el.getContext("webgl") 
      Game.renderer = new THREE.WebGLRenderer( { canvas: Game.canvas.el } );
      Game.renderer.setSize( window.innerWidth/3, window.innerHeight/3 );
      Game.animate = function () {
	requestAnimationFrame( Game.animate );
	let mixerUpdateDelta = clock.getDelta();
	Game.global.car.animation.mixer !== undefined ? Game.global.car.animation.mixer.update( mixerUpdateDelta ) : false
	Game.global.car.animation.action.a_a.mixer !== undefined ? Game.global.car.animation.action.a_a.mixer.update( mixerUpdateDelta ) : false
	Game.global.car.animation.action.a_b.mixer !== undefined ? Game.global.car.animation.action.a_b.mixer.update( mixerUpdateDelta ) : false
	Game.global.car.animation.action.a_c.mixer !== undefined ? Game.global.car.animation.action.a_c.mixer.update( mixerUpdateDelta ) : false
	Game.global.car.animation.action.a_s.mixer !== undefined ? Game.global.car.animation.action.a_s.mixer.update( mixerUpdateDelta ) : false
	Game.renderer.render( Game.global.scene, Game.global.camera );
      };

      Game.global = {
		canvas : {},
		status : false,
		score  : 0,
		actual :{
			car : undefined,
			map : undefined,
			film : undefined
		}
      }

	 Game.global.scene  = new THREE.Scene();
	 Game.global.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
         Game.global.camera.position.z = 6;
         Game.global.camera.position.y = 1;
         Game.global.camera.rotation.x = (-10*Math.PI)/180
	 Game.global.light = {}
	 Game.global.light.ambient = new THREE.AmbientLight( 0x404040 )
	 Game.global.light.point = new THREE.PointLight( 0xffffff, 1, 100 );
	 Game.global.light.point.position.set( 0, 20, 10 );
	 Game.global.scene.add( Game.global.light.ambient , Game.global.light.point );
		
         Game.global.car = {
		geometry : new THREE.BoxGeometry(),
		material : new THREE.MeshBasicMaterial( { color: 0xffffff } ),
		loaded   : false,
		animation : {
			arr : undefined,
			mixer : undefined,
			actions_loop : undefined,
			action : {
				a_a : {
					obj : undefined,
					run : function() {
						Game.global.car.animation.action.a_a.obj.position.x = Game.global.car.obj.position.x
						Game.global.car.animation.action.a_a.obj.position.z = Game.global.car.obj.position.z
						Game.global.car.animation.action.a_a.actions.forEach( el=> el.reset().play() )
						Game.global.car.animation.actions_loop.forEach( el=>  el.stop())
						let k = 100
						let timer = setInterval( function() {	
							if (k > 0) {
								Game.global.car.obj.rotation.y -= k/50
								k--
							} else clearInterval(timer)
						})
						setTimeout( ()=> Game.global.car.animation.action.a_a.actions.forEach( el=> el.stop()) ,2500)
					
					}
				},
				a_b : {
					obj : undefined,
					run : function() {
						Game.global.car.animation.action.a_b.obj.position.x = Game.global.car.obj.position.x
						Game.global.car.animation.action.a_b.obj.position.z = Game.global.car.obj.position.z
						Game.global.car.animation.action.a_b.actions.forEach( el=> el.play() )
						setTimeout( ()=> Game.global.car.animation.action.a_b.actions.forEach( el=> el.stop()) ,500)
					}
				},
				a_c : {
					obj : undefined,
					run : function() {
						Game.global.car.animation.action.a_c.obj.position.x = Game.global.car.obj.position.x
						Game.global.car.animation.action.a_c.obj.position.z = Game.global.car.obj.position.z
						Game.global.car.animation.action.a_c.actions.forEach( el=> el.play() )
						setTimeout( ()=> Game.global.car.animation.action.a_c.actions.forEach( el=> el.stop()) ,500)
					}
				},
				a_s : {
					obj : undefined,
					anim : function(log) {
						switch (log) {
							case true : {
								Game.global.car.animation.action.a_s.obj.position.x = Game.global.car.obj.position.x
								Game.global.car.animation.action.a_s.obj.position.z = Game.global.car.obj.position.z
								Game.global.car.animation.action.a_s.actions.forEach( el=> el.play() )
							}break;
							case false : {
								Game.global.car.animation.action.a_s.obj.position.z = 10
								Game.global.car.animation.action.a_s.actions.forEach( el=> el.stop())
							}break;
						}
					}
				},
			}
		}
	 } 
	    Game.global.car.build = function() {
			function download(){
			return new Promise ((resolve, reject) => {
					loader_car_red.load( '/src/car_'+Game.global.actual.car+'.glb',  function ( gltf ) {
						let model = gltf.scene;
						model.scale.set(0.5, 0.4, 0.6)
						model.traverse( function ( object ) {
							if ( object.isMesh ) object.castShadow = true;
						} );					


					Game.global.car.obj = model
					Game.global.car.animation.arr = gltf.animations;
					Game.global.car.animation.mixer = new THREE.AnimationMixer( model );
					let timer = setInterval( function() {
						if( Game.global.car.obj !== undefined && Game.global.car.animation.mixer !== undefined) {
							clearInterval(timer)
							
							Game.global.car.animation.actions_loop = []
							
							Game.global.car.animation.actions_loop[0] = Game.global.car.animation.mixer.clipAction( Game.global.car.animation.arr[ 0 ] );
							Game.global.car.animation.actions_loop[1] = Game.global.car.animation.mixer.clipAction( Game.global.car.animation.arr[ 1 ] );
							Game.global.car.animation.actions_loop[2] = Game.global.car.animation.mixer.clipAction( Game.global.car.animation.arr[ 2 ] );
							Game.global.car.animation.actions_loop[3] = Game.global.car.animation.mixer.clipAction( Game.global.car.animation.arr[ 3 ] );
							
							resolve(true)
						}
					},500)
					})
			})
			}
			async function set() {
			await download();
			Game.global.car.obj.name = "car"
			Game.global.car.obj.position.z = 4
			Game.global.car.obj.position.y = 0.15
			Game.global.scene.add(Game.global.car.obj)
			Game.global.car.animation.actions_loop.forEach( el=> el.reset().play() )
 			Game.global.car.loaded = true
			}set()
			//anims
			let temp = ["a","b","c","s"]
			for (let i = 0; i < 4; i++){
				let temp_loader
				let temp_obj
				let temp_length
				switch(temp[i]){
					case "a" : {
						temp_loader = loader_car_anim_a;
						temp_obj = Game.global.car.animation.action.a_a;
						temp_length = 3;
					}break;
					case "b" : {
						console.log("b")
						temp_loader = loader_car_anim_b;
						temp_obj = Game.global.car.animation.action.a_b;
						temp_length = 2;
					}break;
					case "c" : {
						console.log("c")
						temp_loader = loader_car_anim_c;
						temp_obj = Game.global.car.animation.action.a_c;
						temp_length = 1;
					}break;
					case "s" : {
						console.log("s")
						temp_loader = loader_car_anim_s;
						temp_obj = Game.global.car.animation.action.a_s;
						temp_length = 2;
					}break;
				}
				temp_loader.load( '/src/anim_' + temp[i] +'.glb',  function ( gltf ) {
					let model = gltf.scene;
					model.scale.set(0.5, 0.4, 0.6)
					model.traverse( function ( object ) {
						if ( object.isMesh ) object.castShadow = true;
					} );
			
					temp_obj.obj = model
					let timer = setInterval( function() {
						if( temp_obj.obj !== undefined ) {
						clearInterval(timer)
						temp_obj.arr = gltf.animations;
						temp_obj.mixer = new THREE.AnimationMixer( model );
						temp_obj.actions = []
						for (let j = 0; j < temp_length; j++) {
							temp_obj.actions[j] = temp_obj.mixer.clipAction( temp_obj.arr[ j ] );
						}
						temp_obj.actions.forEach( el=> {
							//el.loop = THREE.LoopOnce
							el.clampWhenFinished   = true
							//el.reset().play()
						})
					
						Game.global.scene.add( temp_obj.obj )
						}
					})
				})
			}
	    }
      //l
      Game.local  = {
		speed : 0,
		limit : 2,
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
         	data: [ [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [] ],
		model : {
			brown : {},
			green : {},
			green_a : {},
			green_b : {},
			black_a : {},
			black_b : {},
			black_c : {}
		}
	 }
		Game.local.ground.build = function() {
			for (let j = 0; j <= 18; j++){
				for (let i = 0; i <= 18 ; i++){
					if(i >= 8 && i <= 12 || j % 2 == 0) {
						let temp = new Obj("way", Game.local.ground.model.brown.obj.clone(),[])
						Game.local.ground.data[j].push(temp)
						temp.obj.position.x = Game.local.ground.move.convert_x(i)
						temp.obj.position.z = Game.local.ground.move.convert_z(j)
						Game.global.scene.add(temp.obj)
					} else {
						let temp = new Obj("green", Game.local.ground.model.green.obj.clone(),[back_load.green.clone()])
						Game.local.ground.data[j].push(temp)
						temp.obj.position.x = Game.local.ground.move.convert_x(i)
						temp.obj.position.z = Game.local.ground.move.convert_z(j)
						temp.items[0].position.x = temp.obj.position.x 
						temp.items[0].position.z = temp.obj.position.z
						temp.items[0].position.y = 0.05
						Game.global.scene.add(temp.obj,temp.items[0])
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
								el.items.forEach( item=>{
									item.position.z += Game.local.speed;							
								})
							})
						})
						if (Game.local.ground.data[0][0].obj.position.z > 5){
							switch (Game.local.ground.move.direction) {
								case "straight" : {
									if ( Game.global.camera.rotation.y < 0) {
										Game.global.camera.rotation.y += 0.005
									}else if(Game.global.camera.rotation.y >= 0) {
										Game.global.camera.rotation.y -= 0.005
									}
									Game.local.ground.move.push("straight")
									Game.local.ground.move.shift()
									Game.local.ground.model.green_a.material.opacity < 1 ? Game.local.ground.model.green_a.material.opacity += 0.05 : false
									Game.local.ground.model.green_a.material.opacity < 1 ? Game.local.ground.model.green_b.material.opacity += 0.05 : false
								}break;	
								case "left" : {
									if ( Game.global.camera.rotation.y < -0.25) {
										Game.global.camera.rotation.y += 0.025
									}else if(Game.global.camera.rotation.y > -0.25) {
										Game.global.camera.rotation.y -= 0.025
									}
									Game.local.ground.move.push("left")
									Game.local.ground.move.shift()
									Game.local.ground.model.green_a.material.opacity > 0.4 ? Game.local.ground.model.green_a.material.opacity -= 0.1 : false
									Game.local.ground.model.green_a.material.opacity > 0.4 ? Game.local.ground.model.green_b.material.opacity -= 0.1 : false
								}break;	
								case "right" : {
									if ( Game.global.camera.rotation.y < 0.25) {
										Game.global.camera.rotation.y += 0.025
									}else if(Game.global.camera.rotation.y > 0.25) {
										Game.global.camera.rotation.y -= 0.025
									}
									Game.local.ground.move.push("right")
									Game.local.ground.move.shift()							
									Game.local.ground.model.green_a.material.opacity > 0.4 ? Game.local.ground.model.green_a.material.opacity -= 0.1 : false
									Game.local.ground.model.green_a.material.opacity > 0.4 ? Game.local.ground.model.green_b.material.opacity -= 0.1 : false
								}break;
							}
						}
					}
					Game.global.score++
					Game.local.speed <  Game.local.limit ? Game.local.speed += 0.025 : false
				},100)
			},
			shift: function() {
				let temp = Game.local.ground.data[0]  
				temp.forEach(el=>{
					Game.global.scene.remove(el.obj)
					el.obj = null
					delete el.obj
					el.type = null
					delete el.type
					el.items.forEach(item=>{
						Game.global.scene.remove(item)
						item = null
					})
					for(let i = 0; i < el.items.length; i++){
						delete el.items[i]
					}
					el.items = null
					delete el.items
					el = null
				})
				for (let i = 0; i < temp.length; i++){
					delete temp[i]
				}
				Game.local.ground.data[0] = null
				Game.local.ground.data.shift()
			},
			push:  function(direction) {
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
						temp[i] = new Obj("way", Game.local.ground.model.brown.obj.clone(), [])
						temp[i].obj.position.x = Game.local.ground.move.convert_x(i)
						temp[i].obj.position.z = Game.local.ground.move.convert_z(18)
						Game.global.scene.add(temp[i].obj)
					} else {
						temp[i] = new Obj("green", Game.local.ground.model.green.obj.clone(), [back_load.green.clone()])
						temp[i].obj.position.x = Game.local.ground.move.convert_x(i)
						temp[i].obj.position.z = Game.local.ground.move.convert_z(18)
						temp[i].items[0].position.x = temp[i].obj.position.x 
						temp[i].items[0].position.z = temp[i].obj.position.z
						temp[i].items[0].position.y = 0.05
						Game.global.scene.add(temp[i].obj,temp[i].items[0])
					}
				}
				//add black a				
				let seed_a = Math.floor(Math.random()*50)
				if(Game.local.ground.move.direction !== "straight") seed_a = 1
				if  (seed_a == 0) {
					let seed_a_dir = Math.floor(Math.random()*15)
					switch (seed_a_dir) {
						case 0 : {					
							temp[9].obj.material = temp[8].obj.material = temp[7].obj.material = temp[6].obj.material = temp[5].obj.material = temp[4].obj.material = Game.local.ground.model.black.obj.material
							temp[9].type =	temp[8].type =	temp[7].type =	temp[6].type = temp[5].type = temp[4].type = "black_a"
							temp[9].items.unshift( Game.local.ground.model.black_a.obj.clone() )
							temp[8].items.unshift( Game.local.ground.model.black_a.obj.clone() )
							temp[7].items.unshift( Game.local.ground.model.black_a.obj.clone() )
							temp[6].items.unshift( Game.local.ground.model.black_a.obj.clone() )
							temp[5].items.unshift( Game.local.ground.model.black_a.obj.clone() )
							temp[4].items.unshift( Game.local.ground.model.black_a.obj.clone() )
							temp[9].items[0].position.x = Game.local.ground.move.convert_x(9)
							temp[8].items[0].position.x = Game.local.ground.move.convert_x(8)
							temp[7].items[0].position.x = Game.local.ground.move.convert_x(7)
							temp[6].items[0].position.x = Game.local.ground.move.convert_x(6)
							temp[5].items[0].position.x = Game.local.ground.move.convert_x(5)
							temp[4].items[0].position.x = Game.local.ground.move.convert_x(4)
							temp[9].items[0].position.z = temp[8].items[0].position.z = temp[7].items[0].position.z = temp[6].items[0].position.z = temp[5].items[0].position.z = temp[4].items[0].position.z =  Game.local.ground.move.convert_z(18)
							Game.global.scene.add(temp[9].items[0],
								  temp[8].items[0],
								  temp[7].items[0],
								  temp[6].items[0],
								  temp[5].items[0],
								  temp[4].items[0])
						}break;
						case 1 : {
							temp[10].obj.material = temp[11].obj.material = temp[12].obj.material = temp[13].obj.material = temp[14].obj.material = temp[15].obj.material = Game.local.ground.model.black.obj.material
							temp[10].type =	temp[11].type =	temp[12].type =	temp[13].type = temp[14].type = temp[15].type = "black_a"
							temp[10].items.unshift( Game.local.ground.model.black_a.obj.clone() )
							temp[11].items.unshift( Game.local.ground.model.black_a.obj.clone() )
							temp[12].items.unshift( Game.local.ground.model.black_a.obj.clone() )
							temp[13].items.unshift( Game.local.ground.model.black_a.obj.clone() )
							temp[14].items.unshift( Game.local.ground.model.black_a.obj.clone() )
							temp[15].items.unshift( Game.local.ground.model.black_a.obj.clone() )
							temp[10].items[0].position.x = Game.local.ground.move.convert_x(10)
							temp[11].items[0].position.x = Game.local.ground.move.convert_x(11)
							temp[12].items[0].position.x = Game.local.ground.move.convert_x(12)
							temp[13].items[0].position.x = Game.local.ground.move.convert_x(13)
							temp[14].items[0].position.x = Game.local.ground.move.convert_x(14)
							temp[15].items[0].position.x = Game.local.ground.move.convert_x(15)
							temp[10].items[0].position.z = temp[11].items[0].position.z = temp[12].items[0].position.z = temp[13].items[0].position.z = temp[14].items[0].position.z = temp[15].items[0].position.z =  Game.local.ground.move.convert_z(18)
							Game.global.scene.add(temp[10].items[0],
								  temp[11].items[0],
								  temp[12].items[0],
								  temp[13].items[0],
								  temp[14].items[0],
								  temp[15].items[0])
						}break;
					} 
				}
				//add black b
				let seed_b = Math.floor(Math.random()*25)
				if(Game.local.ground.move.direction !== "straight") seed_b = 1
				if  (seed_b == 0) {
					let seed_b_dir = Math.floor(Math.random()*2)
					switch (seed_b_dir) {
						case 0 : {					
							let seed_b_place = Math.floor(Math.random()*8)+4
							temp[0+seed_b_place].obj.material = Game.local.ground.model.black.obj.material
							temp[1+seed_b_place].obj.material = Game.local.ground.model.black.obj.material			
							temp[0+seed_b_place].type =	temp[1+seed_b_place].type = "black_b"
							temp[0+seed_b_place].items.unshift( Game.local.ground.model.black_b.obj.clone() )
							temp[1+seed_b_place].items.unshift( Game.local.ground.model.black_b.obj.clone() )
							temp[0+seed_b_place].items[0].position.x = Game.local.ground.move.convert_x(0+seed_b_place)
							temp[1+seed_b_place].items[0].position.x = Game.local.ground.move.convert_x(1+seed_b_place)
							temp[0+seed_b_place].items[0].position.z = temp[1+seed_b_place].items[0].position.z = Game.local.ground.move.convert_z(18)
							Game.global.scene.add(temp[0+seed_b_place].items[0],
								  temp[1+seed_b_place].items[0])
						}break;
						case 1 : {						
							let seed_b_place = Math.floor(Math.random()*8)+4
							temp[18-seed_b_place].obj.material = Game.local.ground.model.black.obj.material
							temp[17-seed_b_place].obj.material = Game.local.ground.model.black.obj.material
							temp[18-seed_b_place].type =	temp[17-seed_b_place].type = "black_b"
							temp[18-seed_b_place].items.unshift( Game.local.ground.model.black_b.obj.clone() )
							temp[17-seed_b_place].items.unshift( Game.local.ground.model.black_b.obj.clone() )
							temp[18-seed_b_place].items[0].position.x = Game.local.ground.move.convert_x(18-seed_b_place)
							temp[17-seed_b_place].items[0].position.x = Game.local.ground.move.convert_x(17-seed_b_place)
							temp[18-seed_b_place].items[0].position.z = temp[17-seed_b_place].items[0].position.z = Game.local.ground.move.convert_z(18)
							Game.global.scene.add(temp[18-seed_b_place].items[0],
								  temp[17-seed_b_place].items[0])
					
						}break;
					} 
				}
				//add black c
				let seed_c = Math.floor(Math.random()*10)
				if(Game.local.ground.move.direction !== "straight") seed_c = 1
				if  (seed_c == 0) {
					let seed_c_dir = Math.floor(Math.random()*2)
					switch (seed_c_dir) {
						case 0 : {					
							let seed_c_place = Math.floor(Math.random()*8)+8
							temp[0+seed_c_place].obj.material = Game.local.ground.model.black.obj.material
							temp[0+seed_c_place].type = "black_c"
							temp[0+seed_c_place].items.unshift( Game.local.ground.model.black_c.obj.clone() )
							temp[0+seed_c_place].items[0].position.x = Game.local.ground.move.convert_x(0+seed_c_place)
							temp[0+seed_c_place].items[0].position.z = Game.local.ground.move.convert_z(18)
							Game.global.scene.add(temp[0+seed_c_place].items[0])
						}break;
						case 1 : {						
							let seed_c_place = Math.floor(Math.random()*8)+8
							temp[18-seed_c_place].obj.material = Game.local.ground.model.black.obj.material
							temp[18-seed_c_place].type = "black_c"
							temp[18-seed_c_place].items.unshift( Game.local.ground.model.black_c.obj.clone() )			
							temp[18-seed_c_place].items[0].position.x = Game.local.ground.move.convert_x(18-seed_c_place)
							temp[18-seed_c_place].items[0].position.z = Game.local.ground.move.convert_z(18)
							Game.global.scene.add(temp[18-seed_c_place].items[0])					
						}break;
					} 
				}
				
				//add green 3d
				let k; if(Game.local.ground.move.direction!=="straight") k = 0.5
				       else k = 3
				temp.forEach( el=> {
					if(el.type == "green") {
						let rand = Math.floor(Math.random()*k*10*3)
						if (rand == 0){
							el.items.unshift( Game.local.ground.model.green_a.obj.clone() )
							el.items[0].position.x = el.obj.position.x * 2
							el.items[0].position.z = Game.local.ground.move.convert_z(18)
							Game.global.scene.add(el.items[0])
						}
					}
				})
				temp.forEach( el=> {
					if(el.type == "green"){
						let rand = Math.floor(Math.random()*k*10)
						if (rand == 0){
							el.items.unshift( Game.local.ground.model.green_b.obj.clone() )
							el.items[0].position.x = el.obj.position.x * 2
							el.items[0].position.z = Game.local.ground.move.convert_z(18)
							Game.global.scene.add(el.items[0])
						}
					}
				})
				Game.local.ground.data[18] = temp;
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
			Game.global.scene.add(Game.local.sky.obj)
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
			Game.global.scene.add(Game.local.out.obj)
		}

//preload
Game.preload = function () {
	new Promise((resolve, reject) => {
		switch (Game.global.actual.map) {
			case "nature" : {				
				Game.local.ground.model.brown   = new Plane("brown",0,6,2,1,true)
    				Game.local.ground.model.green   = new Plane("green",0,6,1,1,true)
   				Game.local.ground.model.black   = new Plane("black",0,6,1,1,true)
    				Game.local.ground.model.black_a = new Box("black",0,0,6,1,7,1  ,)
    				Game.local.ground.model.black_b = new Box("black",0,0,6,1,3,1  ,)
   				Game.local.ground.model.black_c = new Box("black",0,0,6,1,1,1,)
    				Game.local.ground.model.green_a = new Box("green",0,0,6,6,6,6,)
    				Game.local.ground.model.green_b = new Box("green",0,0,6,3,3,3,)
			}break;
			case "city" : {				
				Game.local.ground.model.brown   = new Plane("brown",0,6,2,1,true)
    				Game.local.ground.model.green   = new Plane("green",0,6,1,1,true)
   				Game.local.ground.model.black   = new Plane("black",0,6,1,1,true)
    				Game.local.ground.model.black_a = new Box("black",0,0,6,1,7,1  ,)
    				Game.local.ground.model.black_b = new Box("black",0,0,6,1,3,1  ,)
   				Game.local.ground.model.black_c = new Box("black",0,0,6,1,1,1,)
    				Game.local.ground.model.green_a = new Box("green",0,0,6,6,6,6,)
    				Game.local.ground.model.green_b = new Box("green",0,0,6,3,3,3,)
			}break;
			case "cyber" : {				
				Game.local.ground.model.brown   = new Plane("brown",0,6,2,1,true)
    				Game.local.ground.model.green   = new Plane("green",0,6,1,1,true)
   				Game.local.ground.model.black   = new Plane("black",0,6,1,1,true)
    				Game.local.ground.model.black_a = new Box("black",0,0,6,1,7,1  ,)
    				Game.local.ground.model.black_b = new Box("black",0,0,6,1,3,1  ,)
   				Game.local.ground.model.black_c = new Box("black",0,0,6,1,1,1,)
    				Game.local.ground.model.green_a = new Box("green",0,0,6,6,6,6,)
    				Game.local.ground.model.green_b = new Box("green",0,0,6,3,3,3,)
			}break;
		}
   
	 	Game.local.ground.model.green_a.material.transparent = true
 		Game.local.ground.model.green_b.material.transparent = true
    		Game.local.ground.model.black_a.material.transparent = true
    		Game.local.ground.model.black_a.material.opacity = 0.25
    		Game.local.ground.model.black_b.material.transparent = true
    		Game.local.ground.model.black_b.material.opacity = 0.25
    		Game.local.ground.model.black_c.material.transparent = true
    		Game.local.ground.model.black_c.material.opacity = 0.25
   		
		let timer = setInterval( function() {
			if(Game.local.ground.model.green_b!==undefined){
				clearInterval(timer)
				resolve(true)
			}
		},1000)
	})
}
//load
Game.load = async function (){
	await Game.preload();
	Game.local.sky.build()
	Game.local.out.build()
	Game.local.ground.build()
	Game.local.ground.move.run()
	Game.global.car.build()

		
	let timer = setInterval( function() {
		if(Game.global.car.loaded == true) {
			clearInterval(timer)
			Game.animate()
			Game.global.status = true
		}
	},500)
}


//control
document.addEventListener("keydown", function(event){
	if ( Game.local.ground.move.status == true) {
		switch(event.code){
			case "ArrowRight" : {
				Game.global.car.obj.rotation.y = (15*Math.PI)/180
				Game.global.car.obj.position.x += 1.5 
			}break;
			case "ArrowLeft" : {
				Game.global.car.obj.rotation.y = (-15*Math.PI)/180
				Game.global.car.obj.position.x -= 1.5
			}break;
			case "ArrowUp" : {
				Game.local.speed += 0.75
				Game.global.car.obj.position.z -= 0.1
				if(Game.global.car.obj.position.z < 3.0) {
					Game.global.car.obj.position.z += 0.1
					Game.local.speed -= 0.75
				}
			}break;		
		}
	}
})
document.addEventListener("keyup", function(event){
	if ( Game.local.ground.move.status == true) {
		switch(event.code){
			case "ArrowRight" : {
				Game.global.car.obj.rotation.y = 0
			}break;
			case "ArrowLeft" : {
				Game.global.car.obj.rotation.y = 0
			}break;
		}
	}
})

let check = setInterval( function () {
	if (Game.global.status == true) {
		if(Game.global.car.obj.position.x > 0) Game.global.car.obj.position.x -= 0.1
		if(Game.global.car.obj.position.x < 0) Game.global.car.obj.position.x += 0.1
		//collisions
		let actual = Game.global.car.obj.position.x
		Game.local.ground.data[3].forEach( el=> {
			if(el.type == "black_a"){
				if( actual > el.obj.position.x - 0.25 &&  actual < el.obj.position.x +0.25) {
					console.log("catch_a")
					Game.global.car.animation.action.a_a.run()
					Game.local.ground.move.status = false
					clearInterval(check)
					Game.global.car.animation.action.a_s.anim(false)
				} 
			}
			if(el.type == "black_b"){
				if( actual > el.obj.position.x - 1 &&  actual < el.obj.position.x +1) {
					console.log("catch_b")	
					Game.global.car.animation.action.a_b.run()
					Game.local.speed /= 3
				} 
			}
			if(el.type == "black_c"){
				if( actual > el.obj.position.x - 1.25 &&  actual < el.obj.position.x +1.25) {
					console.log("catch_c")
					Game.global.car.animation.action.a_c.run()
					Game.global.score -= 25
				} 
			}
			if(el.type == "green"){
				if( actual > el.obj.position.x - 0.5 &&  actual < el.obj.position.x +0.5) {
					console.log("green")
					Game.local.speed -= 0.05
				} 
			}
			if(Game.local.speed  < 0) Game.local.speed = 0.0
			if(Game.local.speed  > 2) {
				Game.global.car.animation.action.a_s.anim(true)
			} else 	Game.global.car.animation.action.a_s.anim(false)
			if(Game.local.speed  >  Game.local.limit * 1.25) {
				Game.local.speed -= 0.25
				Game.global.car.obj.position.z += 0.01
			}
			if(Game.global.score < 0) Game.global.score = 0
			if(Game.global.car.obj.position.z < 3.5) Game.global.car.obj.position.z += 0.05
		}) 
		
		Nav.score.el.innerHTML = ""+Game.global.score
		Nav.speed.el.innerHTML = ""+Game.local.speed
	} 
},50)

//backload
var back_load = {}
function backLoad(){
	switch (Game.global.actual.map){
		case "nature" : {
			loader_green.load( '/src/green_n.glb',  function ( gltf ) {
					let model = gltf.scene;
					model.scale.set(1, 0.25, 1)
					model.traverse( function ( object ) {
						if ( object.isMesh ) object.castShadow = true;
					} );
					back_load.green = model
					console.log(back_load)
			})
					console.log(back_load)
		}break;
		case "city" : {
		}break;
		case "cyber" : {
		}break;
	}
}

//system
