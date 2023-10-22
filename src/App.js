import './App.css';
import React, { Component } from 'react';
import DisplayBoards from './DisplayBoards.js'
import AppNav from './AppNav.js'
import { BACKEND_URL } from './util.js'

class App extends Component {

  timer = false

  constructor(props) {
    super(props);
    this.state = {
      serverTime: {
        worldTimeTicks: 0,
        worldTimeSecs: 0,
        checkedAt: Date.now()/1000
      }
    };
  }

  componentDidMount() {
    this.getTime();
  }

  navHandler(selectedItem) {
    let id = selectedItem.target.id
    switch (id) {
      case "nav-display-boards": break;
      case "nav-timetables": break;
      default: break;
    }
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
            console.log("Set world time to " + res.worldTimeSecs + " sec (" + res.worldTimeSecs/3600 + " hr)")
          })
        }
      })
      .catch((r) => console.log("Error: " + r));
  }

  render() {
    console.log("AP " + this.state.serverTime.worldTimeSecs / 3600)
    return (
      <div>
          <AppNav handler={this.navHandler} serverTime={this.state.serverTime}/>
        <div className="mt-6">
          <DisplayBoards serverTime={this.state.serverTime}/>
        </div>
      </div>
    );
  }
}

export default App;
