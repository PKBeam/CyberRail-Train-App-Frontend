import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'
import { Dropdown, Container, Form } from 'react-bulma-components'
import { recalculateWorldTime, BACKEND_URL} from './util.js'
import TrainLineIcon from './TrainLineIcon.js'
import DisplayBoard from './DisplayBoard.js'

class DisplayBoards extends Component {
  constructor(props) {
    super(props);
    this.state = {
      serverTime: props.serverTime,
      selectedStation: null,
      selectedStationId: null,
      stationSchedule: [],
      stationPlatformSchedule: [],
      stations: [],
      lines: [],
      searchMatchStations: null
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
    this.getLines();
  }

  componentWillUnmount() {
    clearInterval(this.state.interval)
  }

  updateSelectedStation(newValue) {
    let [stationId, stationName] = newValue.split("-")
    this.setState({selectedStation: stationName, selectedStationId: stationId})
    fetch(BACKEND_URL + "/api/schedules/station/" + stationId)
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

  getLines() {
    fetch(BACKEND_URL + "/api/lines")
      .then((response) => response.json())
      .then((json) => this.setState({lines: json}))
      .catch((r) => console.log(r));
  }

  search(e) {
    let query = e.target.value.trim().toUpperCase()
    if (query !== "") {
      let match = []
      this.state.stations.forEach((s) => {
        if (s.name.toUpperCase().includes(query) || s.code.includes(query)) {
          match.push(s)
        }
      })
      this.setState({searchMatchStations: match})
    } else {
      this.setState({searchMatchStations: null})
    }
  }

  render() {
    return (
      <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
        <div className="mb-6 mt-6" >
          <Dropdown
            icon={<FontAwesomeIcon className="ml-3" icon={faAngleDown} />}
            label={this.state.selectedStation ?? "Select a station"}
            onChange={i => this.updateSelectedStation(i)}
          >
            <div className="py-0 px-1">
              <Form.Input placeholder="Search by name or code..." className="m-2" style={{maxWidth: "95%"}} onChange={(e) => this.search(e)}/>
            </div>
            <Dropdown.Divider />
            {(this.state.searchMatchStations ?? this.state.stations).map(station =>
              (<Dropdown.Item
                key={"dropdown-" + station.id}
                renderAs="a"
                value={station.id + "-" + station.name}
              >
                <div className="is-flex" style={{alignItems: "baseline"}}>

                  <div className="mr-1">{station.name}</div>
                  {this.state.lines.map(l =>
                    (l.stations.find(ss => ss.find(s => s.name === station.name &&
                    ((l.id[0] == "L" && station.code[0] == "X") || (l.id[0] != "L" && station.code[0] != "X"))

                    ))) && <div  className="ml-1"><TrainLineIcon height="100%" width="25px" borderRadius="3px" fontSize="15px" trainLine={l.id}/></div>
                  )}

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
              (<div id={"disp-board-plat-" + i} key={"disp-board-plat-" + i} className={"mr-5"}><DisplayBoard  serverTime={this.state.serverTime} schedule={schedule} lines={this.state.lines} platform={i}/></div>)
            )}
          <Container className="p-1"></Container>
          </div>
        </div>}
      </div>
    );
  }
}

export default DisplayBoards;
