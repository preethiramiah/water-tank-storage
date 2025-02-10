const calculateCapacity = (blockHeights) => {
  if (!blockHeights.length) return;

  let totalCapacity = 0;
  let leftBlockHeight = 0;
  let trappedWaterHeight = 0;
  let trappedEmptyBlocks = 0;
  const waterHeights = []; // To render output svg

  for (let i = 0; i < blockHeights.length; i++) {
    if (blockHeights[i] > 0) {
      waterHeights.push(0);
      if (leftBlockHeight > 0) {
        trappedWaterHeight = Math.min(leftBlockHeight, blockHeights[i]);
        leftBlockHeight = blockHeights[i];
      } else {
        leftBlockHeight = blockHeights[i];
      }
    } else {
      if (leftBlockHeight > 0) {
        trappedEmptyBlocks++;
        const rightBlock = blockHeights.slice(i).find(h => h > 0);
        if (rightBlock > 0) waterHeights.push(Math.min(leftBlockHeight, rightBlock));
        else waterHeights.push(0);
      } else {
        waterHeights.push(0);
      }      
    }

    if (trappedWaterHeight > 0) {
      totalCapacity += trappedWaterHeight * trappedEmptyBlocks;
      trappedEmptyBlocks = 0;
      trappedWaterHeight = 0;
    }
  }

  return { totalCapacity, waterHeights };
}

const YELLOW = "#f2eb6a";
const BLUE = "#19afe5";

const createSvg = (blockHeights, waterHeights, isOutput) => {
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  const rectWidth = 60;
  const rectHeight = 25;
  const cols = blockHeights.length;
  const maxValue = Math.max(...blockHeights);
  const rows = Math.min(10, maxValue + 1);
  svg.setAttribute("width", rectWidth * cols);
  svg.setAttribute("height", rectHeight * rows);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const rect = document.createElementNS(svgNS, "rect");
      rect.setAttribute("x", col * rectWidth);
      rect.setAttribute("y", row * rectHeight);
      rect.setAttribute("width", rectWidth);
      rect.setAttribute("height", rectHeight);
      rect.setAttribute("stroke", "#000");
      rect.setAttribute("stroke-width", "1");

      let fillColor = "#fff";
      const height = isOutput ? waterHeights[col] : blockHeights[col] || waterHeights[col];
      const blockHeight = maxValue >= 10 ? (10 / maxValue) * height : height;
      if (blockHeight > 0 && rows - blockHeight <= row) {
        fillColor = isOutput ? BLUE : waterHeights[col] ? BLUE : YELLOW;
      }

      rect.setAttribute("fill", fillColor);
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
  createSvg(blockHeights, waterHeights, true);

  createSvg(blockHeights, waterHeights);
  document.querySelector('#outputValue').innerHTML = `${totalCapacity} units`;
  document.querySelector('footer').style.position = 'relative';
}

// 0,4,0,0,0,6,0,6,4,0

// 0,40,0,0,0,60,0,60,40,0
