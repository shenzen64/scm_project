import gsap from 'gsap'
import * as THREE from 'three'


// Linear interpolation
const lerp =(value1, value2, amount)=> {
    amount = amount < 0 ? 0 : amount;
    amount = amount > 1 ? 1 : amount;
    return value1 + (value2 - value1) * amount;
}


export default class StepsMonitor {
    constructor(setCurrStep,sketch,map,notif,clickedPos,setWaiter,setStepsDone) {
        this.currStep = 1
        this.startPos = null
        this.endPos = null
        this.sketch = sketch.current
        this.setCurrStep = setCurrStep
        this.map = map
        this.notif = notif.current
        this.setWaiter = setWaiter
        this.destinations = [{name:"Position de départ",coords:this.startPos},{name:"Position d'arrivé",coords:this.endPos}] // [{ name:"A", coord:[lng,lat] },{ name:"B", coord:[lng,lat] }...]
        this.stepsDone = [0,0,0,0,0] // [step1 not done, step2, not done,...]
        this.setStepsDone = setStepsDone
        this.connections = [] // [{start:"dest1",end:"dest2"},..]
     
        // This variable is true when the stepsMonitor is waiting for the user click in the map
        this.waiter = false

        
        setTimeout(()=>{
            this.notify("Cliquer sur la position de départ")
            this.setStartPos()
        },4000)

       
        // this.setStartPos()
       
    }   
    setStartPos() {
        this.waiter = true // Waiting for click in startPos
        this.setWaiter(true)
    }
    addDestination(name) {
        this.destinations.push({
            name
        })
        this.notify(`Cliquer sur la position de ${name}`)
    }
    deleteDest(name) {
       this.destinations= this.destinations.filter(dest=>dest.name!=name)
       this.sketch.tb.world.children.forEach((mesh) => {
        if (mesh.name == name) {
            mesh.visible = false
            mesh.removeHelp()
            mesh.removeTooltip()
            mesh.dispose()
            this.sketch.tb.world.remove(mesh)
         
        }
    })
    if(this.destinations.length===0){
        // NO DESTINATIONS SO STEP 2 IS NOT DONE
        this.stepsDone[1]=0
        this.setStepsDone(this.stepsDone)
    }
    }
    notify(text){
        const notifText = this.notif.querySelector("p")
        const tl = gsap.timeline()
        notifText.innerText = text
        notifText.style.opacity = 0
        tl.fromTo(this.notif,{opacity:0,width:"4px"},{opacity:1,width:'auto',duration:1})
        .fromTo(notifText,{opacity:0}, {opacity:1},"+=0.5")
        // .fromTo(this.notif,{opacity:1}, {opacity:0},"+=5")
        // .to(this.notif,{opacity:0},"+=5")

    }

    addConnection(start,end){

        this.connections.push({
            start,
            end
        })
        const startCoords = this.destinations.find((dest)=>dest.name==start).coords
        const endCoords = this.destinations.find((dest)=>dest.name==end).coords

        this.drawLine(startCoords,endCoords,start+end)
        // We have one connection so this step 3 can be done
        if(this.stepsDone[2]===0){
            this.stepsDone = [1,1,1,0,0]
            this.setStepsDone(this.stepsDone)
        }
     
    }

    deleteConnection(connection) {
        this.connections = this.connections.filter(con=>{
            if(con.start===connection.start && con.end===connection.end) {
                return false
            } 
            return true
        })
        // Check if there is a line with the same name and delete it
        this.sketch.tb.world.children.forEach((mesh) => {
            if (mesh.name == (connection.start+connection.end)) {
                this.sketch.tb.world.remove(mesh)
            }
        })
    }

    inverseWaiter(){
        this.waiter = !this.waiter
        this.setWaiter(currWaiterValue=>!currWaiterValue)
    } 

