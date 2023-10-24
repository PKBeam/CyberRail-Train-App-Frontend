import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'
import { Dropdown } from 'react-bulma-components'
import { BACKEND_URL } from './util.js'
import TrainLineIcon from './TrainLineIcon.js'

class Timetables extends Component {
  constructor(props) {
    super(props);
    this.state = {lines: [], selectedLine: null};
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
    this.setState({
      selectedLine: e
    })
    console.log(e)
  }

  render() {
    return (
      <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
        <div className="mb-6 mt-6">
          <Dropdown
            icon={<FontAwesomeIcon className="ml-3" icon={faAngleDown} />}
            label={this.state.selectedLine ?? "Select a line"}
            onChange={(e) => this.selectLine(e)}
          >
            {(this.state.lines).map(line =>
              (<Dropdown.Item
                key={"dropdown-" + line.id}
                renderAs="a"
                value={`${line.id} ${line.name} Line`}
                className="py-1"
              >
                <div className="is-flex" style={{alignItems: "center", height: "30px"}}>
                  <TrainLineIcon height="100%" width="30px" borderRadius="3px" fontSize="19px" trainLine={line.id}/>
                  <div className="ml-2" style={{fontSize: "16px"}}>{line.name} Line</div>
                </div>
              </Dropdown.Item>)
            )}
          </Dropdown>
        </div>
      </div>
    );
  }
}

export default Timetables;
