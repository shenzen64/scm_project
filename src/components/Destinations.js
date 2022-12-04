import React, { useEffect, useState } from 'react'

const Destinations = ({stepsMonitor,setOpened,setAllDestinations}) => {

    const [destName,setDestName] = useState("")


    const handleNewDest = ()=>{
      if(destName.length===0) return
      let nameExist = false // Variable to check if the entred name already exist
        stepsMonitor.destinations.forEach(dest=>{
          if(dest.name===destName){
            nameExist=true
            return alert("Nom de destination déja present")
          }
        })
        if(nameExist) return
        setOpened(false)
        stepsMonitor.inverseWaiter()
        stepsMonitor.addDestination(destName)
        setAllDestinations(stepsMonitor.destinations)
        setDestName("")
    }



  return (
    <>
                <h3>Nom de la nouvelle destination:</h3>
                <input minLength={1} value={destName} onChange={e=>setDestName(e.target.value)} type="text" />
                
                <div className="btn__container">
                    <div onClick={handleNewDest} className="btn">
                        OK
                    </div>
                </div>
    </>
  )
}

export default Destinations