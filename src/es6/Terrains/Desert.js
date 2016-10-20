import * as utils from "../Utils/Utilities.js";

export function generate(options) {
  let cellMap = [];
  let [width, height] = options.size;

  // Prepare empty map
  for (let i = 0; i < height; i++) {
    cellMap.push(new Array(width).fill(0));
  }

  // Generate N plateaus.
  let plateauCount = Math.min(utils.randomRange(options.minPlateauCount, options.maxPlateauCount), options.maxPlateauCount);
  let maxArea = (width * height) * options.maxPlateauArea;
  let minArea = (width * height) * options.minPlateauArea;

  for (let i = 0; i < plateauCount; i++) {
    // Find the center of our plateau. Limit-bias towards middle-ish ranges.
    let x = utils.randomRange(
      Math.floor((width * 0.05)),
      Math.floor((width * 0.95))
    );

    let y = utils.randomRange(
      Math.floor((width * 0.05)),
      Math.floor((width * 0.95))
    );

    // Generate a width. make sure it is no wider than N% of the map.
    let pWidth = Math.floor(utils.randomRange(3, width * options.maxPlateauArea));
    let heightLimit = Math.floor(maxArea / pWidth);
    let minHeight = pWidth * (1 - options.maxPlateauRatioDifference);
    let maxHeight = pWidth * (1 + options.maxPlateauRatioDifference);
    let pHeight = Math.min(utils.randomRange(minHeight, maxHeight), heightLimit);

    // Ensure we don't have ultra skinny plateaus.
    pHeight = Math.floor(Math.max(pHeight, 3));

    // Normalize our fill position to the top left (x, y) coords of the plateau.
    x = Math.max(x - Math.floor(pWidth / 2), 0);
    y = Math.max(y - Math.floor(pHeight / 2), 0);

    let newMap = cellMap;

    // Fill cells. What the fuck is this honestly
    for (let _i = 0; _i < pHeight; _i++) {
      if (y + _i < height) {
        cellMap[y + _i].map((e, i) => {
          if ((i > x) && (i <= (x + pWidth))) {
            newMap[y + _i][i] = 1;
          }
        });
      }
    }

    // With N% chance, generate a second tier of elevation (peaks).
    if (Math.random() < options.peakChance) {
      let peakWidth = Math.floor(utils.randomRange(pWidth * 0.4, pWidth * 0.8));
      let peakHeight = Math.floor(utils.randomRange(pWidth * 0.3, pHeight * 0.7));

      let peakX = x + utils.randomRange(0, (pWidth - peakWidth));
      let peakY = y + utils.randomRange(0, (pHeight - peakHeight));

      // Fill peak cells.
      for (let _i = 0; _i < peakHeight; _i++) {
        if (peakY + _i < height) {
          cellMap[peakY + _i].map((e, i) => {
            if((i >= peakX) && (i <= (peakX + peakWidth))) {
              newMap[peakY + _i][i] = 2;
            }
          });
        }
      }
    }

    cellMap = newMap;
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
      // A cell with N adjacent peaks becomes a peak, with priority going to peaks first.
      let wallCount = neighbors.filter(_cell => _cell === 1).length;
      let peakCount = neighbors.filter(_cell => _cell === 2).length;

      if (peakCount >= options.minimumNeighbors) {
        return 2;
      }
      return (wallCount >= options.minimumNeighbors) ? 1 : 0;
    });
  });

  return newMap;
}

export const API = {
  "generate": generate,
  "iterate":  iterate,
  "description": "Plateau area defined as percentage of map size.",
  "options": {
    "minimumNeighbors": 3,
    "maxPlateauArea": 0.2,
    "minPlateauArea": 0.05,
    "minPlateauCount": 10,
    "maxPlateauCount": 25,
    "maxPlateauRatioDifference": 0.2,
    "peakChance": 0.5,
    "iterations": 5,
    "size": [50, 50]
  },
  "tiles": {
    "0": "ground",
    "1": "plateau",
    "2": "peak",
    "3": "stairs"
  }
};