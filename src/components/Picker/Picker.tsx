import { useState } from "react";
import { SketchPicker, } from "react-color";
import styles from "./Picker.module.css";

interface Props {
  onClick: (color: string) => void;
  defaultColor: string;
}

const Picker = ({ onClick, defaultColor }: Props) => {
  const [showPicker, setPicker] = useState(false);
  const [color, setColor] = useState(defaultColor);

  return (
    <div>
      <button
        className={styles.item}
        onClick={() => {
          setPicker((prev) => !prev);
          onClick(color);
        }}
      >
        <div
          className={styles.color}
          style={{
            background: color,
          }}
        />
      </button>
      {showPicker ? (
        <div className={styles.popover}>
          <div className={styles.cover} onClick={() => setPicker((prev) => !prev)} />
          <SketchPicker
            color={color}
            onChangeComplete={(color) => {
              setColor(color.hex);
              onClick(color.hex);
            }}
          />
        </div>
      ) : null}
    </div>
  );
};

export default Picker;
