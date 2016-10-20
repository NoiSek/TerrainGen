import * as utils from "../Utils/Utilities.js";

export function generate(options) {
  let [width, height] = options.size;
  let cellMap = [];

  // Prepare empty map
  for (let i = 0; i < height; i++) {
    cellMap.push(new Array(width).fill(0));
  }

  // Seed with cells. Enforce an exact fill percentage, with no overlap.
  let cellsToFill = Math.round(options.fillPercentage * (width * height));
  let cells = utils.shuffleArray([...Array(width*height).keys()]).slice(0, cellsToFill);

  for (let i of cells) {
    let x = Math.floor( i / width);
    let y = i % width;

    cellMap[x][y] = 1;
  }

  return cellMap;
}

export function iterate(options, cellMap) {
  let newMap = cellMap.map((row, row_index) => {
    return row.map((cell, cell_index) => {
      let neighbors = [];

      if (row_index !== 0) {
        let aboveRow = cellMap[row_index - 1].slice(cell_index - 1, cell_index + 2);
        neighbors = [...aboveRow];
      }

      let currentRow = cellMap[row_index].slice(cell_index - 1, cell_index + 2);
      neighbors = [...neighbors, ...currentRow];

      if (cellMap[row_index + 1] !== undefined) {
        let lastRow = cellMap[row_index + 1].slice(cell_index - 1, cell_index + 2);
        neighbors = [...neighbors, ...lastRow];
      }

      // A cell with N adjacent walls (including itself) becomes a wall.
      let wallCount = neighbors.filter(_cell => _cell === 1).length;
      return (wallCount >= options.minimumNeighbors) ? 1 : 0;
    });
  });

  return newMap;
}

export const API = {
  "generate": generate,
  "iterate":  iterate,
  "description": "Seed with N amount of cells. Normalize by converting cells based on how many neighbors they have.",
  "options": {
    "fillPercentage": 0.37,
    "minimumNeighbors": 4,
    "iterations": 4,
    "size": [80, 50]
  },
  "tiles": {
    "0": "wall",
    "1": "ground"
  }
};