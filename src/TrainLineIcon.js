import React, { useState, useEffect, useRef } from 'react';
import { Box } from 'react-bulma-components'
import './DisplayBoard.css'

function TrainLineIcon(props) {
  const boxRef = useRef(null)
  const [boxStyle, setBoxStyle] = useState({height: props.height})

  useEffect(() => {
    let newBoxStyle = {...boxStyle}
    newBoxStyle.width = boxRef.current.clientHeight + "px"
    setBoxStyle(newBoxStyle)
  }, [boxStyle]);

  return (
    <div style={boxStyle} ref={boxRef}>
    <Box style={{height: "100%", padding: "10%"}}className={"has-text-centered m-0 line-" + props.trainLine}>
      <div style={{color: "white", fontSize: props.fontSize, fontWeight: "600"}} className="has-text-white m-0 p-0">{props.trainLine}</div>
    </Box>
    </div>
  );
}

export default TrainLineIcon;
