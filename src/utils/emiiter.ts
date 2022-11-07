import mitt from "mitt";
const emitter = mitt();

export const EMITTER_EVENTS = {
  TOGGLE_SIDE_BAR: "TOGGLE_SIDE_BAR"
};
export default emitter;
