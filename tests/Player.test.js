import { Player } from '../modules/Player'

test('name is Paul', () => {
  const playerA = Player('Paul')

  expect(playerA.name).toEqual('Paul')
})