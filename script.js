import { Player } from "./modules/Player.js"
import { Gameboard } from "./modules/Gameboard.js"
import { Ship } from "./modules/Ship.js"
import { UI } from "./modules/UI.js"

const gameboards = []
gameboards['playerA'] = Gameboard()
gameboards['playerB'] = Gameboard()
const ships = [
  [Ship('Carrier', 5), false],
  [Ship('Battleship', 4), false],
  [Ship('Destroyer', 3), false],
  [Ship('Submarine', 3), false],
  [Ship('Patrol Boat', 2), false],
]

const computerShips = [
  [Ship('Carrier', 5), false],
  [Ship('Battleship', 4), false],
  [Ship('Destroyer', 3), false],
  [Ship('Submarine', 3), false],
  [Ship('Patrol Boat', 2), false],
]

const computerPlacements = [...Array(100).keys()];

computerShips.forEach((ship, index) => {
  const i = -1
  let computerPlacement
  while (true) {
    computerPlacement = Math.floor(Math.random() * computerPlacements.length)
    let x = Math.floor(computerPlacements[computerPlacement] / 10)
    let y = computerPlacements[computerPlacement] % 10
    let isHorizontal = Math.random() < 0.5
    const isPlaced = gameboards['playerB'].placeShip([x, y], ship[0], isHorizontal);
    if (isPlaced) {
      break
    }
  }
  computerPlacements.splice(computerPlacement, 1)
})

UI.initGrids()

UI.renderYourGrid(gameboards['playerA'])
UI.renderComputerGrid(gameboards['playerB'])

const selectShips = document.querySelector('#select-ships')
let selectedShipId = null
selectShips.addEventListener('click', e => {
  let ship = e.target.closest('.ship')
  ships.forEach((vessel, index) => {
    if (!vessel[1]) {
      document.querySelector(`.ship[data-id='${index}'`).removeAttribute('selected')
    }
  })
  selectedShipId = ship.dataset.id
  let selectedShip = ships[selectedShipId][0]
  document.querySelector('#orientation button').innerHTML = `Toggle Orientation of <strong>${selectedShip.getName()}</strong>`
  if (ship !== null && !ship.hasAttribute('selected')) {
    ship.setAttribute('selected', true)
  } else if (ship !== null && ship.hasAttribute('selected')) {
    ship.removeAttribute('placed')
    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 10; y++) {
        if (gameboards['playerA'].getGrid()[x][y][0] === selectedShip) {
          const element = document.querySelector(`.grid-a [data-x='${x}'][data-y='${y}'`)
          element.classList.remove('live-ship')
          element.classList.remove('start-horizontal')
          element.classList.remove('end-horizontal')
          element.classList.remove('start-vertical')
          element.classList.remove('end-vertical')
          element.innerHTML = null
        }
      }
    }
    gameboards['playerA'].removeShip(selectedShip)

    ships.forEach(ship => {
      if (ship[0].getName() === selectedShip.getName()) {
        ship[1] = false
      }
    })
  }
  document.querySelector('#start-game button').classList.add('hide')
  document.querySelector('#orientation').classList.remove('hide')
})

let isHorizontal = true
const orientationButton = document.querySelector('#orientation button')
const orientation = document.querySelector('#orientation > div > div:first-child')

orientationButton.addEventListener('click', () => {
  if (orientationButton.hasAttribute('data-is-horizontal')) {
    orientationButton.removeAttribute('data-is-horizontal')
    orientation.innerHTML = 'Vertical'
    isHorizontal = false
  } else {
    orientationButton.dataset.isHorizontal = true
    orientation.innerHTML = 'Horizontal'
    isHorizontal = true
  }
})

const grid = document.querySelector('.grid-a')

grid.addEventListener('click', e => {
  const x = Number(e.target.dataset.x)
  const y = Number(e.target.dataset.y)

  if (selectedShipId === -1) {
    gameboards['playerA'].removeShip(gameboards['playerA'].getGrid()[x][y][0])
    return
  }

  const selectedShip = ships[selectedShipId][0]
  const canPlaceShip = gameboards['playerA'].placeShip([x, y], selectedShip, isHorizontal)

  if (canPlaceShip) {
    selectedShip.getDamage().forEach((ship, index) => {
      if (isHorizontal) {
        const element = grid.querySelector(`[data-x='${x}'][data-y='${y + index}']`)
        element.innerHTML = selectedShip.getName()[0]
        element.classList.add('live-ship')
        element.classList.remove('place-ship')
        if (index === 0) {
          element.classList.add('start-horizontal')
        } else if (selectedShip.getLength() === index + 1) {
          element.classList.add('end-horizontal')
        }
      } else {
        const element = grid.querySelector(`[data-x='${x + index}'][data-y='${y}']`)
        element.innerHTML = selectedShip.getName()[0]
        element.classList.add('live-ship')
        element.classList.remove('place-ship')

        if (index === 0) {
          element.classList.add('start-vertical')
        } else if (selectedShip.getLength() === index + 1) {
          element.classList.add('end-vertical')
        }
      }
    })
    const element = selectShips.querySelector(`[data-id='${selectedShipId}'`)
    element.setAttribute('placed', true)
    ships[selectedShipId][1] = true
    selectedShipId = null
    document.querySelector('#orientation button').innerHTML = `Toggle Orientation`
    document.querySelector('#orientation').classList.add('hide')
    if (ships.filter(ship => !ship[1]).length === 0) {
      document.querySelector('#start-game button').classList.remove('hide')
    }
  }
})

