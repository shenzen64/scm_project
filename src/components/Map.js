import React, { useEffect, useRef, useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import ReactMapboxGl, { ZoomControl, RotationControl } from 'react-mapbox-gl';
import * as THREE from 'three'
import "threebox-plugin/dist/threebox.css"
import "threebox-plugin/examples/css/threebox.css"
import { AddLocation, ClickIcon, GpsIcon } from '../Svg';
import { setRTLTextPlugin } from "mapbox-gl";
import Loading from './Loading';
import MapSketch from '../classes/MapSketch';
import "../styles/map.css"
import Steps from './Steps';
import StepIndicator from './StepIndicator';
import StepsMonitor from '../classes/StepsMonitor';

setRTLTextPlugin("https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js");

// mapboxgl.workerClass = MapboxWorker;



const Mapbox = ReactMapboxGl({
    accessToken:
        'pk.eyJ1Ijoic2hlbnplbjY0IiwiYSI6ImNrbnNzaWg0ODExZ2oycW8xa2Jkc2FmeWwifQ.yFDqLEHzuH3qZLAgqt33MA',
    antialias: true,
    touchZoomRotate: false
});



const Maps = () => {
    // State
    const [pitch, setPitch] = useState(45)
    const [viewport, setViewport] = useState({
        longitude: -7.5898434,
        latitude: 33.5731104,
        zoom: 11
    })
    const [loading, setLoading] = useState(true)
    const [mapp, setMap] = useState(null)
    const [openedClickLocation, setopenedClickLocation] = useState(false)
    const [clickedLongLat, setClickedLongLat] = useState({
        lat: null,
        lng: null
    })
    const [currStep,setCurrStep] = useState(1)
    const [stepsDone,setStepsDone] = useState([0,0,0,0,0])
    
    // Refs
    const mapContainer = useRef()
    const click = useRef()
    const sketch = useRef()
    const notif = useRef()
    const stepsMonitor = useRef()
   
    const [waiter,setWaiter] = useState(false)
    // Functions

    const onViewportChange = (updated) => {
        setViewport({
            ...viewport,
            //   width: updated._container.clientWidth,
            //   height: updated._container.clientHeight,
            longitude: updated.getCenter().lng,
            latitude: updated.getCenter().lat,
            zoom: updated.getZoom(),
        });
    };


    const handleStyleLoad = (map) => {
        console.log("style loaded")
        setMap(map)
        setLoading(false)
    }



    const initialLayer = () => (
        {
            id: 'custom_layer',
            type: 'custom',
            renderingMode: '3d',
            onAdd: function (map, mbxContext) {


                /////////////////// NEW CLASS HERE ////////////////////////////
                sketch.current = new MapSketch(map,mbxContext)
                stepsMonitor.current = new StepsMonitor(setCurrStep,sketch,mapp,notif,clickedLongLat,setWaiter,setStepsDone)
                window.tb = sketch.current.tb

                // INIT (if not mobile)
                if (window.innerWidth > 800) {
                    sketch.current.tb.defaultLights()
                    sketch.current.tb.createSkyLayer()
                    sketch.current.tb.getSunSky(new Date())
                }

            },

            render: function (gl, matrix) {
                sketch.current.tb.update();
            }
        }
    )



    const handleZoom = (e) => {
        const currZoom = e.getZoom();
        const root = document.documentElement
        if (currZoom < 10) {
            root?.style.setProperty("--markerScale", 0.3)
        } else {
            root?.style.setProperty("--markerScale", 1)
        }
    }


    useEffect(() => {
        if ( waiter) {
            document.body.style.opacity = 0.65
            mapp.getCanvas().parentElement.style.cursor = 'crosshair'
        } else if(mapp) {
            mapp.getCanvas().parentElement.style.cursor = 'grab'
            document.body.style.opacity = 1
        }


    }, [ waiter]) 

    // useEffect(() => {
    //     if (clickedLongLat.lat) {
    //         const { lng, lat } = clickedLongLat
    //         if (stepsMonitor.current.waiter) {
    //             mapp.getCanvas().parentElement.style.cursor = 'grab'
    //             document.body.style.opacity = 1

    //             mapp.flyTo({
    //                 center: [lng, lat],
    //                 essential: true, // this animation is considered essential with respect to prefers-reduced-motion
    //                 zoom: 16
    //             });

    //             const geometry = new THREE.BoxBufferGeometry(10, 10, 60)
    //             const material = new THREE.MeshStandardMaterial({ color: "#CD6E6F" })
    //             let cube = new THREE.Mesh(geometry, material)
    //             cube = sketch.current.tb.Object3D({ obj: cube, units: 'meters' })
    //             cube.setCoords([lng, lat])
    //             cube.addHelp(` Votre Position`, "gps", true, cube.center, 1, "label")
    //             sketch.current.tb.world.children.forEach((mesh) => {
    //                 if (mesh.name == 'position') {
    //                     mesh.removeHelp()
    //                     sketch.current.tb.remove(mesh)
    //                 }
    //             })
    //             cube.name = 'position'
    //             sketch.current.tb.world.add(cube)

    //             setopenedClickLocation(false)
    //         } else {
    //             setClickedLongLat({})
    //         }
    //     }
    // }, [clickedLongLat.lng])





    let isMounted = true
    useEffect(() => {
        if (mapp && isMounted) {

            mapp.addLayer(initialLayer())
        }
        return () => {
            isMounted = false
            // setMap(null)
        }
    }, [mapp])

    return (
        <div className='mapContainer' ref={mapContainer}>

            

            {loading && <Loading />}

            <Mapbox

                style="mapbox://styles/mapbox/outdoors-v12"
                containerStyle={{
                    height: '100vh',
                    width: '100vw'
                }}
                onClick={(map,e)=>{ 
                    stepsMonitor.current.onMapClick(map,e)
                }}
                center={[viewport.longitude, viewport.latitude]}
                antialias={true}
                pitch={[pitch]}
                onStyleLoad={handleStyleLoad}
                zoom={[viewport.zoom]}
                onZoom={handleZoom}
                onMoveEnd={onViewportChange}
                // onZoomEnd={onViewportChange}
                onPitchEnd={(e) => setPitch(e.getPitch())}
            >
                <ZoomControl position={window.innerWidth < 800 ? `top-left` : "top-right"} style={{ top: "160px", zIndex: 0 }} />
                <RotationControl position={window.innerWidth < 800 ? `top-left` : "top-right"} style={{ top: "130px", zIndex: 0 }} />
            </Mapbox>

            <div onClick={() => setopenedClickLocation(!openedClickLocation)} ref={click} className="addLocation up"> <ClickIcon /> <p> Clicker sur votre localisation sur la map </p> </div>

            {stepsMonitor.current && <StepIndicator stepsDone={stepsDone} stepsMonitor={stepsMonitor.current} />}

            <Steps currStep={currStep} />

            <div ref={notif} className="notif">
                <p></p> 
            </div>
        
        </div>
    )
}


export default Maps