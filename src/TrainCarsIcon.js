import React from 'react';
import { Box } from 'react-bulma-components'
import './DisplayBoard.css'

function TrainCarsIcon(props) {
  return (
    <Box style={{height: "60px", width: "60px", borderWidth: "2px", borderStyle: "solid", boxShadow: "0px 0px 3px dimgray"}} className="has-text-centered p-0 mt-1">
      <p style={{fontSize: "12px", fontWeight: "300"}} className=" has-text-dark">{props.trainName}</p>
      <b style={{fontSize: "24px", lineHeight: "1em"}} className="has-text-dark">{props.trainCars}</b>
      <p style={{fontSize: "12px", lineHeight: "0.5em"}} className="has-text-dark">car{props.trainCars > 1 && "s"}</p>
    </Box>
  )
}

export default TrainCarsIcon;

