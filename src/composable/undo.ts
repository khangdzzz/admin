import { onMounted, onUnmounted } from "vue";

function pressUndo(event): boolean {
  return event.ctrlKey && event.key === "z";
}

// by convention, composable function names start with "use"
export function useUndo(callback): (event) => void {
  // state encapsulated and managed by the composable

  // a composable can update its managed state over time.
  function handleUndo(event): void {
    if (pressUndo(event)) {
      callback();
    }
  }

  // a composable can also hook into its owner component's
  // lifecycle to setup and teardown side effects.
  onMounted(() => window.addEventListener("keydown", handleUndo));
  onUnmounted(() => window.removeEventListener("keydown", handleUndo));

  // expose managed state as return value
  return handleUndo;
}
