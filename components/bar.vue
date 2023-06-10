<template>
  <div style="width:100%;height:100%">
    <Thumb :move="moveX" :ratio="ratioX" :size="width" :always="always" />
    <Thumb
      :move="moveY"
      :ratio="ratioY"
      :size="height"
      vertical
      :always="always"
    />
  </div>
</template>
<script>
const GAP = 4;
import Thumb from "./thumb.vue";
const COMPONENT_NAME = "Bar";
export default {
  name: COMPONENT_NAME,
  components: { Thumb },
  props: {
    always: {
      type: Boolean,
      default: true
    },
    width: String,
    height: String,
    ratioX: {
      type: Number,
      default: 1
    },
    ratioY: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      moveX: 0,
      moveY: 0
    };
  },
  methods: {
    handleScroll(wrap) {
      if (wrap) {
        const offsetHeight = wrap.offsetHeight - GAP;
        const offsetWidth = wrap.offsetWidth - GAP;
        this.moveY = ((wrap.scrollTop * 100) / offsetHeight) * this.ratioY;
        this.moveX = ((wrap.scrollLeft * 100) / offsetWidth) * this.ratioX;
      }
    }
  }
};
</script>
