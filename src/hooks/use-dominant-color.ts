
import { useState, useEffect } from 'react';

export function useDominantColor(imageUrl: string | undefined) {
  const [color, setColor] = useState<string>('15, 15, 15'); // Default dark gray

  useEffect(() => {
    if (!imageUrl) return;

    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = imageUrl;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = 100; // Small size for performance
      canvas.height = 100;
      ctx.drawImage(img, 0, 0, 100, 100);

      const imageData = ctx.getImageData(0, 0, 100, 100).data;
      let r = 0, g = 0, b = 0;

      // Sample every 4th pixel for speed
      for (let i = 0; i < imageData.length; i += 16) {
        r += imageData[i];
        g += imageData[i + 1];
        b += imageData[i + 2];
      }

      const count = imageData.length / 16;
      r = Math.floor(r / count);
      g = Math.floor(g / count);
      b = Math.floor(b / count);

      // Boost saturation slightly for better aesthetic
      const saturationBoost = 1.2;
      r = Math.min(255, Math.floor(r * saturationBoost));
      g = Math.min(255, Math.floor(g * saturationBoost));
      b = Math.min(255, Math.floor(b * saturationBoost));

      setColor(`${r}, ${g}, ${b}`);
    };
  }, [imageUrl]);

  return color;
}
