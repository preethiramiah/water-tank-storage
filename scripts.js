const YELLOW = "#f2eb6a";
const BLUE = "#19afe5";
const MAX_ROWS = 10;

const getWaterLevel = (maxValue, blockHeight) => {
  return maxValue >= MAX_ROWS ? (MAX_ROWS / maxValue) * blockHeight : blockHeight;
}

const getWaterBlocks = (maxValue, blockHeight, color) => {
  const maxBlockHeight = Math.min(MAX_ROWS, maxValue + 1);
  const waterBlocks = Array(maxBlockHeight).fill("#fff");
  const waterLevelToCompare = getWaterLevel(maxValue, blockHeight);

  for (let j = 0; j < maxBlockHeight; j++) {
    if (j >= maxBlockHeight - waterLevelToCompare) {
      waterBlocks[j] = color || YELLOW;
    }
  }

  return waterBlocks;
}

const calculateCapacity = (blockHeights) => {
  if (!blockHeights.length) return;

  let totalCapacity = 0;
  let leftBlockHeight = 0;
  const waterHeights = [];
  const maxValue = Math.max(...blockHeights);
  const maxBlockHeight = Math.min(MAX_ROWS, maxValue + 1);

  for (let i = 0; i < blockHeights.length; i++) {
    const waterBlocks = Array(maxBlockHeight).fill("#fff");
    let waterLevelToCompare = getWaterLevel(maxValue, blockHeights[i]);

    if (leftBlockHeight === 0) {
      leftBlockHeight = blockHeights[i];
      waterHeights.push(getWaterBlocks(maxValue, blockHeights[i], YELLOW));
      continue;
    }
    if (blockHeights[i] >= leftBlockHeight) {
      leftBlockHeight = blockHeights[i];
      waterHeights.push(getWaterBlocks(maxValue, blockHeights[i], YELLOW));
    } else {
      const isThereAnyHigherBlock = blockHeights.slice(i).some(height => height >= leftBlockHeight);
      if (isThereAnyHigherBlock) {
        totalCapacity += leftBlockHeight - blockHeights[i];
        for (let j = 0; j < maxBlockHeight; j++) {
          waterLevelToCompare = getWaterLevel(maxValue, leftBlockHeight);
          if (j >= maxBlockHeight - waterLevelToCompare) {
            waterBlocks[j] = BLUE;
          }
          waterLevelToCompare = getWaterLevel(maxValue, blockHeights[i]);
          if (j >= maxBlockHeight - waterLevelToCompare) {
            waterBlocks[j] = YELLOW;
          }
        }
      } else {
        for (let j = 0; j < maxBlockHeight; j++) {
          if (j >= maxBlockHeight - waterLevelToCompare) {
            waterBlocks[j] = YELLOW;
          }
        }
      }
    }
    waterHeights.push(waterBlocks);
  }

  return { totalCapacity, waterHeights };
}

const createSvg = (blockHeights, waterHeights, isOutput) => {
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  const rectWidth = 60;
  const rectHeight = 25;
  const cols = blockHeights.length;
  const maxValue = Math.max(...blockHeights);
  const rows = Math.min(MAX_ROWS, maxValue + 1);
  svg.setAttribute("width", rectWidth * cols);
  svg.setAttribute("height", rectHeight * rows);

  for (let col = 0; col < waterHeights.length; col++) {
    for (let row = 0; row < waterHeights[col].length; row++) {
      const rect = document.createElementNS(svgNS, "rect");
      rect.setAttribute("x", col * rectWidth);
      rect.setAttribute("y", row * rectHeight);
      rect.setAttribute("width", rectWidth);
      rect.setAttribute("height", rectHeight);
      rect.setAttribute("stroke", "#000");
      rect.setAttribute("stroke-width", "1");
      const currentColor = waterHeights?.[col]?.[row] || "#fff";
      const isYellow = currentColor === YELLOW;
      rect.setAttribute("fill", isOutput ? isYellow ? '#fff' : currentColor : currentColor);
      svg.appendChild(rect);
    }
  }

  document.querySelector(isOutput ? "#outputDiv" : "#inputDiv").appendChild(svg);
}

const clearSvgs = () => {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => svg.remove());
}

const showResults = () => {
  clearSvgs();
  document.querySelector('#result').style.visibility = 'hidden';

  const input = document.querySelector('#blocks')?.value;
  if (!input) return;

  document.querySelector('#result').style.visibility = 'visible';
  document.querySelector('#inputValue').innerHTML = `[${input}]`;

  const blockHeights = input.split(',').map(Number);
  const { totalCapacity, waterHeights } = calculateCapacity(blockHeights);
  document.querySelector('#outputValue').innerHTML = `${totalCapacity} units`;
  document.querySelector('footer').style.position = 'relative';
  createSvg(blockHeights, waterHeights, true);
  createSvg(blockHeights, waterHeights);
}

// 0,4,0,0,0,6,0,6,4,0

// 5,4,3,2,1,2,3,4,5

// 0,40,0,0,0,60,0,60,40,0
