import React from 'react';

function TrackMapEmbed(props) {
  return (
    <div className="p-6" style={{width: "100vw", height: "95vh"}}>
        <iframe title="track-map" src="http://mc.sab.gg:3876" style={{width: "100%", height: "100%", borderRadius: "15px"}}/>
    </div>
  )
}

export default TrackMapEmbed;


