import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'
import { Dropdown, Form } from 'react-bulma-components'
import { BACKEND_URL, addHoursToTime, timeSecsFromString, convert24hTo12h } from './util.js'
import TrainLineIcon from './TrainLineIcon.js'
import './Timetables.css';

class Timetables extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lines: [],
      selectedLine: null,
      selectedLineSchedules: [],
      use12Hour: false
    };
  }

  componentDidMount() {
    this.getLines();
  }

  getLines() {
    fetch(BACKEND_URL + "/api/lines")
      .then((response) => response.json())
      .then((json) => this.setState({lines: json}))
      .catch((r) => console.log(r));
  }

  selectLine(e) {
    let lineId = e.slice(0, 2)
    fetch(BACKEND_URL + "/api/schedules/line/" + lineId)
      .then((response) => response.json())
      .then((json) => this.setState({
        selectedLine: this.state.lines.filter((l) => l.id === lineId)[0],
        selectedLineSchedules: json
      }))
      .catch((r) => console.log(r));
  }

  getTermini() {
    let termini = [[], []]
    for (let i = 0; i < this.state.selectedLine?.stations.length; i++) {
      let stations = this.state.selectedLine?.stations[i]
      if (i > 0 && stations.length <= 1) {
        break;
      }
      termini[0].push(stations[0].name)
    }
    for (let i = this.state.selectedLine?.stations.length - 1; i >= 0; i--) {
      let stations = this.state.selectedLine?.stations[i]
      if (i < this.state.selectedLine?.stations.length - 1 && stations.length <= 1) {
        break;
      }
      termini[1].push(stations.at(-1).name)
    }
    return termini
  }

  renderTimetable(lineStations) {
    let schedules = []
    let addEmpty = () => {schedules[schedules.length - 1].push(null)}
    scheduleLoop: for (let i = 0; i < this.state.selectedLineSchedules.length; i++) {
      let thisSchedule = this.state.selectedLineSchedules[i]
      
      for (let j = 0; j < 24/thisSchedule.intervalHours; j++) {
        schedules.push([thisSchedule.train])
        lineStations.forEach(addEmpty)
        let n = -1
        for (let k = 0; k < thisSchedule.stops.length; k++) {
          let thisStop = thisSchedule.stops[k]
          //console.log(n, thisStop.stationName)
          let N = n
          let index = lineStations.findIndex((s, i) =>
            s.name === thisStop.stationName && i > N
          )

          // this schedule is in the wrong direction of travel
          if (index === -1) {
            // reset and try next
            schedules.pop()
            continue scheduleLoop
          }
          n = index
          let time = addHoursToTime(j * thisSchedule.intervalHours, thisStop.time, this.state.use12Hour)
          schedules[schedules.length - 1][index + 1] = time
        }
      }
    }
    // sort
    if (schedules.length <= 1) {
      return null
    }
    let mostSharedStopIndex = 0
    let mostSharedStopCount = 0

    for (let i = 0; i <= lineStations.length; i++) {
      let N = 0
      for (let j = 0; j < schedules.length; j++) {
        N += (schedules[j][i + 1] != null)
      }
      if (mostSharedStopCount < N) {
        mostSharedStopCount = N
        mostSharedStopIndex = i
      }
    }

    schedules = schedules.sort((s1, s2) => {
      return timeSecsFromString(
        s1[mostSharedStopIndex + 1] ?? "00:00") - timeSecsFromString(s2[mostSharedStopIndex + 1] ?? "00:00"
      )
    })

    // apply 12hr time
    if (this.state.use12Hour) {
      for (let i = 0; i < schedules.length; i++) {
        let firstTime = schedules[i].slice(1).find(t => t != null)
        schedules[i][0] = (parseInt(firstTime.split(":")[0]) >= 12) ? "pm" : "am"
        for (let j = 1; j <= lineStations.length; j++) {
          schedules[i][j] = schedules[i][j] != null && convert24hTo12h(schedules[i][j])
        }
      }
    }

    // take transpose
    schedules = schedules[0].map((col, i) => schedules.map(row => row[i]));
    return schedules //{head: headRow, body: bodyRows}
  }

  render() {
    let lineStations = []

    this.state.selectedLine?.stations.map((stations, i) =>
      stations.map((station, j) =>
        lineStations.push(station)
      )
    )
    let termini = this.getTermini()
    let terminiList = [termini, termini.slice().reverse()]
    let lineStationsReversed = lineStations.slice().reverse()
    let stationLists = [lineStations, lineStationsReversed]
    let timetables = [this.renderTimetable(lineStations), this.renderTimetable(lineStationsReversed)]
    
    return (
      <div className="timetable-root">
        <div className="mb-6 mt-6 is-flex-direction-column">
          <div>
            <Dropdown
              icon={<FontAwesomeIcon className="ml-3" icon={faAngleDown} />}
              label={(this.state.selectedLine && `${this.state.selectedLine.id} ${this.state.selectedLine.name} Line`) ?? "Select a line"}
              onChange={(e) => this.selectLine(e)}
            >
              {(this.state.lines).map(line =>
                (<Dropdown.Item
                  key={"dropdown-" + line.id}
                  renderAs="a"
                  value={`${line.id} ${line.name} Line`}
                  className="py-1"
                >
                  <div className="train-line-entry is-flex">
                    <TrainLineIcon height="100%" width="30px" borderRadius="3px" fontSize="19px" trainLine={line.id}/>
                    <div className="ml-2">{line.name} Line</div>
                  </div>
                </Dropdown.Item>)
              )}
            </Dropdown>
          </div>
          {this.state.selectedLine && <Form.Checkbox onClick={() => this.setState({use12Hour: !this.state.use12Hour})} className="mt-2 has-text-light" >Use 12-hour time</Form.Checkbox>}
        </div>
        {this.state.selectedLine && <div className="table-container has-background-white-ter">
          {[0, 1].map((t, i) =>
            <div key={`div1-${i}`}>
              <div key={`div2-${i}`}className="is-flex py-3 px-3">
                <TrainLineIcon key={`icon-${i}`} border="solid" height="100%" width="37px" borderRadius="7px" fontSize="19px" trainLine={this.state.selectedLine.id}/>
                <div key={`div3-${i}`} className="route-description ml-2">
                <b key={`b1-${i}`}>{terminiList[i][0][0]}</b>
                {terminiList[i][0].length > 1 && " or "}
                {terminiList[i][0].length > 1 && <b key={`b2-${i}`}>{terminiList[i][0].at(-1)}</b>}
                {" to "}
                <b key={`b3-${i}`}>{terminiList[i][1][0]}</b>
                {terminiList[i][1].length > 1 && " or "}
                {terminiList[i][1].length > 1 && <b key={`b4-${i}`}>{terminiList[i][1].at(-1)}</b>}
                {this.state.selectedLine.keyStations[0] && " via "}
                <b key={`b5-${i}`}>{this.state.selectedLine.keyStations[0] && this.state.selectedLine.keyStations[0].name}</b></div>
              </div>
              {timetables[i] && <table key={`table-${i}`} className="table is-bordered is-hoverable is-striped has-sticky-header has-sticky-column">
                <thead key={`thead-${i}`}>
                  <tr key={`tr-${i}`}>
                    <th key={`thead-th-${i}`} className="has-background-grey-lighter"></th>
                    {timetables[i][0].map((x, j) => <th key={`th-${i}-${j}`} className={"has-background-grey-lighter " + ((this.state.use12Hour) ? "am-pm-display" : "train-display")}>{x}</th>)}
                  </tr>
                </thead>
                <tbody key={`tbody-${i}`}>
                  {stationLists[i].map((stn, j) =>
                    <tr key={`tr-${i}-${j}`}>
                      <th key={`tbody-tr-${i}-${j}`} className="py-1">
                        {stn.isInterchange && <b key={`tbody-b-${i}-${j}`}>{stn.name}</b>}
                        {!stn.isInterchange && <p key={`tbody-p-${i}-${j}`}>{stn.name}</p>}
                      </th>
                        {timetables[i][j + 1].map((row, k) =>
                          <td className="px-0 py-1" key={`station-name-${i}-${j}-${k}`}>{row}</td>
                        )}
                    </tr>
                  )}
                </tbody>
              </table>}
              {!timetables[i] && <div className="ml-4 mb-3">No scheduled services</div>}
            </div>)}
          <div className="my-4"/>
        </div>}
      </div>
    );
  }
}

export default Timetables;
