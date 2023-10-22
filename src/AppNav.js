import React, { useState, useEffect } from 'react';
import { Navbar } from 'react-bulma-components'
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
  let timeNowHours = (timeNowSecs / 3600)
  let timeNowHours12 = parseInt(timeNowHours) > 12 ? parseInt(timeNowHours) - 12 : parseInt(timeNowHours)
  let amPm = (parseInt(timeNowHours) >= 12 ? " pm" : " am")

  let timeString = timeNowHours12 + ":" + timeNowMinsPad + amPm
  
  return (
    <Navbar className="has-background-grey-dark">
      <Navbar.Brand>
        <b className="navbar-item has-text-light ml-2">sab.gg train app 🚉</b>
      </Navbar.Brand>
      <Navbar.Item id="nav-display-boards" className="has-background-grey-dark has-text-light" onClick={props.handler}>
        Display Boards
      </Navbar.Item>
      {/*<Navbar.Item id="nav-timetables" className="has-background-grey-dark has-text-light" onClick={props.handler}>
        Timetables
      </Navbar.Item>*/}
      <div className="navbar-end">
        <b className="navbar-item has-text-light mr-2">🕐 {timeString}</b>
      </div>
    </Navbar>
  )
}

export default AppNav;

