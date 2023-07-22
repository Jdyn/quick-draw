import { useEffect, useRef } from "react";
import styles from "./Canvas.module.css";
import { useSpring, animated } from "@react-spring/web";
import { createUseGesture, dragAction, pinchAction } from "@use-gesture/react";
import { useCanvas } from "../../Main";
import { DownloadIcon, HomeIcon } from "@radix-ui/react-icons";
import { Layer, Line, Stage } from "react-konva";
import download from "../../lib/download";
import useDimensions from "react-cool-dimensions";
const useGesture = createUseGesture([dragAction, pinchAction]);

interface Props {
  drawable: boolean;
}

const Canvas = ({ drawable }: Props) => {
  const {
    drawings: [lines, setLines],
    tools: [tool],
    selectedColor,
  } = useCanvas();

  const [style, api] = useSpring(() => ({
    x: 0,
    y: 0,
    scale: 1,
    rotateZ: 0,
  }));

  const ref = useRef<HTMLDivElement | null>(null);
  const isDrawing = useRef(false);
  const stageRef = useRef<any | null>(null);

  const { observe, width, height } = useDimensions({
    // onResize: ({ observe, unobserve, width, height, entry }) => {
    //   // Triggered whenever the size of the target is changed...
    //   unobserve(); // To stop observing the current target element
    //   observe(); // To re-start observing the current target element
    // },
  });

  const handleMouseDown = (e: any) => {
    if (drawable) {
      isDrawing.current = true;
      const pos = e.target.getStage().getPointerPosition();
      setLines([...lines, { tool, points: [pos.x, pos.y], color: selectedColor }]);
    }
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing.current) return;

    const point = e?.target?.getStage()?.getPointerPosition() || null;
    if (!point) return;

    let lastLine = lines[lines.length - 1];

    // add point
    lastLine.points = lastLine.points.concat([point.x, point.y]);

    // replace last
    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  useEffect(() => {
    const handler = (e: Event) => e.preventDefault();
    document.addEventListener("gesturestart", handler);
    document.addEventListener("gesturechange", handler);
    document.addEventListener("gestureend", handler);
    return () => {
      document.removeEventListener("gesturestart", handler);
      document.removeEventListener("gesturechange", handler);
      document.removeEventListener("gestureend", handler);
    };
  }, []);

  // From documentation
  useGesture(
    {
      onDrag: ({ pinching, cancel, offset: [x, y] }) => {
        if (pinching) return cancel();
        api.start({ x, y });
      },
      onPinch: ({ origin: [ox, oy], first, movement: [ms], offset: [s, a], memo }) => {
        if (first) {
          const { width, height, x, y } = ref.current!.getBoundingClientRect();
          const tx = ox - (x + width / 2);
          const ty = oy - (y + height / 2);
          memo = [style.x.get(), style.y.get(), tx, ty, width, height];
        }

        const x = memo[0] - (ms - 1) * memo[2];
        const y = memo[1] - (ms - 1) * memo[3];
        api.start({
          scale: s,
          rotateZ: a,
          x: x,
          y: y,
          // width: memo[4] * s,
          // height: memo[5] * s,
        });
        return memo;
      },
    },
    {
      target: ref,
      drag: { pointer: { buttons: [4, 1] }, from: () => [style.x.get(), style.y.get()] },
      pinch: { scaleBounds: { min: 0.5, max: 2 }, rubberband: true },
      enabled: !drawable,
    }
  );

  return (
    <>
      <div className={styles.topBar}>
        <button
          className={styles.home}
          onClick={() => {
            api.start({ x: 0, y: 0, scale: 1, rotateZ: 0 });
          }}
        >
          <HomeIcon />
        </button>
      </div>
      <button
        className={styles.save}
        onClick={() => {
          if (stageRef.current) {
            const dataURL = stageRef.current.toDataURL();
            download(dataURL, "canvas.png");
          }
        }}
      >
        <DownloadIcon />
      </button>
      <animated.div
        className={styles.canvas}
        style={style}
        ref={(el) => {
          observe(el);
          ref.current = el;
        }}
      >
        <Stage
          ref={stageRef}
          width={width}
          height={height}
          onMouseDown={handleMouseDown}
          onMousemove={handleMouseMove}
          onMouseup={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleMouseUp}
        >
          <Layer style={{ background: "white" }}>
            {lines.map((line, i) => (
              <Line
                key={i}
                points={line.points}
                stroke={line.color}
                strokeWidth={5}
                tension={0}
                lineCap="round"
                globalCompositeOperation={
                  line.tool === "eraser" ? "destination-out" : "source-over"
                }
              />
            ))}
          </Layer>
        </Stage>
      </animated.div>
    </>
  );
};

export default Canvas;