grid.addEventListener('mouseover', e => {
  if (selectedShipId !== null) {
    const selectedShip = ships[selectedShipId][0]
    const x = Number(e.target.dataset.x)
    const y = Number(e.target.dataset.y)
    document.querySelector([`.grid-a [data-x='${x}'][data-y='${y}']`]).classList.add('place-ship')
    selectedShip.getDamage().forEach((ship, index) => {
      if (isHorizontal) {
        if (y + index < 10) {
          let pointer = document.querySelector([`.grid-a [data-x='${x}'][data-y='${y + index}']`])
          pointer.classList.add('place-ship')
        }
      } else {
        if (x + index < 10) {
          let pointer = document.querySelector([`.grid-a [data-x='${x + index}'][data-y='${y}']`])
          pointer.classList.add('place-ship')
        }
      }
    })
  }
})

grid.addEventListener('mouseout', e => {
  if (selectedShipId !== null) {
    const selectedShip = ships[selectedShipId][0]
    const x = Number(e.target.dataset.x)
    const y = Number(e.target.dataset.y)
    document.querySelector([`.grid-a [data-x='${x}'][data-y='${y}']`]).classList.remove('place-ship')
    selectedShip.getDamage().forEach((ship, index) => {
      if (isHorizontal) {
        if (y + index < 10) {
          let pointer = document.querySelector([`.grid-a [data-x='${x}'][data-y='${y + index}']`])
          pointer.classList.remove('place-ship')
        }
      } else {
        if (x + index < 10) {
          let pointer = document.querySelector([`.grid-a [data-x='${x + index}'][data-y='${y}']`])
          pointer.classList.remove('place-ship')
        }
      }
    })
  }
})

const computerAttacks = [...Array(100).keys()];

const startGame = document.querySelector('#start-game button')
startGame.addEventListener('click', playGame)

function playGame() {
  const yourShips = document.querySelector('.your-ships')
  yourShips.innerHTML = ''
  const div = document.createElement('div')
  div.classList.add('game-alert')
  yourShips.appendChild(div)
  textAlert('You may fire when ready...')

  const gridB = document.querySelector('.grid-b')
  const gridA = document.querySelector('.grid-a')


  gridB.addEventListener('click', battleRound)
}

let isUserTurn = true
let x
let y
let hitShip
let attackSquare

function battleRound(e) {
  if (!isUserTurn)
    return
  if (isUserTurn) {
    x = Number(e.target.dataset.x)
    y = Number(e.target.dataset.y)

    hitShip = gameboards['playerB'].receiveAttack([x, y])

    attackSquare = document.querySelector(`.grid-b [data-x='${x}'][data-y='${y}']`)

    if (hitShip) {
      attackSquare.innerHTML = '<div class="hit"></div>'
      const battleships = [computerShips[0][0], computerShips[1][0], computerShips[2][0], computerShips[3][0], computerShips[4][0]]
      const isYouWon = gameboards['playerB'].isAllSunk(battleships)
      console.log(isYouWon)
      if (isYouWon) {
        textAlert(`You have hit and sunk a ${hitShip.getName()} and victorious in this battle of the sea!`)
        gameOver()
      } else {
        if (hitShip.isSunk()) {
          textAlert(`You have hit and sunk a ${hitShip.getName()}!`)
        } else {
          textAlert(`Hit!`)
        }
        isUserTurn = false
      }
    } else {
      attackSquare.innerHTML = '<div class="miss"></div>'
      textAlert('Missed!')
      isUserTurn = false
    }


    setTimeout(() => {
      if (!isUserTurn) {
        textAlert('The computer is taking aim...')

        setTimeout(() => {
          const computerAttack = Math.floor(Math.random() * computerAttacks.length)
          x = Math.floor(computerAttacks[computerAttack] / 10)
          y = computerAttacks[computerAttack] % 10
          computerAttacks.splice(computerAttack, 1)

          hitShip = gameboards['playerA'].receiveAttack([x, y])

          attackSquare = document.querySelector(`.grid-a [data-x='${x}'][data-y='${y}']`)

          if (hitShip) {
            attackSquare.innerHTML = '<div class="hit"></div>'
            const battleships = [ships[0][0], ships[1][0], ships[2][0], ships[3][0], ships[4][0]]
            const isComputerWon = gameboards['playerB'].isAllSunk(battleships)
            console.log(isComputerWon)

            if (isComputerWon) {
              textAlert(`... and has hit and sunk your ${hitShip.getName()} and is victorious in this battle of the sea!`)
              gameOver()
            } else {
              if (hitShip.isSunk()) {
                textAlert(`... and has hit and sunk your ${hitShip.getName()}!`)
              } else {
                textAlert(`... and hit your ${hitShip.getName()}`)
              }
            }
          } else {
            attackSquare.innerHTML = '<div class="miss"></div>'
            textAlert('... and has missed!')
          }
          isUserTurn = true
        }, 2000)
      }
    }, 2000)
  }
}

function textAlert(message) {
  const gameAlert = document.querySelector('.game-alert')
  gameAlert.innerHTML = message
}

function gameOver() {
  document.querySelector('.grid-b').remove()
  return true
}



