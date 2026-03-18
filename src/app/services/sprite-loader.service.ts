import { Injectable } from "@angular/core"

@Injectable({ providedIn: 'root' })
export class SpriteLoaderService {

  loadSprite(path: string): Promise<HTMLImageElement> {
    return new Promise(resolve => {
      const img = new Image()

      img.onload = () => resolve(img)
      img.src = path
    })
  }

}