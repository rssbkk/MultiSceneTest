import * as THREE from 'three';
import Experience from "./Experience.js";

import Scene1 from "./testScenes/scene1/scene1";
import Scene2 from "./testScenes/scene2/scene2";
import Scene3 from "./testScenes/scene3/scene3";

export default class SceneProcessor
{
		constructor() {
		  this.experience = new Experience();
		  this.renderer = this.experience.renderer;
		  this.sizes = this.experience.sizes;
		  this.canvas = this.experience.canvas;
	  
		  this.sceneElements = [];
		  const addScene = (elem, sceneInstance) => {
			this.sceneElements.push({ elem, sceneInstance });
		  };
	  
		  this.Scene1 = new Scene1();
		  this.Scene2 = new Scene2();
		  this.Scene3 = new Scene3();
	  
		  this.mapSceneToClass = {
			'scene1': this.Scene1,
			'scene2': this.Scene2,
			'scene3': this.Scene3,
		  };
	  
		  document.querySelectorAll('[data-diagram]').forEach((elem) => {
			const sceneName = elem.dataset.diagram;
			const sceneInstance = this.mapSceneToClass[sceneName];
			
			if (!sceneInstance) {
			  console.error(`No valid scene instance found for '${sceneName}'.`);
			  return;
			}
			addScene(elem, sceneInstance);
		  });
		}
	  
		update() {
		  this.renderer.instance.setScissorTest(false);
		  this.renderer.instance.clear(true, true);
		  this.renderer.instance.setScissorTest(true);
	  
		  for (const { elem, sceneInstance } of this.sceneElements) {
			// get the viewport relative position of this element
			const rect = elem.getBoundingClientRect();
			const { left, right, top, bottom, width, height } = rect;
	  
			const isOffscreen =
			  bottom < 0 ||
			  top > this.sizes.height ||
			  right < 0 ||
			  left > this.sizes.width;
	  
			if (!isOffscreen) {
			  const positiveYUpBottom = this.sizes.height - bottom;
			  this.renderer.instance.setScissor(left, positiveYUpBottom, width, height);
			  this.renderer.instance.setViewport(left, positiveYUpBottom, width, height);

			  
			  console.log(sceneInstance);

			  // individual scenes? 
			}
		}
	}
}

// constructor()
// {
//   this.experience = new Experience();
//   this.renderer = this.experience.renderer;
//   this.sizes = this.experience.sizes;
//   this.canvas = this.experience.canvas;

//   this.sceneElements = [];
//   const addScene = ( elem, fn ) => {
// 	  this.sceneElements.push( { elem, fn } );
//   }

//   this.Scene1 = new Scene1();
//   this.Scene2 = new Scene2();
//   this.Scene3 = new Scene3();

//   this.mapSceneToClass = {
// 	  'scene1' : Scene1,
// 	  'scene2' : Scene2,
// 	  'scene3' : Scene3,
//   };

//   document.querySelectorAll('[data-diagram]').forEach((elem) => {
// 	  const sceneName = elem.dataset.diagram;
// 	  const sceneInitFunction = this.mapSceneToClass[sceneName];
  
// 	  if (typeof sceneInitFunction !== "function") {
// 	  console.error(`No valid initialization function found for scene '${sceneName}'.`);
// 	  return;
// 	}
// 	  const sceneRenderFunction = new sceneInitFunction(elem);
// 	  addScene(elem, sceneRenderFunction);
//   });
// }   

// update()
// {
//   this.renderer.instance.setScissorTest( false );
//   this.renderer.instance.clear( true, true );
//   this.renderer.instance.setScissorTest( true );

//   for ( const { elem, fn } of this.sceneElements ) {

// 	  // get the viewport relative position of this element
// 	  const rect = elem.getBoundingClientRect();
// 	  const { left, right, top, bottom, width, height } = rect;

// 	  const isOffscreen =
// 	bottom < 0 ||
// 	top > this.sizes.height ||
// 	right < 0 ||
// 	left > this.sizes.width;

// 	  if ( ! isOffscreen ) {

// 		  const positiveYUpBottom = this.sizes.height - bottom;
// 		  this.renderer.instance.setScissor( left, positiveYUpBottom, width, height );
// 		  this.renderer.instance.setViewport( left, positiveYUpBottom, width, height );

// 	  }

//   }
// }
