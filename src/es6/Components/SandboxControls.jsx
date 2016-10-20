import Inferno from "inferno";

export const SandboxControls = ({ handleIterationLess, handleIterationMore, handleTerrainChange, regenerateMap, terrainIteration, terrainTypes, hoveredCoords }) => (
  <div className="sandbox-controls">
    <ul>
      <li><a href="#" onClick={ handleIterationLess }>Less</a></li>
      <li className="iteration-count">{ terrainIteration }</li>
      <li><a href="#" onClick={ handleIterationMore }>More</a></li>
    </ul>
    <button onClick={ regenerateMap }>Re-generate</button>
    <select name="terrain-type" onChange={ handleTerrainChange }>
      { terrainTypes.map(terrain => <option value={ terrain } >{ terrain }</option>) }
    </select>
    <div className="coords-hover">x: {hoveredCoords[0]}, y: {hoveredCoords[1]}</div>
  </div>
);