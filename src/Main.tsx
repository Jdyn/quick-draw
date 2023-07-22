import { createContext, useContext } from "react";
import styles from "./Main.module.css";
import Canvas from "./components/Canvas/Canvas";
import { useState } from "react";
import Toolbar from "./components/Toolbar/Toolbar";

import "./assets/global.css";

interface CanvasContext {
  setDrawable: React.Dispatch<React.SetStateAction<boolean>>;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
  setColor: React.Dispatch<React.SetStateAction<string>>;
  tools: [string, React.Dispatch<React.SetStateAction<string>>];
  drawings: [Line[], React.Dispatch<React.SetStateAction<Line[]>>];
	selectedIndex: number;
  selectedColor: string;
}

interface Line {
  tool: string;
  points: Array<number>
  color: string;
}

const Context = createContext<CanvasContext>({
  setDrawable: () => {},
  setIndex: () => {},
	setColor: () => {},
  selectedIndex: 0,
  selectedColor: "black",
  tools: ["", () => {}],
  drawings: [[], () => {}],
});

const Application = () => {
  const tools = useState("pen");
  const drawings = useState<Line[]>([]);

  const [drawable, setDrawable] = useState(false);
  const [selectedIndex, setIndex] = useState(0);
  const [selectedColor, setColor] = useState("black");

  return (
    <main className={styles.root}>
      <Context.Provider
        value={{ setDrawable, setIndex, selectedIndex, selectedColor, setColor, tools, drawings }}
      >
        <Toolbar />
        <Canvas drawable={drawable} />
      </Context.Provider>
    </main>
  );
};

export function useCanvas(): CanvasContext {
  return useContext(Context);
}

export default Application;
