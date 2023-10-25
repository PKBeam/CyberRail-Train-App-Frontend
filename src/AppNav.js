import React, { useState, useEffect } from 'react';
import { Navbar } from 'react-bulma-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock } from '@fortawesome/free-solid-svg-icons'
import { recalculateWorldTime } from './util.js'
function AppNav(props) {
  const [time, setTime] = useState(recalculateWorldTime(props.serverTime.worldTimeSecs, props.serverTime.checkedAt))

  useEffect(() => {
    const interval = setInterval(() => {
      let newTime = recalculateWorldTime(props.serverTime.worldTimeSecs, props.serverTime.checkedAt);
      setTime(newTime)
    }, 1000)
    return () => clearInterval(interval)
  }, [props.serverTime]);


  let timeNowSecs = time
  let timeNowMins = parseInt(timeNowSecs / 60) % 60
  let timeNowMinsPad = String(timeNowMins).padStart(2, "0")
  let timeNowHours = (timeNowSecs / 3600) % 24
  let timeNowHours12 = parseInt(timeNowHours) > 12 ? parseInt(timeNowHours) - 12 : parseInt(timeNowHours)
  let amPm = (parseInt(timeNowHours) >= 12 ? " pm" : " am")

  let timeString = timeNowHours12 + ":" + timeNowMinsPad + amPm
  let timeTicks = parseInt(time/(24*60*60) * 24000)
  return (
    <Navbar className="has-background-grey-dark">
      <Navbar.Brand>
        <b className="navbar-item has-text-light ml-2">CyberRail 🚉</b>
      </Navbar.Brand>
      <Navbar.Item id="nav-network-map" className="has-background-grey-dark has-text-light" onClick={props.parent.navHandler.bind(props.parent)}>
        Network Map
      </Navbar.Item>
      <Navbar.Item id="nav-timetables" className="has-background-grey-dark has-text-light" onClick={props.parent.navHandler.bind(props.parent)}>
        Timetables
      </Navbar.Item>
      <Navbar.Item id="nav-display-boards" className="has-background-grey-dark has-text-light" onClick={props.parent.navHandler.bind(props.parent)}>
        Display Boards
      </Navbar.Item>
      <Navbar.Item id="nav-track-map" className="has-background-grey-dark has-text-light" onClick={props.parent.navHandler.bind(props.parent)}>
        Track Map
      </Navbar.Item>
      <div className="navbar-end">
      <b className="navbar-item has-text-light mr-2"><FontAwesomeIcon className="mr-2" icon={faClock} />
          <div style={{width: "4.2em"}}>{timeString}</div>
          <div style={{width: "6em"}}>({timeTicks} ticks)</div>
        </b>
      </div>
    </Navbar>
  )
}

export default AppNav;


