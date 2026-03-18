export interface PetDefinition {
  id: string
  name: string
  basePath: string
}

export const PETS: PetDefinition[] = [
  {
    id: 'duck',
    name: 'Pip',
    basePath: 'assets/pets/duck'
  },
  {
    id: 'dog',
    name: 'Pebble',
    basePath: 'assets/pets/dog'
  }
]