import globalTb from 'threebox-plugin';
import "threebox-plugin/dist/threebox.css"
import "threebox-plugin/examples/css/threebox.css"

const Threebox = globalTb.Threebox

export default class MapSketch {
    constructor(map,mbxContext){
        this.tb = new Threebox(
            map,
            mbxContext,
            {
                defaultLights: true,
                // enableSelectingObjects: true,
                // enableSelectingFeatures: true, //change to false to disable fill-extrusion features selection
                // multiLayer: true,
                antialias: true,
                realSunlight: window.innerWidth > 800,
                // enableSelectingObjects: true, //enable 3D models over/selectionn
                // enableTooltips: true // enable default tooltips on fill-extrusion and 3D models 

            }
        );


        window.addEventListener('resize', () => {
            this.onResize()
        })
    }

    onResize(){
            if (this.tb) {
                this.tb.camera.aspect = window.innerWidth / window.innerHeight
                this.tb.camera.updateProjectionMatrix()
                this.tb.renderer.setSize(window.innerWidth, window.innerHeight)
                this.tb.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
            }
    }

   

}