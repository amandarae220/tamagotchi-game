# Angular Tamagotchi Proper

A clean Angular 17 standalone project with two animated pixel pets.

## Included

- Two pets:
  - **Bloop** (blob pet)
  - **Miso** (cat pet)
- Per-pet needs:
  - feed
  - bathe
  - nap
  - play
- Per-pet mood states:
  - happy
  - neutral
  - sad
- Sprite animations:
  - idle wiggle
  - blink
  - eating
  - sleeping
- Proper Angular CLI workspace structure

## Run in VS Code

Open the folder in VS Code, then in the integrated terminal run:

```bash
npm install
npm start
```

Open:

```text
http://localhost:4200
```

## Build for production

```bash
npm run build
```

## Project structure

```text
src/app/
  app.component.ts
  app.config.ts
  pet.config.ts
  pet.types.ts
  pet.utils.ts
  pet-sprites.ts
```
