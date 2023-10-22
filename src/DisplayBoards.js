import React, { Component } from 'react';
import DisplayBoard from './DisplayBoard.js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'
import { Dropdown, Container } from 'react-bulma-components'
import { recalculateWorldTime, BACKEND_URL} from './util.js'

class DisplayBoards extends Component {
  constructor(props) {
    super(props);
    this.state = {
      serverTime: props.serverTime,
      selectedStation: null,
      selectedStationId: null,
      stationSchedule: [],
      stationPlatformSchedule: [],
      stations: []
    };
  }

  static getDerivedStateFromProps(props, state) {
    return {
      serverTime: props.serverTime
    }
  }

  componentDidMount() {
    this.setState({interval: setInterval(() => {
      if (this.state.selectedStationId != null) {
        this.processNextTrains(this.state.stationSchedule)
      }
    }, 1000)})
    this.getStations();
  }

  componentWillUnmount() {
    clearInterval(this.state.interval)
  }

  updateSelectedStation(newValue) {
    let [stationId, stationName] = newValue.split("-")
    this.setState({selectedStation: stationName, selectedStationId: stationId})
    fetch(BACKEND_URL + "/api/schedules/" + stationId)
      .then((response) => response.json())
      .then((json) => this.setState({stationSchedule: json}, () => this.processNextTrains(this.state.stationSchedule)))
      .catch((r) => console.log(r));
  }

  processNextTrains(schedule) {
    if (schedule.nextTrains == null) {
      return
    }
    let worldTime = recalculateWorldTime(this.state.serverTime.worldTimeSecs, this.state.serverTime.checkedAt)
    let schedules = []
    for (let i = 0; i <= schedule.platforms; i++) {
      schedules.push([])
    }

    // reorder schedule to start from next train
    if (schedule.nextTrains.length > 0) {

      while (worldTime > schedule.nextTrains[0].time) {
        schedule.nextTrains.push(schedule.nextTrains.shift(1))
      }
      schedule.nextTrains.forEach((train) => {
        schedules[train.platform].push(train)
      })
    }
    this.setState({stationPlatformSchedule: schedules})
  }

  getStations() {
    fetch(BACKEND_URL + "/api/stations")
      .then((response) => response.json())
      .then((json) => this.setState({stations: json}))
      .catch((r) => console.log(r));
  }

  render() {
    return (
      <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
        <div className="mb-6" >
          <Dropdown
            icon={<FontAwesomeIcon className="ml-3" icon={faAngleDown} />}
            label={this.state.selectedStation ?? "Select a station"}
            onChange={i => this.updateSelectedStation(i)}
          >

          {this.state.stations.map(station =>
            (<Dropdown.Item
              key={"dropdown-" + station.id}
              renderAs="a"
              value={station.id + "-" + station.name}
            >
              <div className="is-flex" style={{alignItems: "baseline"}}>
                <div className="pr-2" style={{fontFamily: "andale mono"}}>{station.code}</div>
                <div>{station.name}</div>
              </div>
            </Dropdown.Item>)
          )}

          </Dropdown>
        </div>
        {this.state.selectedStation && <div className="p-5 has-background-grey-dark" style={{
          margin: "0",
          borderRadius: "15px",
          width: "90%",
          overflow: "auto",
          boxShadow: "inset 0 0 10px black",
          position: "relative",
          zIndex: "2"
        }}>
          <div style={{display: "flex"}} className="m-0">
            {this.state.stationPlatformSchedule.map((schedule, i) =>
              i > 0 &&
              (<div id={"disp-board-plat-" + i} key={"disp-board-plat-" + i} className={"mr-5"}><DisplayBoard serverTime={this.state.serverTime} schedule={schedule} platform={i}/></div>)
            )}
          <Container className="p-1"></Container>
          </div>
        </div>}
      </div>
    );
  }
}

export default DisplayBoards;
