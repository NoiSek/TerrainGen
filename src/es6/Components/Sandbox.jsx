import Inferno from "inferno";
import Component from "inferno-component";

import Terrains from "../Terrains/Terrains";

import { SandboxControls } from "./SandboxControls";
import { SandboxOptions } from "./SandboxOptions";

const TERRAINS = Terrains();

export default class Sandbox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      "terrainType": "cave",
      "options": {},
      "map": [],
      "terrainTypes": [],
      "hoveredCoords": [0, 0]
    };
  }

  componentWillMount() {
    let defaultOptions = TERRAINS[this.state.terrainType].options;

    // Set defaults, generate map.
    this.setState({
      "map": this.generateMap(defaultOptions),
      "options": defaultOptions,
      "terrainTypes": Object.keys(TERRAINS)
    });
  }

  printCoords(event) {
    let x = event.target.getAttribute('data-x');
    let y = event.target.getAttribute('data-y');

    this.setState({
      "hoveredCoords": [x, y]
    });
  }

  generateMap(options) {
    return TERRAINS[this.state.terrainType].generate(options);
  }

  getMap() {
    let cellMap = this.state.map;

    // Iterate 'n' times
    for (let i = 0; i < this.state.options.iterations; i++) {
      cellMap = this.iterateMap(cellMap);
    }

    let tileMap = cellMap.map((row, y) => {
      let cells = row.map((cell, x) =>
        <span
          className={ `cell-${this.state.terrainType}-${TERRAINS[this.state.terrainType]['tiles'][cell]}` }
          data-x={ x }
          data-y={ y }
          onClick={ this.printCoords.bind(this) }
        />
      );

      return (
        <div className="cell-row">
          { cells }
        </div>
      );
    });

    return tileMap;
  }

  iterateMap(cellMap) {
    return TERRAINS[this.state.terrainType].iterate(this.state.options, cellMap);
  }

  regenerateMap() {
    this.setState({
      "map": this.generateMap(this.state.options)
    });
  }

  handleIterationChange(direction) {
    let options = this.state.options;
    let terrainIteration = (direction === "less") ? this.state.options.iterations - 1 : this.state.options.iterations + 1;
    options.iterations = Math.max(0, terrainIteration);

    this.setState({ "options": options });
  }

  handleOptionsInput(event) {
    event.preventDefault();

    let options = this.state.options;
    let newOption = event.target.value;

    if (event.target.name === "size") {
      let [x, y] = newOption.split(',');
      newOption = [Number(x), Number(y)];
    }

    options[event.target.name] = newOption;

    this.setState({
      "options": options
    });

    this.regenerateMap();
  }

  handleTerrainChange(event) {
    event.preventDefault();

    this.setState({
      "terrainType": event.target.value,
      "options": TERRAINS[event.target.value]['options']
    });

    this.regenerateMap();
  }

  render() {
    let map = this.getMap();

    return (
      <div className="content-wrapper">
        <div className='cell-map'>{ map }</div>
        <SandboxControls
          terrainIteration={ this.state.options.iterations }
          handleIterationLess={ this.handleIterationChange.bind(this, 'less') }
          handleIterationMore={ this.handleIterationChange.bind(this, 'more') }
          handleTerrainChange={ this.handleTerrainChange.bind(this) }
          hoveredCoords={ this.state.hoveredCoords }
          regenerateMap={ this.regenerateMap.bind(this) }
          terrainTypes={ this.state.terrainTypes }
        />
        <div className="terrain-notes">Notes: { TERRAINS[this.state.terrainType]['description'] }</div>
        <SandboxOptions options={ this.state.options } handleOptionsInput={ this.handleOptionsInput.bind(this) } />
      </div>
    );
  }
}