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

//for test:
const Meshes = []
//
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
		 data: [
				[ {},{},{},{},{},{},{},{},{},{} ],
				[ {},{},{},{},{},{},{},{},{},{} ],
				[ {},{},{},{},{},{},{},{},{},{} ],
				[ {},{},{},{},{},{},{},{},{},{} ],
				[ {},{},{},{},{},{},{},{},{},{} ],
				[ {},{},{},{},{},{},{},{},{},{} ],
				[ {},{},{},{},{},{},{},{},{},{} ],
				[ {},{},{},{},{},{},{},{},{},{} ],
				[ {},{},{},{},{},{},{},{},{},{} ],
				[ {},{},{},{},{},{},{},{},{},{} ],
				[ {},{},{},{},{},{},{},{},{},{} ],
				[ {},{},{},{},{},{},{},{},{},{} ],
				[ {},{},{},{},{},{},{},{},{},{} ],
				[ {},{},{},{},{},{},{},{},{},{} ],
				[ {},{},{},{},{},{},{},{},{},{} ],
				[ {},{},{},{},{},{},{},{},{},{} ],
				[ {},{},{},{},{},{},{},{},{},{} ],
				[ {},{},{},{},{},{},{},{},{},{} ],
				[ {},{},{},{},{},{},{},{},{},{} ],
				[ {},{},{},{},{},{},{},{},{},{} ],
				[ {},{},{},{},{},{},{},{},{},{} ],
				[ {},{},{},{},{},{},{},{},{},{} ],
				[ {},{},{},{},{},{},{},{},{},{} ],
				[ {},{},{},{},{},{},{},{},{},{} ],
				[ {},{},{},{},{},{},{},{},{},{} ],
				[ {},{},{},{},{},{},{},{},{},{} ],
				[ {},{},{},{},{},{},{},{},{},{} ],
				[ {},{},{},{},{},{},{},{},{},{} ],
				[ {},{},{},{},{},{},{},{},{},{} ],
				[ {},{},{},{},{},{},{},{},{},{} ]
			],
		build: function() {
			//for test:
			for (let j = 5; j >= -15; j--){
				for (let i = -5; i <= 5 ; i++){
					if(i > -2 && i < 2) {
						Meshes.push( new Plane("brown",i,j))
					} else {
						
						Meshes.push( new Plane("green",i,j))
					}
				}		
			}
			//
		},
		move: {
			status : false,
			run : function() {

			}
		},
		shift: function() {

		},
		push:  function() {

		}
}
Ground.build()

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

const Square = function (type) {
			this.type = type
			this.items = []
		
			switch (this.type) {
				case "way"   :; break;
				case "green" :; break; 
			}
		}


const animate = function () {
	requestAnimationFrame( animate );

	//cube.rotation.x += 0.01;
	//cube.rotation.y += 0.01;

	renderer.render( scene, camera );
};

animate();
