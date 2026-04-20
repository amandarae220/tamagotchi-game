import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SpriteLoaderService {
  private readonly spriteCache = new Map<string, Promise<HTMLImageElement>>();

  loadSprite(path: string): Promise<HTMLImageElement> {
    const cached = this.spriteCache.get(path);
    if (cached) {
      return cached;
    }

    const request = new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();

      img.onload = () => resolve(img);
      img.onerror = () => {
        this.spriteCache.delete(path);
        reject(new Error(`Failed to load sprite: ${path}`));
      };
      img.src = path;
    });

    this.spriteCache.set(path, request);
    return request;
  }
}
