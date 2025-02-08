const calculateCapacity = (blockHeights) => {
  if (!blockHeights.length) return;

  let totalCapacity = 0;
  let leftBlockHeight = 0;
  let blockHeight = 0;
  let emptyBlocks = 0;
  for (let i = 0; i < blockHeights.length; i++) {
    if (blockHeights[i] > 0) {
      if (leftBlockHeight > 0) {
        blockHeight = Math.min(leftBlockHeight, blockHeights[i]);
        leftBlockHeight = blockHeights[i];
      } else {
        leftBlockHeight = blockHeights[i];
      }
    }
    else {
      if (leftBlockHeight > 0) {
        emptyBlocks++;
      }
    }

    if (blockHeight > 0) {
      totalCapacity += blockHeight * emptyBlocks;
      emptyBlocks = 0;
      blockHeight = 0;
    }
  }
  document.querySelector('#outputValue').innerHTML = `${totalCapacity} units`;
}

const showResults = () => {
  const input = document.querySelector('#blocks')?.value;
  if (!input) return;

  document.querySelector('#result').style.visibility = 'visible';
  document.querySelector('#inputValue').innerHTML = `[${input}]`;
  const blockHeights = input.split(',').map(Number);
  calculateCapacity(blockHeights);
}
