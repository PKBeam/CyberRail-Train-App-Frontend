import React, { useState, useEffect, useRef } from 'react';
import { Box } from 'react-bulma-components'
import TrainLineIcon from './TrainLineIcon.js'
import TrainCarsIcon from './TrainCarsIcon.js'
import './DisplayBoard.css'
import { recalculateWorldTime } from './util.js'

function getWait(trainTime, serverTime) {
  let secs = (trainTime - recalculateWorldTime(serverTime.worldTimeSecs, serverTime.checkedAt))
  if (secs < 0) {
    secs += 24 * 3600
  }
  let mins = parseInt(secs/60);
  if (mins === 0) {
    return "Now"
  }
  let hrs = parseInt(mins / 60)
  return hrs > 0 ? hrs + "h " + mins % 60 + "m" : mins + " min"
}

function getIntermediateStation(schedule) {
  let stops = schedule.nextStops.slice(1, schedule.nextStops.length - 1).find(s => s.isInterchange)
  return stops == null ? null : stops.stationName
}

function DisplayBoard(props) {
  const [containerStyle, setContainerStyle] = useState({display: "flex",position: "absolute", width: "80%", left: "0"})
  const [trainLineStyle, setTrainLineStyle] = useState({})
  const containerRef = useRef(null)
  const contentRef = useRef(null)
  const trainLineRef = useRef(null)

  useEffect(() => {
    if (contentRef.current == null) {
      return
    }
    let newStyle = {

      height: contentRef.current.clientHeight + "px",
      top: "0px",
      width: "15px",
      marginLeft: "28px"
    }
    setTrainLineStyle(newStyle)

    if (containerRef.current.clientHeight < contentRef.current.clientHeight + 50) {
        let newStyle = {...containerStyle}
        newStyle.top = "0%"
        newStyle.animation = "animate-scroll 10s linear infinite"
        setContainerStyle(newStyle)
    }
  }, [props.schedule, containerStyle]);
  let hasSchedule = (props.schedule.length > 0)
  let nextSchedule = props.schedule[0]

  return (
    <Box style={{height: "calc(500px /3 * 4)", width: "500px", minWidth: "500px", borderRadius: "10px", position: "relative"}} className="p-0">

      {/* ==========
            HEADER
          ---------- */}

      <div style={{
        display: "flex",
        height: "100px",
        borderRadius: "10px 10px 0 0",
        boxShadow: "0px 1px 10px",
        alignItems: "center",
        position: "relative",
        zIndex: "1"
      }} className="pl-4 has-background-light">
        {hasSchedule && <TrainLineIcon height="65%" fontSize="40px" trainLine={nextSchedule.trainLine}/>}
        <div style={{
          display: "flex",
          flexDirection:"column",
          justifyContent: "center"
        }} className="ml-4">
          {hasSchedule && <h1>{nextSchedule.nextStops.length > 1 ? nextSchedule.nextStops[nextSchedule.nextStops.length - 1].stationName : "Terminating service"}</h1>}
          {!hasSchedule && <h1>No scheduled services</h1>}
          {hasSchedule && getIntermediateStation(nextSchedule) && <h2>{"via " + getIntermediateStation(nextSchedule)}</h2>}
        </div>
      </div>

      {/* ==========
            CONTENT
          ---------- */}
      <div ref={containerRef} style={{
        display: "flex",
        height: "calc(100% - 260px)",
        overflow: "hidden",
        position: "relative",
        justifyContent: "flex-end"
      }}>
        <div style={containerStyle} className="pt-0 pb-5">
          {hasSchedule && nextSchedule.nextStops.length > 1 && <div style={trainLineStyle} className={"mr-5 line-" + nextSchedule.trainLine} ref={trainLineRef}></div>}
          <ul style={{position: "absolute"}} className="ml-4 mt-5" ref={contentRef}>
            {hasSchedule && nextSchedule.nextStops.slice(1).map(station =>
              <li key={"station-" + station.stationName} style={{display: "flex", height:"45px", alignItems: "center"}}>
                {station.isInterchange ?
                  <div style={{height: "20px",width: "40px", borderRadius: "15px", backgroundColor: "white", borderStyle: "solid", color: "black", marginRight: "2px"}}/>
                  :
                  <div style={{height: "15px",width: "30px"}} className={"ml-3 line-" + nextSchedule.trainLine}/>
                }
                <div style={{fontWeight: (station.isInterchange && "bold")}} className="ml-4">{station.stationName}</div>
              </li>
            )}
            {hasSchedule && nextSchedule.nextStops.length === 1 && <div className="ml-3" style={{fontSize: "24px"}}>This service terminates here.<br/>Please do not board this train.</div>}
          </ul>
        </div>
        <div style={{
          display: "flex",
          flexDirection:"column",
          justifyContent:"space-between",
          alignItems:"center",
          textAlign:"center",
          width: "25%"
        }} className="py-4 px-0">
          <div>Platform<br/><h1 style={{fontSize: "40px"}} className="mt-2">{props.platform}</h1></div>
          {hasSchedule && <div>{nextSchedule.nextStops.length > 1 ? nextSchedule.serviceType : ""}</div>}
          {hasSchedule && <div><TrainCarsIcon trainCars={nextSchedule.trainCars}/></div>}
          {hasSchedule && <div style={{
            display: "flex",
            flexDirection: "column",
            height: "25%",
            justifyContent: "end"
          }}>
            Departs in<br/><h1 className="mt-1">{getWait(nextSchedule.time, props.serverTime)}</h1>
          </div>}
        </div>
      </div>

      {/* ==========
            FOOTER
          ---------- */}
      <div style={{
        display: "flex",
        flexDirection:"column",
        height: "160px",
        width: "100%",
        borderRadius: "0px 0px 10px 10px",
        boxShadow: "0px -1px 10px",
        position: "absolute",
        bottom: "0"
      }} className="pl-5 pr-5 pt-2 pb-4 has-background-light board-text">
        <div className="mb-2" style={{height: "10%", alignSelf: "center"}}>
          <b>Next Trains</b>
        </div>
        <div style={{height: "90%"}}>
        {props.schedule.slice(1, 3).map((schedule, i) =>
          <div key={"next-train-" + i} className="mt-2 mb-2" style={{display: "flex", justifyContent: "space-between", alignItems: "center", height: "45%"}}>
            <div style={{display: "flex"}}>
            <TrainLineIcon height="100%" fontSize="24px" trainLine={schedule.trainLine}/>
            <div style={{display: "flex", flexDirection: "column", justifyContent: "center"}} className="ml-3">
            <div style={{fontSize: "18px", fontWeight: "bold"}}>{schedule.nextStops.length > 1 ? schedule.nextStops[schedule.nextStops.length - 1].stationName : "Terminating service"}</div>
            {getIntermediateStation(schedule) && <div style={{fontSize: "14px", lineHeight: "12px"}}>via {getIntermediateStation(schedule)}</div>}
            </div>
            </div>
            <div style={{display: "flex", width: "50%", alignItems: "center", justifyContent: "space-between"}}>
              <div className="mr-3">{schedule.nextStops.length > 1 ? schedule.serviceType : ""}</div>
              <h1>{getWait(schedule.time, props.serverTime)}</h1>
            </div>
          </div>
        )}
        </div>
      </div>
    </Box>
  );
}

export default DisplayBoard;