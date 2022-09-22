export function Gameboard(width = 10) {
  const grid = []
  for (let x = 0; x < width; x++) {
    grid[x] = []
    for (let y = 0; y < width; y++) {
      grid[x][y] = [null, null, false]
    }
  }

  const getGrid = () => {
    return grid
  }
  const getWidth = () => {
    return width
  }
  const setSquare = ([x, y], ship, index) => {
    grid[x][y] = [ship, index, false]
  }
  const placeShip = ([x, y], ship, isHorizontal = true) => {
    if (doesntFit(ship, [x, y], isHorizontal)) {
      return false
    }
    isHorizontal
      ? ship.getDamage().forEach((square, index) => setSquare([x, y + index], ship, index))
      : ship.getDamage().forEach((square, index) => setSquare([x + index, y], ship, index))

    return true
  }

  const removeShip = (ship) => {
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < width; y++) {
        if (grid[x][y][0] === ship) {
          grid[x][y] = [null, null, false]
        }
      }
    }
  }

  const receiveAttack = ([x, y]) => {
    const square = grid[x][y]
    square[2] = true
    if (square[0] !== null) {
      const ship = square[0]
      ship.hit(square[1])
      return ship
    }
    return false
  }

  const isAllSunk = (ships) => {
    return ships.filter(ship => ship.isSunk()).length === ships.length
  }

  const doesntFit = (ship, [x, y], isHorizontal) => {
    const doesntFitHorizontally =
      isHorizontal &&
      (ship.getLength() + y > getWidth() ||
        ship.getDamage().filter((square, index) => grid[x][y + index][0] !== null).length > 0)
    const doesntFitVertically =
      !isHorizontal &&
      (ship.getLength() + x > getWidth() ||
        ship.getDamage().filter((square, index) => grid[x + index][y][0] !== null).length > 0)

    return doesntFitHorizontally || doesntFitVertically
  }

  return {
    getGrid,
    getWidth,
    setSquare,
    placeShip,
    removeShip,
    receiveAttack,
    isAllSunk
  }
}