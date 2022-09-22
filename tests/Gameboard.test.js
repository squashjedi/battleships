import { Gameboard } from '../modules/Gameboard'
import { Ship } from '../modules/Ship'

test('getGrid() returns a 1 x 1 grid', () => {
  const gameboard = Gameboard(1)

  expect(gameboard.getGrid()).toEqual([
    [[null, null, false]]
  ])
})

test('Gameboard(3).getGrid() returns a 3 x 3 grid', () => {
  const gameboard = Gameboard(3)

  expect(gameboard.getGrid()).toEqual([
    [[null, null, false], [null, null, false], [null, null, false]],
    [[null, null, false], [null, null, false], [null, null, false]],
    [[null, null, false], [null, null, false], [null, null, false]],
  ])
})

test('Can place a patrolBoat at position [0, 0] horizontally', () => {
  const gameboard = Gameboard(3)
  const patrolBoat = Ship('Patrol Boat', 2)
  gameboard.placeShip([0, 0], patrolBoat, true)

  expect(gameboard.getGrid()).toEqual([
    [[patrolBoat, 0, false], [patrolBoat, 1, false], [null, null, false]],
    [[null, null, false], [null, null, false], [null, null, false]],
    [[null, null, false], [null, null, false], [null, null, false]],
  ])
})

test('Can place a submarine at position [2, 0] vertically', () => {
  const gameboard = Gameboard(3)
  const patrolBoat = Ship('Patrol Boat', 2)
  gameboard.placeShip([0, 0], patrolBoat, true)
  const submarine = Ship('Submarine', 3)
  gameboard.placeShip([0, 2], submarine, false)

  expect(gameboard.getGrid()).toEqual([
    [[patrolBoat, 0, false], [patrolBoat, 1, false], [submarine, 0, false]],
    [[null, null, false], [null, null, false], [submarine, 1, false]],
    [[null, null, false], [null, null, false], [submarine, 2, false]]
  ])
})

test('Can remove a submarine', () => {
  const gameboard = Gameboard(3)
  const patrolBoat = Ship('Patrol Boat', 2)
  gameboard.placeShip([0, 0], patrolBoat, true)
  const submarine = Ship('Submarine', 3)
  gameboard.placeShip([0, 2], submarine, false)
  gameboard.removeShip(submarine)

  expect(gameboard.getGrid()).toEqual([
    [[patrolBoat, 0, false], [patrolBoat, 1, false], [null, null, false]],
    [[null, null, false], [null, null, false], [null, null, false]],
    [[null, null, false], [null, null, false], [null, null, false]]
  ])
})

test('Can place a submarine at position [0, 1] vertically', () => {
  const gameboard = Gameboard(3)
  const submarine = Ship('Submarine', 3)
  gameboard.placeShip([0, 1], submarine, false)

  expect(gameboard.getGrid()).toEqual([
    [[null, null, false], [submarine, 0, false], [null, null, false]],
    [[null, null, false], [submarine, 1, false], [null, null, false]],
    [[null, null, false], [submarine, 2, false], [null, null, false]],
  ])
})

test('Cannot place a patrolBoat on an empty grid at position [0, 2] horizontally', () => {
  const gameboard = Gameboard(3)
  const patrolBoat = Ship('Patrol Boat', 2)
  gameboard.placeShip([0, 2], patrolBoat, true)

  expect(gameboard.getGrid()).toEqual([
    [[null, null, false], [null, null, false], [null, null, false]],
    [[null, null, false], [null, null, false], [null, null, false]],
    [[null, null, false], [null, null, false], [null, null, false]],
  ])
})

test('Cannot place a patrolBoat on an empty grid at position [2, 0] vertically', () => {
  const gameboard = Gameboard(3)
  const patrolBoat = Ship('Patrol Boat', 2)
  gameboard.placeShip([2, 0], patrolBoat, false)

  expect(gameboard.getGrid()).toEqual([
    [[null, null, false], [null, null, false], [null, null, false]],
    [[null, null, false], [null, null, false], [null, null, false]],
    [[null, null, false], [null, null, false], [null, null, false]],
  ])
})

