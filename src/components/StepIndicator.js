import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { AddIcon, Arrow, DeleteIcon } from '../Svg'
import Popup from './Popup'
import Destinations from './Destinations'
import Controls from './Controls'
import Liasons from './Liasons'

const StepIndicator = ({stepsMonitor,stepsDone}) => {
    
    // State
    const [opened,setOpened] = useState(false)
    const [allDestinations,setAllDestinations] = useState([])
    const [allConnections,setAllConnections] = useState([]) // [{start:"",end:""}] Used to add arrow for each liaison

    const container = useRef()
    

    useEffect(() => {
      gsap.to(container.current,{x:-(stepsMonitor.currStep-1)*100/5+"%"})
    }, [stepsMonitor.currStep])
    
  return (
    <div className='stepIndicator'>
            <Popup opened={opened} setOpened={setOpened}>
              {stepsMonitor.currStep===2 && <Destinations setAllDestinations={setAllDestinations} setOpened={setOpened} stepsMonitor={stepsMonitor} />}
              {stepsMonitor.currStep===3 && <Liasons allLiaisons={allConnections} setAllLiaisons={setAllConnections} stepsMonitor={stepsMonitor}/>}
            </Popup>
        <div ref={container} className="container">
            {/* STEP 1 */}
            <div className="container__wrapper">
            <h2>Étape 1</h2>
            
            <div className='step'>
            <div className='circle active'>1</div>
            <p className={stepsMonitor.startPos && 'active'}>Choix de la position de départ</p>
            </div>

            <div className='step'>
                <div className={`circle ${stepsMonitor.endPos && 'active'}`}>2</div>
                <p className={stepsMonitor.endPos && 'active'}>Choix de la position d'arrivée</p>
            </div>
            </div>

            {/* STEP 2 */}
            <div className="container__wrapper">
            <h2>Étape 2</h2>
            <h3>Les destination possibles:</h3>
            <div className="all__dest">
            {allDestinations.map(dest=>
                    {
                    if(dest.name==="Position de départ" || dest.name==="Position d'arrivé") return

                    return (<div className='single__dest' key={dest.name}>{dest.name} 
                    <div onClick={()=>{
                      stepsMonitor.deleteDest(dest.name)
                      setAllDestinations(stepsMonitor.destinations)
                    }} className="deleteIcon">
                    <DeleteIcon  />
                      </div> 
                    </div>)
                    }
            )}
            </div>
            <div onClick={()=>setOpened(true)} className="add__destination">
                <AddIcon />
                <p>Ajouter une nouvelle destination</p>
            </div>
            
            </div>

            {/*  STEP 3 */}
            <div className="container__wrapper">
            <h2>Étape 3</h2>
            <h3>Les liaisons entre les destinations:</h3>
            <div className="all__dest">
            {allConnections.map(connection=>
                    <div className='single__dest connection' key={connection.start+connection.end}>{connection.start} <Arrow /> {connection.end} 
                    <div onClick={()=>{
                      // console.log("delete shit");
                      stepsMonitor.deleteConnection(connection)
                      setAllConnections(stepsMonitor.connections)
                    }} className="deleteIcon">
                    <DeleteIcon  />
                      </div> 
                    </div>
            )}
            </div>
            <div onClick={()=>setOpened(true)} className="add__destination">
                <AddIcon />
                <p>Ajouter des nouvelles liaisons</p>
            </div>
            
            </div>


        </div>
        <Controls stepsDone={stepsDone} stepsMonitor={stepsMonitor} />
    </div>
  )
}

export default StepIndicator