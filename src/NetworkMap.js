import React, { useEffect, useState } from 'react';
import networkmap from './networkmap.svg'

function NetworkMap(props) {
  let [map, setMap] = useState("")
  let [zoom, setZoom] = useState(1)

  useEffect(() => {
    fetch(networkmap)
      .then(r => r.text())
      .then(text => {
        text = text.replace(
          `<svg width="5873" height="3947" viewBox="0 0 5873 3947"`,
          `<svg width="5873" height="3947" viewBox="0 0 5873 3947" style="width: ${100 * zoom}%; height: auto; min-width: 1000px"`
        )
        setMap(text);
      });
  }, [zoom])

  return (
    <div className="p-6" style={{display: "flex", justifyContent: "center"}}>
      {map !== "" && <div style={{position: "relative", height: "0", width: "0", top: "1rem", left: "1rem"}}>
        <div className="has-background-dark has-text-light" style={{lineHeight: "50px", textAlign: "center", fontSize: "50px", width: "50px", height: "50px", borderRadius: "15px"}} onClick={() => setZoom(Math.min(10, zoom + 0.1))}>+</div>
        <div className="mt-2 has-background-dark has-text-light" style={{lineHeight: "50px", textAlign: "center", fontSize: "50px", width: "50px", height: "50px", borderRadius: "15px"}} onClick={() => setZoom(Math.max(1, zoom - 0.1))}>-</div>
      </div>}
      <div style={{width: "100%", height: "87vh", overflow: "scroll", borderRadius: "20px"}} dangerouslySetInnerHTML={{__html: map}}/>
    </div>
  );
}

export default NetworkMap;
