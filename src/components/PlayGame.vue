<template>
  <v-container>
    <div id="cvh"></div>
  </v-container>
</template>

<script>
import engine from "../engine.cvh";
export default {
  name: "PlayGame",

  computed: {
    // a computed getter
    isHorizontal() {
      // `this` points to the component instance
      return this.windowSize.x > this.windowSize.y;
    },
  },

  data: () => ({
    windowSize: {
      x: 0,
      y: 0,
    },
  }),

  mounted() {
    this.onResize();
    engine();
  },

  methods: {
    onResize() {
      this.windowSize = { x: window.innerWidth, y: window.innerHeight };
    },
  },
};
</script>
