export const BACKEND_URL = "https://api.mc.moguserver.space"

export function recalculateWorldTime(refTime, timestamp) {
  return refTime + 72 * (Date.now()/1000 - timestamp)
}

export const trainSchedule = [
  {
    platform: 1,
    line: "H3",
    type: "Limited stops",
    dest: "Ender's Reach",
    via: "Tesco Central",
    time: 0,
    cars: 2,
    stops: [
      {name: "Devondale", isIntx: false},
      {name: "Colby River", isIntx: false},
      {name: "Jarlsberg Junction", isIntx: true},
      {name: "Westacre Lake North", isIntx: false},
      {name: "Asda Crossing", isIntx: false},
      {name: "Sainsbury Farm", isIntx: true},
      {name: "Tesco Central", isIntx: true},
      {name: "Wungus Waterway", isIntx: false},
      {name: "Blackstone", isIntx: false},
      {name: "Ender's Reach", isIntx: true}

    ],
    nextTrains: [
      {
        line: "H3",
        type: "All stops",
        dest: "Tesco Central",
        via: "Jarlsberg Junction",
        time: 0,
      },
      {
        line: "H3",
        type: "Limited stops",
        dest: "Tesco Central",
        via: "Jarlsberg Junction",
        time: 0,
      }
    ]
  },
  {
    platform: 2,
    line: "H3",
    type: "All stops",
    dest: "Sabine's Base",
    via: null,
    time: 0,
    cars: 2,
    stops: [
      {name: "Sabine's Base", isIntx: true},
    ],
    nextTrains: [
      {
        line: "H3",
        type: "All stops",
        dest: "Sabine's Base",
        via: null,
        time: 0,
      },
      {
        line: "H3",
        type: "All stops",
        dest: "Sabine's Base",
        via: null,
        time: 0,
      }
    ]
  },
  {
    platform: 3,
    line: "H7",
    type: "All stops",
    dest: "Remano Heights",
    via: "Stirling",
    time: 0,
    cars: 2,
    stops: [
      {name: "Hydale", isIntx: false},
      {name: "Broad Oak", isIntx: false},
      {name: "Stirling", isIntx: true},
      {name: "Ocean Rise", isIntx: false},
      {name: "Mantovani", isIntx: false},
      {name: "Remano Heights", isIntx: true},
    ],
    nextTrains: [
      {
        line: "H7",
        type: "Express service",
        dest: "Tesco Central",
        via: "Stirling",
        time: 0,
      },
      {
        line: "H7",
        type: "All stops",
        dest: "Remano Heights",
        via: "Stirling",
        time: 0,
      }
    ]
  },
  {
    platform: 4,
    line: "H7",
    type: "",
    dest: "Terminating service",
    via: null,
    time: 0,
    cars: 2,
    stops: [
    ],
    nextTrains: [
      {
        line: "H7",
        type: "All stops",
        dest: "Sabine's Base",
        via: null,
        time: 0,
      },
      {
        line: "H7",
        type: "All stops",
        dest: "Terminating service",
        via: null,
        time: 0,
      }
    ]
  }
]

export default trainSchedule;
