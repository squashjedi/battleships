export const UI = (() => {
  const initGrids = () => {
    const gridA = document.querySelector('.grid-a')
    const gridB = document.querySelector('.grid-b')
    initGrid(gridA)
    initGrid(gridB)
  }

  const renderYourGrid = (gameboard) => {
    const uiSquares = document.querySelectorAll('.grid-a > div')
    const grid = gameboard.getGrid()

    uiSquares.forEach((square, index) => {
      const x = Math.floor(index / 10)
      const y = index % 10

      if (grid[x][y][0] !== null) {
        square.classList.add('vessel')
      }
    })
  }

  const renderComputerGrid = (gameboard) => {
    const uiSquares = document.querySelectorAll('.grid-b > div')
    const grid = gameboard.getGrid()

    uiSquares.forEach((square, index) => {
      const x = Math.floor(index / 10)
      const y = index % 10

      if (grid[x][y][0] !== null) {
        square.classList.add('vessel')
      }
    })
  }

  const initGrid = (grid) => {
    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 10; y++) {
        const div = document.createElement('div')
        div.dataset.x = x
        div.dataset.y = y
        grid.appendChild(div)
      }
    }
  }

  return {
    initGrids,
    renderYourGrid,
    renderComputerGrid,
  }
})()