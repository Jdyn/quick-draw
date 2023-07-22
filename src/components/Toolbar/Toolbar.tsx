import { useCanvas } from "../../Main";
import styles from "./Toolbar.module.css";
import { Cross2Icon, EraserIcon, MoveIcon, Pencil1Icon, ResetIcon } from "@radix-ui/react-icons";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import Picker from "../Picker/Picker";

const Toolbar = () => {
  const {
    setDrawable,
    selectedIndex,
    setIndex,
    selectedColor,
    setColor,
    tools: [_, setTool],
    drawings: [lines, setLines],
  } = useCanvas();

  return (
    <div className={styles.root}>
      <div className={styles.wrapper}>
        <button
          type="button"
          className={`${styles.item} ${selectedIndex === 0 ? styles.selected : ""}`}
          onClick={() => {
            setDrawable(false);
            setIndex(0);
          }}
        >
          <MoveIcon />
        </button>
        <button
          type="button"
          className={`${styles.item} ${selectedIndex === 1 ? styles.selected : ""}`}
          onClick={() => {
            setDrawable(true);
            setIndex(1);
            setTool("pen");
          }}
          style={{
            background: selectedIndex === 1 ? selectedColor : "transparent",
            color: selectedIndex === 1 ? "white" : "black",
          }}
        >
          <Pencil1Icon />
        </button>
        <button
          type="button"
          className={`${styles.item} ${selectedIndex === 2 ? styles.selected : ""}`}
          onClick={() => {
            setDrawable(true);
            setTool("eraser");
            setIndex(2);
          }}
        >
          <EraserIcon />
        </button>
        <button
          type="button"
          className={styles.item}
          onClick={() => {
            setLines((prev) => prev.slice(0, lines.length - 1));
          }}
        >
          <ResetIcon />
        </button>
      </div>
      <div className={styles.wrapper}>
        <div className={styles.color} onClick={() => setColor("black")} />
        <Picker onClick={(color) => setColor(color)} defaultColor="red" />
        <Picker onClick={(color) => setColor(color)} defaultColor="blue" />
      </div>
      <div className={styles.wrapper}>
        <AlertDialog.Root>
          <AlertDialog.Trigger className={styles.item}>
            <Cross2Icon />
          </AlertDialog.Trigger>
          <AlertDialog.Portal>
            <AlertDialog.Overlay className={styles.overlay} />
            <AlertDialog.Content className={styles.dialog}>
              <div>
                <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
                <AlertDialog.Description>
                  This action will permanently delete your drawing.
                </AlertDialog.Description>
                <div className={styles.buttons}>
                  <AlertDialog.Action
                    className={styles.action}
                    onClick={() => {
                      setLines([]);
                    }}
                  >
                    Yes, delete drawing.
                  </AlertDialog.Action>
                  <AlertDialog.Cancel
                    className={styles.action}
                    style={{ background: "var(--red-10)", color: "white" }}
                  >
                    cancel
                  </AlertDialog.Cancel>
                </div>
              </div>
            </AlertDialog.Content>
          </AlertDialog.Portal>
        </AlertDialog.Root>
      </div>
    </div>
  );
};

export default Toolbar;
