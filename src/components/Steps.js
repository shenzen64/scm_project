import React, { useEffect, useRef } from 'react'

const Steps = ({currStep}) => {

    const progressFill = useRef()

    useEffect(() => {
      progressFill.current.style.height=`${((currStep-1)/4)*100}%`
    }, [currStep])
    
  return (
    <div className='steps'>
        <h2>Étapes</h2>
        <div className="progress-container">
        <div id="progress"> <div ref={progressFill} className="fill"></div> </div>
        <div className='step'>
            <div className={`circle active`}>1</div>
            <p className='active'>Choix du points de départ et d’arrivé</p>
        </div>
        <div className='step'>
            <div className={`circle ${currStep>=2 && 'active'}`}>2</div>
            <p className={currStep>=2 ? 'active' : ''}>Choix des destinations possibles</p>
        </div>
        <div className='step'>
            <div className={`circle ${currStep>=3 && 'active'}`}>3</div>
            <p className={currStep>=3 ? 'active' : ""}>Lier entre les destinations</p>
        </div>
        <div className='step'>
            <div className={`circle ${currStep>=4 && 'active'}`}>4</div>
            <p className={currStep>=4 ? 'active' : ""}>Choix de l'algorithme de transport</p>
        </div>
        <div className='step'>
            <div className={`circle ${currStep>=5 && 'active'}`}>5</div>
            <p className={currStep>=5 ? 'active' : ''}>Votre chemin critique !</p>
        </div>
    </div>
    </div>
  )
}

export default Steps