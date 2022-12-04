import React, { useEffect, useRef, useState } from 'react'
import Xarrow from "react-xarrows";

const Liasons = ({stepsMonitor,allLiaisons,setAllLiaisons}) => {
  const allDest = useRef ([...stepsMonitor.destinations]) 

  const [startDest,setStartDest] = useState("") // Name of the box from start pose
  const [endDest,setEndDest] = useState("") // Name of the box from end pose

  const startDestRef = useRef() 
  const endDestRef = useRef()
  
  const handleEndDestClick = (e,name)=>{
    if(!startDest) return
    setEndDest(name)
    endDestRef.current = e.target
    setAllLiaisons(currLiaisons=>[...currLiaisons,{start:startDest,end:name}])
    stepsMonitor.addConnection(startDest,name) // name for endName since setEndDest take time
    setStartDest("")
  }

  useEffect(() => {
    console.log("??????");
    
    setAllLiaisons(stepsMonitor.connections)
  }, []);
  
  
  return (
    <>
        <h3 style={{fontSize:"1.4rem"}} > Lier Entre Les Destinations</h3>
        <div className="liaisons__container">
            <div className="start__dest">
                {allDest.current.map(dest => (
                    <div key={dest.name} onClick={(e)=>{
                      setStartDest(dest.name)
                      startDestRef.current = e.target
                    }} id={dest.name+"_start"} className={`dest__box ${startDest===dest.name && "active"}`}> {dest.name} </div>
                ))}
            </div>
            <div className="end__dest">
                {allDest.current.map(dest => (
                    <div id={dest.name+"_end"} key={dest.name} onClick={(e)=> handleEndDestClick(e,dest.name)} className={`dest__box ${startDest===dest.name && "disabled"}`}> {dest.name} </div>
                ))}
            </div>
            {allLiaisons.length >0 && allLiaisons.map((connection)=>(
            <Xarrow
            color={`#3C4755`}
            key={connection.start+connection.end}
            start={connection.start+"_start"}
            end={connection.end+"_end"}
            curveness={0}
            />
            )) }
        </div>
       
    </>
  )
}

export default Liasons