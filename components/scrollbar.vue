<template>
  <div ref="scrollbarRef" class="scrollbar">
    <div ref="wrapRef" :class="wrapKls" :style="style" @scroll="handleScroll">
      <component
        :is="tag"
        ref="resizeRef"
        :class="resizeKls"
        :style="viewStyle"
      >
        <slot />
      </component>
    </div>
    <template v-if="!native">
      <Bar
        ref="barRef"
        :height="sizeHeight"
        :width="sizeWidth"
        :always="always"
        :ratio-x="ratioX"
        :ratio-y="ratioY"
      />
    </template>
  </div>
</template>
<script>
import { GAP, scrollbarContextKey } from "./constants";
import { addUnit, isNumber, isObject } from "./utils/index.js"
import Bar from "./bar.vue";
const COMPONENT_NAME = "Scrollbar";
export default {
  name: COMPONENT_NAME,
  provide() {
    return {
      [scrollbarContextKey]: this
    };
  },
  components: { Bar },
  props: {
    /**
     * @description height of scrollbar
     */
    height: {
      type: [String, Number],
      default: ""
    },
    /**
     * @description max height of scrollbar
     */
    maxHeight: {
      type: [String, Number],
      default: ""
    },
    /**
     * @description whether to use the native scrollbar
     */
    native: {
      type: Boolean,
      default: false
    },
    /**
     * @description style of wrap
     */
    wrapStyle: {
      type: [String, Object, Array],
      default: ""
    },
    /**
     * @description class of wrap
     */
    wrapClass: {
      type: [String, Array],
      default: ""
    },
    /**
     * @description class of view
     */
    viewClass: {
      type: [String, Array],
      default: ""
    },
    /**
     * @description style of view
     */
    viewStyle: {
      type: [String, Array, Object],
      default: ""
    },
    /**
     * @description do not respond to container size changes, if the container size does not change, it is better to set it to optimize performance
     */
    noresize: Boolean, // 如果 container 尺寸不会发生变化，最好设置它可以优化性能
    /**
     * @description element tag of the view
     */
    tag: {
      type: String,
      default: "div"
    },
    /**
     * @description always show
     */
    always: Boolean,
    /**
     * @description minimum size of scrollbar
     */
    minSize: {
      type: Number,
      default: 20
    }
  },
  data() {
    return {
      sizeWidth: "0",
      sizeHeight: "0",
      ratioY: 1,
      ratioX: 1,
      stopResizeObserver: null,
      stopResizeListener: null
    };
  },
  computed: {
    style({ height, maxHeight, wrapStyle }) {
      const style = {};
      if (height) style.height = addUnit(height);
      if (maxHeight) style.maxHeight = addUnit(maxHeight);
      return [wrapStyle, style];
    },
    wrapKls({ wrapClass, native }) {
      return [
        wrapClass,
        "scrollbar-wrap",
        { "scrollbar-wrap-hidden-default": !native }
      ];
    },
    resizeKls({ viewClass }) {
      return ["view", viewClass];
    }
  },
  methods: {
    update() {
      const wrapRef = this.$refs.wrapRef;
      if (!wrapRef) return;
      const offsetHeight = wrapRef.offsetHeight - GAP;
      const offsetWidth = wrapRef.offsetWidth - GAP;

      const originalHeight = offsetHeight ** 2 / wrapRef.scrollHeight;
      const originalWidth = offsetWidth ** 2 / wrapRef.scrollWidth;
      const height = Math.max(originalHeight, this.minSize);
      const width = Math.max(originalWidth, this.minSize);

      this.ratioY =
        originalHeight /
        (offsetHeight - originalHeight) /
        (height / (offsetHeight - height));
      this.ratioX =
        originalWidth /
        (offsetWidth - originalWidth) /
        (width / (offsetWidth - width));

      this.sizeHeight = height + GAP < offsetHeight ? `${height}px` : "";
      this.sizeWidth = width + GAP < offsetWidth ? `${width}px` : "";
    },
    handleScroll() {
      const wrapRef = this.$refs.wrapRef;
      const barRef = this.$refs.barRef;
      if (wrapRef) {
        barRef?.handleScroll(wrapRef);
        this.$emit("scroll", {
          scrollTop: wrapRef.scrollTop,
          scrollLeft: wrapRef.scrollLeft
        });
      }
    },

    scrollTo(arg1, arg2) {
      const wrapRef = this.$refs.wrapRef;
      if (isObject(arg1)) {
        wrapRef.scrollTo(arg1);
      } else if (isNumber(arg1) && isNumber(arg2)) {
        wrapRef.scrollTo(arg1, arg2);
      }
    },
    setScrollTop(value) {
      const wrapRef = this.$refs.wrapRef;
      if (!isNumber(value)) {
        debugWarn(COMPONENT_NAME, "value must be a number");
        return;
      }
      wrapRef.scrollTop = value;
    },
    setScrollLeft(value) {
      const wrapRef = this.$refs.wrapRef;
      if (!wrapRef) return;
      if (!isNumber(value)) {
        debugWarn(COMPONENT_NAME, "value must be a number");
        return;
      }
      wrapRef.scrollLeft = value;
    }
  },
  watch: {
    noresize: {
      handler(noresize) {
        if (noresize) {
          this.stopResizeObserver?.();
          this.stopResizeListener?.();
        } else {
          this.$nextTick(() => {
            const resizeRef = this.$refs.resizeRef;
            let observer;
            const cleanup = () => {
              if (observer) {
                observer.disconnect();
                observer = null;
              }
            };
            this.stopResizeObserver = () => {
              cleanup();
              observer = new ResizeObserver(this.update);
              observer.observe(resizeRef);
            };
            this.stopResizeListener = window.addEventListener(
              "resize",
              this.update
            );
            this.$once("hook:beforeDestroy", () => {
              window.removeEventListener("mousemove", this.update);
            });
          });
        }
      },
      immediate: true
    }
  },
  created() {
    this.$watch(
      () => [this.maxHeight, this.height],
      () => {
        if (!this.native)
          this.$nextTick(() => {
            this.update();
            const wrapRef = this.$refs.wrapRef;
            const barRef = this.$refs.barRef;
            if (wrapRef) {
              barRef?.handleScroll(wrapRef);
            }
          });
      }
    );
  },
  mounted() {
    if (!this.native) {
      this.$nextTick(() => {
        this.update();
      });
    }
  },
  updated() {
    this.update();
  }
};
</script>

