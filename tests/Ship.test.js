import { Ship } from "../modules/Ship"

test('getName() returns the name of the ship', () => {
  expect(Ship('Battleship', 4).getName()).toEqual('Battleship')
})

test('getLength() returns the length of the ship', () => {
  expect(Ship('Battleship', 4).getLength()).toEqual(4)
})

test('hit(1) updates submarine damage to [false, true, false]" when previously unhit', () => {
  const submarine = Ship('Submarine', 3)
  submarine.hit(1)

  expect(submarine.getDamage()).toEqual([false, true, false])
})

test('hit(3), hit(4), hit(1), hit(0) updates carrier damage to [true, true, false, true, true] when previous damage was [true, true, false, false, true]', () => {
  const carrier = Ship('carrier', 5)
  carrier.hit(3)
  carrier.hit(4)
  carrier.hit(1)
  carrier.hit(0)

  expect(carrier.getDamage()).toEqual([true, true, false, true, true])
})

test('hit(1), hit(0) updates destroyer isSunk to be true', () => {
  const destroyer = Ship('Destroyer', 2)
  destroyer.hit(1)
  destroyer.hit(0)

  expect(destroyer.isSunk()).toBeTruthy()
})

test('hit(1) updates destroyer isSunk to be false', () => {
  const destroyer = Ship('Destroyer', 2)
  destroyer.hit(1)

  expect(destroyer.isSunk()).toBeFalsy()
})

test('getId returns "C" when ship is "Cruiser"', () => {
  const cruiser = Ship('Cruiser', 4)

  expect(cruiser.getId()).toEqual('C')
})