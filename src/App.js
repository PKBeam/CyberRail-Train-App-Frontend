import './App.css';
import React, { Component } from 'react';
import NetworkMap from './NetworkMap.js'
import DisplayBoards from './DisplayBoards.js'
import AppNav from './AppNav.js'
import { BACKEND_URL } from './util.js'

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      serverTime: {
        worldTimeTicks: 0,
        worldTimeSecs: 0,
        checkedAt: Date.now()/1000,
        selectedItem: "nav-network-map",
        networkMap: ""
      }
    };
  }

  componentDidMount() {
    this.navHandler({target: {id: "nav-network-map"}})
    this.getTime();
  }

  navHandler(selectedItem) {
    this.setState({
      selectedItem: selectedItem.target.id
    })
  }

  getTime() {
    fetch(BACKEND_URL + "/api/worldtime")
      .then((response) => response.json())
      .then((res) => {
        clearInterval(this.timer)

        // error: try again sooner
        if (res.error) {
          console.log("Could not set world time.")
          this.timer = setInterval(() => {
            this.getTime();
          }, 10000)
        // no error: wait a while
        } else {
          this.timer = setInterval(() => {
            this.getTime();
          }, 60000)
          this.setState({serverTime: res}, () => {
            console.log("[INFO] Set world time to " + res.worldTimeSecs + " sec (" + res.worldTimeSecs/3600 + " hr)")
          })
        }
      })
      .catch((r) => console.log("Error: " + r));
  }

  render() {
    return (
      <div className="dark">
          <AppNav parent={this} serverTime={this.state.serverTime}/>
        <div className="dark">
          {this.state.selectedItem === "nav-display-boards" && <DisplayBoards serverTime={this.state.serverTime}/>}

          {this.state.selectedItem === "nav-network-map" && <NetworkMap />}
        </div>
      </div>
    );
  }
}

export default App;
