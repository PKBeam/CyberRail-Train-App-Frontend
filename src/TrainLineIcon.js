import React, { useState, useEffect, useRef } from 'react';
import { Box } from 'react-bulma-components'
import './DisplayBoard.css'

function TrainLineIcon(props) {
  const boxRef = useRef(null)
  const [boxStyle, setBoxStyle] = useState({height: props.height})

  useEffect(() => {
    setBoxStyle({height: boxStyle.height, width: (props.width !== null) ? props.width : boxRef.current.clientHeight + "px"})
  }, []);

  useEffect(() => {
    if (props.width == null) {
      let boxHeight = boxRef.current.clientHeight
      if (boxStyle.width !== boxHeight + "px") {
        setBoxStyle({width: boxHeight + "px"})
      }
    }
  }, [boxStyle]);

  return (
    <div style={boxStyle} ref={boxRef}>
      <Box style={{height: "100%", padding: "5%", borderStyle: props.border, borderRadius: props.borderRadius, borderColor: "white"}} className={"has-text-centered m-0 line-" + props.trainLine}>
        <div style={{color: "white", textShadow: "1px 1px 2px darkslategray", fontSize: props.fontSize, fontWeight: "600"}} className="has-text-white m-0 p-0">{props.trainLine}</div>
      </Box>
    </div>
  );
}

export default TrainLineIcon;