test('Cannot place a patrolBoat over another ship at position [0, 0] horizontally', () => {
  const gameboard = Gameboard(3)
  const submarine = Ship('Submarine', 3)
  gameboard.placeShip([0, 1], submarine, false)
  const patrolBoat = Ship('Patrol Boat', 2)
  gameboard.placeShip([0, 0], patrolBoat, true)

  expect(gameboard.getGrid()).toEqual([
    [[null, null, false], [submarine, 0, false], [null, null, false]],
    [[null, null, false], [submarine, 1, false], [null, null, false]],
    [[null, null, false], [submarine, 2, false], [null, null, false]],
  ])
})

test('Cannot place a patrolBoat over another ship at position [0, 0] vertically', () => {
  const gameboard = Gameboard(3)
  const submarine = Ship('Submarine', 3)
  gameboard.placeShip([1, 0], submarine, true)
  const patrolBoat = Ship('Patrol Boat', 2)
  gameboard.placeShip([2, 2], patrolBoat, false)

  expect(gameboard.getGrid()).toEqual([
    [[null, null, false], [null, null, false], [null, null, false]],
    [[submarine, 0, false], [submarine, 1, false], [submarine, 2, false]],
    [[null, null, false], [null, null, false], [null, null, false]],
  ])
})

test('Fire a missile that hits a ship and updates gameboard', () => {
  const gameboard = Gameboard(3)
  const submarine = Ship('Submarine', 3)
  gameboard.placeShip([1, 0], submarine, true)
  gameboard.receiveAttack([1, 1])

  expect(gameboard.getGrid()).toEqual([
    [[null, null, false], [null, null, false], [null, null, false]],
    [[submarine, 0, false], [submarine, 1, true], [submarine, 2, false]],
    [[null, null, false], [null, null, false], [null, null, false]],
  ])
})

test('Fire a missile that hits a ship and updates the ships damage', () => {
  const gameboard = Gameboard(3)
  const submarine = Ship('Submarine', 3)
  gameboard.placeShip([1, 0], submarine, true)
  expect(submarine.getDamage()).toEqual([false, false, false])
  gameboard.receiveAttack([1, 1])

  expect(submarine.getDamage()).toEqual([false, true, false])
})

test('Fire a missile that misses a ship and updates the gameboard', () => {
  const gameboard = Gameboard(3)
  const submarine = Ship('Submarine', 3)
  gameboard.placeShip([1, 0], submarine, true)
  expect(submarine.getDamage()).toEqual([false, false, false])
  gameboard.receiveAttack([0, 2])

  expect(submarine.getDamage()).toEqual([false, false, false])
  expect(gameboard.getGrid()).toEqual([
    [[null, null, false], [null, null, false], [null, null, true]],
    [[submarine, 0, false], [submarine, 1, false], [submarine, 2, false]],
    [[null, null, false], [null, null, false], [null, null, false]],
  ])
})

test('isAllSunk(ships) returns false if all ship have not been sunk', () => {
  const submarine = Ship('Submarine', 3)
  const patrolBoat = Ship('Patrol Boat', 2)

  const ships = [submarine, patrolBoat]

  const gameboard = Gameboard(3)

  expect(gameboard.isAllSunk(ships)).toBeFalsy()
})

test('isAllSunk(ships) returns true if all ships have been sunk', () => {
  const patrolBoat = Ship('Patrol Boat', 2)
  const submarine = Ship('Submarine', 3)
  const ships = [submarine, patrolBoat]

  const gameboard = Gameboard(3)
  gameboard.placeShip([0, 0], patrolBoat, true)
  gameboard.placeShip([0, 2], submarine, false)
  gameboard.receiveAttack([0, 0])
  gameboard.receiveAttack([0, 1])
  gameboard.receiveAttack([0, 2])
  gameboard.receiveAttack([1, 2])
  gameboard.receiveAttack([2, 2])

  expect(gameboard.isAllSunk(ships)).toBeTruthy()
})