export function Ship(name, length) {
  const damage = Array(length).fill(false)

  const getName = () => {
    return name
  }

  const getLength = () => {
    return length
  }

  const getDamage = () => {
    return damage
  }

  const hit = (index) => {
    getDamage()[index] = true
  }

  const isSunk = () => {
    return getDamage().filter(isHit => isHit).length === getLength()
      ? true
      : false
  }

  const getId = () => {
    return getName()[0]
  }

  return {
    getName,
    getLength,
    getDamage,
    hit,
    isSunk,
    getId
  }
}