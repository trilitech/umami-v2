// Taken from https://github.com/doke-v/react-identicons
// the library is unmaintained, but it's a simple component
// and will stop working with the next major React release
import md5 from "md5";
import React, { useEffect, useRef } from "react";

type Props = {
  count?: number;
  background: string;
  size: number;
  string: string;
};

export const ReactIdenticon: React.FC<Props> = React.memo(
  ({ count = 5, background, string, size }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
      updateCanvas();
    });

    const updateCanvas = () => {
      const hash = md5(string);
      const block = Math.floor(size / count);
      const hashcolor = hash.slice(0, 6);

      const canvas = canvasRef.current!;

      canvas.width = block * count;
      canvas.height = block * count;
      const arr = hash
        .split("")
        .map(el => parseInt(el, 16))
        .map(n => (n < 8 ? 0 : 1));

      const map = [];

      map[0] = map[4] = arr.slice(0, 5);
      map[1] = map[3] = arr.slice(5, 10);
      map[2] = arr.slice(10, 15);

      const ctx = canvas.getContext("2d")!;
      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      map.forEach((row, i) => {
        row.forEach((el, j) => {
          if (el) {
            ctx.fillStyle = "#" + hashcolor;
            ctx.fillRect(block * i, block * j, block, block);
          } else {
            ctx.fillStyle = background;
            ctx.fillRect(block * i, block * j, block, block);
          }
        });
      });
    };

    return <canvas ref={canvasRef} style={{ width: size, height: size }} />;
  }
);
