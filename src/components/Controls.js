import React from 'react'
import { NextIcon } from '../Svg'

const Controls = ({stepsMonitor,stepsDone}) => {
  return (
    <div className="next__prev">
        <div onClick={()=>stepsMonitor.changeStep("prev")} id="prev" className={`steps__controle ${stepsMonitor.currStep===1 && "disabled"}`}>
          <NextIcon  />
        </div>
        <div onClick={()=>stepsMonitor.changeStep("next")} className={`steps__controle ${(stepsMonitor.currStep===5 || !stepsDone[stepsMonitor.currStep-1] ) && "disabled"}`}>
          <NextIcon />
        </div>
    </div>
  )
}

export default Controls