<template>
  <transition name="scrollbar-fade">
    <div
      v-show="always || visible"
      ref="instance"
      :class="['scrollbar-bar', `is-${bar.key}`]"
      @mousedown="clickTrackHandler"
    >
      <div
        ref="thumb"
        :class="'scrollbar-thumb'"
        :style="thumbStyle"
        @mousedown="clickThumbHandler"
      />
    </div>
  </transition>
</template>

<script>
import { ComError, isClient } from "./utils/index.js";
import { scrollbarContextKey } from "./constants";
function throwError(scope, m) {
  throw new ComError(`[${scope}] ${m}`);
}
const BAR_MAP = {
  vertical: {
    offset: "offsetHeight",
    scroll: "scrollTop",
    scrollSize: "scrollHeight",
    size: "height",
    key: "vertical",
    axis: "Y",
    client: "clientY",
    direction: "top"
  },
  horizontal: {
    offset: "offsetWidth",
    scroll: "scrollLeft",
    scrollSize: "scrollWidth",
    size: "width",
    key: "horizontal",
    axis: "X",
    client: "clientX",
    direction: "left"
  }
};

const renderThumbStyle = ({ move, size, bar }) => ({
  [bar.size]: size,
  transform: `translate${bar.axis}(${move}%)`
});

const COMPONENT_NAME = "Thumb";
export default {
  name: COMPONENT_NAME,
  props: {
    vertical: Boolean,
    size: String,
    move: Number,
    ratio: {
      type: Number,
      required: true
    },
    always: Boolean
  },
  inject: {
    scrollbar: scrollbarContextKey
  },
  data() {
    return {
      thumbState: {},
      visible: false,
      originalOnSelectStart: isClient ? document.onselectstart : null,
      cursorDown: false,
      cursorLeave: false
    };
  },
  computed: {
    bar({ vertical }) {
      return BAR_MAP[vertical ? "vertical" : "horizontal"];
    },
    thumbStyle({ size, move, bar }) {
      return renderThumbStyle({
        size,
        move,
        bar
      });
    },

    offsetRatio({ scrollbar, bar, ratio }) {
      const instance = this.$refs.instance;
      const thumb = this.$refs.thumb;
      const wrapRef = scrollbar?.$refs?.wrapRef;
      if (!instance || !thumb || !wrapRef) return 0;
      return (
        instance[bar.offset] ** 2 /
        wrapRef[bar.scrollSize] /
        ratio /
        thumb[bar.offset]
      );
    }
  },
  methods: {
    startDrag(e) {
      e.stopImmediatePropagation();
      this.cursorDown = true;
      document.addEventListener("mousemove", this.mouseMoveDocumentHandler);
      document.addEventListener("mouseup", this.mouseUpDocumentHandler);
      this.originalOnSelectStart = document.onselectstart;
      document.onselectstart = () => false;
    },

    clickTrackHandler(e) {
      const instance = this.$refs.instance;
      const thumb = this.$refs.thumb;
      const wrapRef = this.scrollbar?.$refs?.wrapRef;
      if (!thumb || !instance || !wrapRef) return;
      const bar = this.bar;
      const offset = Math.abs(
        e.target.getBoundingClientRect()[bar.direction] - e[bar.client]
      );
      const thumbHalf = thumb[bar.offset] / 2;
      const thumbPositionPercentage =
        ((offset - thumbHalf) * 100 * this.offsetRatio) / instance[bar.offset];

      wrapRef[bar.scroll] =
        (thumbPositionPercentage * wrapRef[bar.scrollSize]) / 100;
    },

    clickThumbHandler(e) {
      e.stopPropagation();
      if (e.ctrlKey || [1, 2].includes(e.button)) return;
      window.getSelection()?.removeAllRanges();
      this.startDrag(e);
      const el = e.currentTarget;
      if (!el) return;
      this.thumbState[this.bar.axis] =
        el[this.bar.offset] -
        (e[this.bar.client] - el.getBoundingClientRect()[this.bar.direction]);
    },

    restoreOnselectstart() {
      if (document.onselectstart !== this.originalOnSelectStart)
        document.onselectstart = this.originalOnSelectStart;
    },

    mouseMoveDocumentHandler(e) {
      const instance = this.$refs.instance;
      const thumb = this.$refs.thumb;
      if (!instance || !thumb) return;
      if (this.cursorDown === false) return;
      const prevPage = this.thumbState[this.bar.axis];
      if (!prevPage) return;
      const offset =
        (instance.getBoundingClientRect()[this.bar.direction] -
          e[this.bar.client]) *
        -1;
      const thumbClickPosition = thumb[this.bar.offset] - prevPage;
      const thumbPositionPercentage =
        ((offset - thumbClickPosition) * 100 * this.offsetRatio) /
        instance[this.bar.offset];
      const wrapRef = this.scrollbar?.$refs?.wrapRef;
      wrapRef[this.bar.scroll] =
        (thumbPositionPercentage * wrapRef[this.bar.scrollSize]) / 100;
    },

    mouseUpDocumentHandler() {
      this.cursorDown = false;
      this.thumbState[this.bar.axis] = 0;
      document.removeEventListener("mousemove", this.mouseMoveDocumentHandler);
      document.removeEventListener("mouseup", this.mouseUpDocumentHandler);
      this.restoreOnselectstart();
      if (this.cursorLeave) this.visible = false;
    },

    mouseMoveScrollbarHandler() {
      this.cursorLeave = false;
      this.visible = !!this.size;
    },

    mouseLeaveScrollbarHandler() {
      this.cursorLeave = true;
      this.visible = this.cursorDown;
    }
  },
  mounted() {
    if (!this.scrollbar) {
      throwError(COMPONENT_NAME, "can not inject scrollbar context");
    }

    this.restoreOnselectstart();
    document.removeEventListener("mouseup", this.mouseUpDocumentHandler);
    this.scrollbar.$el.addEventListener(
      "mousemove",
      this.mouseMoveScrollbarHandler
    );
    this.scrollbar.$el.addEventListener(
      "mouseleave",
      this.mouseLeaveScrollbarHandler
    );
    this.$once("hook:beforeDestroy", () => {
      this.scrollbar.$el.removeEventListener(
        "mousemove",
        this.mouseMoveScrollbarHandler
      );
      this.scrollbar.$el.removeEventListener(
        "mouseleave",
        this.mouseLeaveScrollbarHandler
      );
    });
  }
};
</script>
