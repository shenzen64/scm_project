import React, { useEffect, useRef } from 'react'

const Popup = ({children, opened, setOpened }) => {
    const pop = useRef()
    const x = useRef()
    const handleClick = (e)=>{
        if(opened && pop.current){
        const isNotDescendant = !pop.current.contains(e.target)
        
        if(e.target != pop.current && isNotDescendant){
           
            setOpened(false)
            return
        }
      } else {
          return
      }
    }
    useEffect(() => {
        document.addEventListener('click',handleClick)
        return ()=>{
            document.removeEventListener('click',handleClick)
        }
    }, [opened])
    
    return (
        <>
       { opened && <div className='popupContainer'>
            <div ref={pop} className="popup">
                <div  ref={x} onClick={()=>setOpened(false)} className="x pop">X</div>
            {children}
            </div>
        </div>}
        </>
    )
}

export default Popup
