<template>
  <div class="relative">
    <ol-map
      class="w-full h-full"
      :loadTilesWhileAnimating="true"
      :loadTilesWhileInteracting="true"
      ref="map"
    >
      <ol-view
        ref="view"
        :center="center"
        :rotation="rotation"
        :zoom="zoom"
        :projection="projection"
      />

      <ol-tile-layer>
        <ol-source-osm />
      </ol-tile-layer>

      <ol-vector-layer>
        <ol-source-vector>
          <ol-feature v-for="(marker, i) in markers" :key="i">
            <ol-geom-point :coordinates="marker.coordinate"></ol-geom-point>
            <ol-style>
              <ol-style-icon :src="marker.icon" :scale="1"></ol-style-icon>
            </ol-style>
            <ol-overlay :position="marker.coordinate">
              <template v-slot="slotProps">
                <div
                  class="relative w-[73px] left-8 -top-8 text-primary-400 font-bold text-base"
                  v-if="slotProps"
                >
                  {{ marker.name }}
                </div>
              </template>
            </ol-overlay>
          </ol-feature>
        </ol-source-vector>
      </ol-vector-layer>

      <ol-vector-layer :zIndex="i" v-for="i in 2" :key="i">
        <ol-source-vector>
          <ol-feature>
            <ol-geom-line-string
              :coordinates="validLinePoints"
            ></ol-geom-line-string>
            <ol-style>
              <ol-style-stroke
                :color="i === 1 ? olStrokeColor : olFillColor"
                :width="(3 - i) * 4"
              ></ol-style-stroke>
            </ol-style>
          </ol-feature>
        </ol-source-vector>
      </ol-vector-layer>

      <ol-vector-layer :zIndex="0" :key="drawKey" v-if="drawable && drawEnable">
        <ol-source-vector :projection="projection">
          <ol-interaction-draw
            type="LineString"
            @drawend="drawend"
            @drawstart="drawstart"
          >
          </ol-interaction-draw>
        </ol-source-vector>
      </ol-vector-layer>
    </ol-map>
    <div
      v-if="drawable"
      class="absolute bottom-[10px] right-[10px] btn"
      :class="[reDraw ? 'btn--text-blue-500' : 'bg-blue-500']"
      @click="handleDraw"
    >
      <IcDraw :type="reDraw ? '' : 'draw'" /><span>{{
        reDraw ? $t("redraw_route") : $t("draw_route")
      }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  ref,
  watch,
  computed,
  nextTick
} from "vue";
import userPin from "@/assets/icons/ic_driver_pin.png";
import storePin from "@/assets/icons/ic_pin_store.png";
import IcDraw from "@/assets/icons/IcDraw.vue";
import { v4 as uuidv4 } from "uuid";
import { useUndo } from "@/composable/undo";
import { boundingExtent } from "ol/extent";
import emitter, { EMITTER_EVENTS } from "@/utils/emiiter";

interface Marker {
  icon: string;
  coordinate: number[];
  name: string;
}
type View2 = {
  viewportSize_: number[];
  fit: (geometryOrExtent, options?) => void;
};
interface MapRef {
  map: Map;
  updateSize: () => void;
}
interface Map {
  getSize: () => number[];
  getView: () => View2;
}
export default defineComponent({
  components: {
    IcDraw
  },
  props: {
    center: {
      type: Array,
      default() {
        return [20.99695916557617, 105.80201513074952];
      }
    },
    rotation: {
      type: Number,
      default: 0
    },
    zoom: {
      type: Number,
      default: 17
    },
    projection: {
      type: String,
      default: "EPSG:4326"
    },
    route: {
      type: Array,
      default() {
        return [];
      }
    },
    linePoints: {
      type: Array as () => number[][],
      default() {
        return [[]];
      }
    },
    users: {
      type: Object,
      default() {
        return {};
      }
    },
    olFillColor: {
      type: String,
      default: "#82A6FF"
    },
    olStrokeColor: {
      type: String,
      default: "#BFD2FE"
    },
    markers: {
      type: Array as () => Marker[],
      default() {
        return [
          {
            coordinate: [105.793757, 20.995111]
          }
        ];
      }
    },
    drawable: {
      type: Boolean
    },
    loading: {
      type: Boolean
    }
  },
  setup(props, { emit }) {
    const map = ref(null);
    const drawKey = ref(uuidv4());
    const drawEnable = ref(false);
    const linePoints = computed(() => props.linePoints);
    const reDraw = ref(props.linePoints.some((x) => x[0] && x[1]));
    const undoLinePoints = (): void => {
      drawKey.value = uuidv4();
      const updated = linePoints.value.slice(0, linePoints.value.length - 1);
      emit("update:linePoints", updated);
    };
    const handleUndo = useUndo(undoLinePoints);
    const refreshMap = (): void => {
      if (!map.value) return;
      const mapRef = map.value as MapRef;
      if (mapRef) mapRef.updateSize();
    };
    onMounted(() => {
      emitter.on(EMITTER_EVENTS.TOGGLE_SIDE_BAR, () => {
        nextTick(() => {
          setTimeout(() => {
            refreshMap();
          }, 200);
        });
      });
      watch(
        linePoints,
        () => {
          reDraw.value = linePoints.value.some((x) => x[0] && x[1]);
        },
        {
          deep: true,
          immediate: true
        }
      );
    });

    return {
      drawEnable,
      reDraw,
      drawKey,
      handleUndo,
      refreshMap,
      map
    };
  },
  unmounted() {
    emitter.off(EMITTER_EVENTS.TOGGLE_SIDE_BAR, () => {
      this.refreshMap();
    });
  },
  computed: {
    storePin() {
      return storePin;
    },
    userPin() {
      return userPin;
    },
    validLinePoints() {
      return this.linePoints.filter((x) => x[0] && x[1]);
    },
    pointMaps() {
      const markerPoints = this.markers.map((x) => x.coordinate);
      return [...markerPoints, ...this.validLinePoints];
    }
  },
  methods: {
    drawstart() {
      // this.$emit("update:linePoints", [[]])
    },
    drawend(event: { target: { sketchCoords_: number[][] } }) {
      this.$emit("update:linePoints", [
        ...this.linePoints,
        ...event.target.sketchCoords_
      ]);
      this.reDraw = true;
      // this.drawEnable = false;
    },
    geoLocChange() {
      console.log("updating");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    selectUser(user: any) {
      console.log("updating", user);
    },
    // refreshMap() {
    //   const mapRef = this.$refs["map"] as MapRef;
    //   if (mapRef)
    //     mapRef.updateSize();
    // },
    handleDraw() {
      if (this.reDraw) {
        this.reDraw = false;
        this.drawKey = uuidv4();
        this.$emit("update:linePoints", []);
      }
      this.drawEnable = true;
    },
    disableDraw() {
      this.drawEnable = false;
    },
    fitMap() {
      this.$nextTick(() => {
        if (!this.pointMaps.length) return;
        if (this.pointMaps.length === 1) {
          this.$emit("update:center", this.pointMaps[0]);
          return;
        }
        const mapRef = this.$refs["map"] as MapRef;
        const { map } = mapRef;
        const view = map.getView();
        const boundingEx = boundingExtent(this.pointMaps);
        view.fit(boundingEx, map.getSize());
      });
    }
  }
});
</script>
<style lang="scss" scoped>
.ol-map {
  width: 100%;
}
</style>