    drawLine (start,destination,name){

        const line = new Array();
        const maxElevation = Math.pow(Math.abs(destination.lat*destination.lng), 0.5)*1000 ;
        const arcSegments = 25;
    
        for (let l = 0; l<=arcSegments; l++){
            
            const waypoint = [lerp(start.lng,destination.lng,l/arcSegments),lerp(start.lat,destination.lat,l/arcSegments)]
    
            const waypointElevation = Math.sin(Math.PI*l/arcSegments) * maxElevation;
            
            waypoint.push(waypointElevation);
            line.push(waypoint);
        }
        
        const lineMesh= this.map.tb.line({
                geometry: line,
                color: '#3C4755',
                width: 3
            })
        
        lineMesh.name = name
        this.map.tb.world.add(lineMesh)

        // return line
    }

    changeStep(direction) {
        
        if(direction==="next"  && this.currStep <5) {
            this.setCurrStep(this.currStep+1)
            this.currStep++
            // return
        } 
        if(direction=="prev" && this.currStep >1 ){
            this.setCurrStep(this.currStep-1)
            this.currStep--
            // return
        }
        console.log(this);
    }
    

    onMapClick(map,e) {
        this.notif.style.opacity = 0
        if(this.waiter) {
        // STEP 1

        if(this.currStep==1){
            // Check if the click is for the start position 
            if(!this.startPos){
                this.startPos = e.lngLat
                this.destinations[0].coords = this.startPos
                this.addCube(this.startPos.lng,this.startPos.lat,"Postion de départ")
                this.inverseWaiter()
                setTimeout(() => {
                    this.notify("Cliquez sur la position d'arrivée")
                    this.inverseWaiter()
                }, 2500);
            } else { // Enter the end position
                this.endPos = e.lngLat
                this.destinations[1].coords = this.endPos
                this.addCube(this.endPos.lng,this.endPos.lat,"Postion d'arrivé")
                this.inverseWaiter()

                this.stepsDone = [1,0,0,0,0] // STEP 1 DONE
                this.setStepsDone(this.stepsDone)
                // PASS TO STEP 2
                this.currStep=2
                this.setCurrStep(2)
                
                return
            }
        }
            
        // STEP 2
        if(this.currStep==2) {
            this.destinations[this.destinations.length-1].coords = e.lngLat
            this.addCube(e.lngLat.lng,e.lngLat.lat,this.destinations[this.destinations.length-1].name)
            this.inverseWaiter()
            // YOU SET ONE POSSIBLE DESTINATION SO STEP 2 IS DONE
            this.stepsDone = [1,1,0,0,0] // STEP 1 DONE
            this.setStepsDone(this.stepsDone)
            return
        }

        }
    }

    addCube(lng,lat,textHelper) {
        this.map.flyTo({
            center: [lng, lat],
            essential: true, // this animation is considered essential with respect to prefers-reduced-motion
            zoom: 16
        });

        const geometry = new THREE.BoxBufferGeometry(20, 20, 60)
        const material = new THREE.MeshStandardMaterial({ color: "#1f242c" })
        let cube = new THREE.Mesh(geometry, material)
        cube = this.sketch.tb.Object3D({ obj: cube, units: 'meters' })
        cube.setCoords([lng, lat])
        cube.addHelp(textHelper, "gps", true, cube.center, 1, "label")
        // Check if there is a cube with the same name and delete it
        this.sketch.tb.world.children.forEach((mesh) => {
            if (mesh.name == textHelper) {
                mesh.removeHelp()
                mesh.removeTooltip()
                this.sketch.tb.world.remove(mesh)
            }
        })
        cube.name = textHelper
        this.sketch.tb.world.add(cube)
    }
    
    

    colorizeCriticalPath(path) {
        // Line name is "start + end" so we just have to loop over path
        for(let i=0;i<path.length-1;i++) {
            this.sketch.tb.world.children.forEach((mesh) => {
                if (mesh.name == path[i]+path[i+1]) {
                    mesh.material.color = new THREE.Color("rgb(192, 43, 43)")
                }
                // else if(mesh.type==="Line2") {
                //     mesh.material.color = new THREE.Color("#3C4755")
                // }
            })
        }   
    }
}

