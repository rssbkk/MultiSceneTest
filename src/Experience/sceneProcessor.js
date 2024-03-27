import Scene1 from "./testScenes/scene1/scene1";
import Scene2 from "./testScenes/scene2/scene2";
import Scene3 from "./testScenes/scene3/scene3";
export default class SceneProcessor
{
    constructor()
    {
        let observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                console.log(entry.target.id + 'in');
              } else {
                console.log(entry.target.id + 'out');
              }
            });
        });
          
        document.querySelectorAll('.scene').forEach(item => {
            observer.observe(item);
        });
    }   
}

