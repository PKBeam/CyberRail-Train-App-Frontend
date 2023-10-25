import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'
import { Dropdown } from 'react-bulma-components'
import { BACKEND_URL, addHoursToTime, timeSecsFromString } from './util.js'
import TrainLineIcon from './TrainLineIcon.js'
import './Timetables.css';

class Timetables extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lines: [],
      selectedLine: null,
      selectedLineSchedules: []
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
    this.setState({
      selectedLine: this.state.lines.filter((l) => l.id === lineId)[0]
    })
    fetch(BACKEND_URL + "/api/schedules/line/" + lineId)
      .then((response) => response.json())
      .then((json) => this.setState({selectedLineSchedules: json}))
      .catch((r) => console.log(r));
  }

  renderTimetable(lineStations) {
    let schedules = []
    scheduleLoop: for (let i = 0; i < this.state.selectedLineSchedules.length; i++) {
      let thisSchedule = this.state.selectedLineSchedules[i]
      for (let j = 0; j < 24/thisSchedule.intervalHours; j++) {
        schedules.push([thisSchedule.train])
        lineStations.forEach(() => {schedules[schedules.length - 1].push(null)})
        let n = -1
        for (let k = 0; k < thisSchedule.stops.length; k++) {
          let thisStop = thisSchedule.stops[k]
          //console.log(n, thisStop.stationName)
          let index = lineStations.findIndex((s, i) =>
            s.name === thisStop.stationName && i > n
          )

          // this schedule is in the wrong direction of travel
          if (index == -1) {
            // reset and try next
            schedules.pop()
            continue scheduleLoop
          }
          n = index
          schedules[schedules.length - 1][index + 1] = addHoursToTime(j * thisSchedule.intervalHours, thisStop.time)
        }
      }
    }
    // sort
    if (schedules.length <= 1) {
      return null
    }
    let mostSharedStopIndex = 0
    let mostSharedStopCount = 0

    for (let i = 0; i < lineStations.length; i++) {
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

    // take transpose
    schedules = schedules[0].map((col, i) => schedules.map(row => row[i]));
    return schedules //{head: headRow, body: bodyRows}
  }

  render() {
    let lineStations = []

    this.state.selectedLine?.stations.map((stations, i) => {
      stations.map((station, j) => {
        lineStations.push(station)
      })
    })

    let lineStationsReversed = lineStations.slice().reverse()

    let stationLists = [lineStations, lineStationsReversed]
    let timetables = [this.renderTimetable(lineStations), this.renderTimetable(lineStationsReversed)]
    let timetablesEmpty = (timetables[0] ?? timetables[1]) === null
    return (
      <div className="timetable-root">
        <div className="mb-6 mt-6">
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
        {this.state.selectedLine && <div className="table-container has-background-white-ter">
          {!timetablesEmpty && timetables.map((t, i) => <table className="table is-bordered is-hoverable is-striped has-sticky-header has-sticky-column">
            <thead>
              <tr>
                <th className="has-background-grey-lighter"></th>
                {t[0].map((x, i) => <th key={"header-" + i} className="has-background-grey-lighter">{x}</th>)}
              </tr>
            </thead>
            <tbody>
              {stationLists[i].map((stn, j) =>
                <tr>
                  <th className="py-1">{stn.isInterchange && <b>{stn.name}</b>}{!stn.isInterchange && <p>{stn.name}</p>}</th>
                    {t[j + 1].map((row, i) =>
                      <td className="px-0 py-1" key={"station-name-" + i + "-" + j}>{row}</td>
                    )}
                </tr>
              )}
            </tbody>
          </table>)}
        </div>}
      </div>
    );
  }
}

export default Timetables;
