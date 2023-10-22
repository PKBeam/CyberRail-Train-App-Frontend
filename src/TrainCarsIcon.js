import React from 'react';
import { Box } from 'react-bulma-components'
import './DisplayBoard.css'

function TrainCarsIcon(props) {
  return (
    <Box style={{height: "60px", width: "60px", borderWidth: "2px", borderStyle: "solid"}} className="has-text-centered p-0 mt-1">
      <b style={{fontSize: "28px"}} className="has-text-dark">{props.trainCars}</b>
      <br/>
      <p style={{fontSize: "18px", lineHeight: "0px"}} className=" has-text-dark">cars</p>
    </Box>
  )
}

export default TrainCarsIcon;

