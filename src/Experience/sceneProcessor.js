import * as THREE from 'three';
import Experience from "./Experience.js";

import Scene1 from "./testScenes/scene1/scene1";
import Scene2 from "./testScenes/scene2/scene2";
import Scene3 from "./testScenes/scene3/scene3";
export default class SceneProcessor
{
  	constructor()
  	{
		this.experience = new Experience();
		this.renderer = this.experience.renderer;

		this.Scene1 = new Scene1();
		this.Scene2 = new Scene2();
		this.Scene3 = new Scene3();

		this.processorOutput = null;
		this.currentlyObserved = null;

		let observer = new IntersectionObserver((entries) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				if (this.currentlyObserved !== entry.target.id) {
					this.currentlyObserved = entry.target.id; // Update the currently observed element.
					this.sceneProcessor = entry.target.id; // Update sceneProcessor to the new element's ID.
					this.update(this.sceneProcessor); // Call the rendering function here.
				}
			} else {
				this.sceneProcessor = null;
				this.update(this.sceneProcessor); // Call the rendering function here.
			}
		});
		});

		document.querySelectorAll('.scene').forEach(item => {
			observer.observe(item);
		});
  	}   

	update(scene)
	{
		switch (scene) {
			case 'scene1':
				this.renderer.instance.clear();
			  	this.Scene1.update();
			  	break;
			case 'scene2':
				this.renderer.instance.clear();
				this.Scene2.update();
				break;
			case 'scene3':
			  this.Scene3.update();
			  break;
			case null:
				this.renderer.instance.clear();
			  break;
		}
	}
}

