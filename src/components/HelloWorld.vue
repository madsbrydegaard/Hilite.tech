<template>
  <v-container v-resize="onResize">
    <v-row class="text-center">
      <v-col class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3">Hilite Tech</h1>

        <p class="subheading font-weight-regular" v-if="!isHorizontal">
          For optimal performance,
          <br />please go to horizontal mode
        </p>
        <p class="subheading font-weight-regular" v-else-if="!isFullScreen">
          and,
          <br />
          <v-btn @click="requestFullscreen"> Enable fullscreen </v-btn>
        </p>
        <p class="subheading font-weight-regular" v-else>
          <v-btn @click="$emit('togglePlay', true)"> Play game </v-btn>
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import screenfull from "screenfull";

export default {
  name: "HelloWorld",

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
    isFullScreen: false,
    playnow: false,
  }),

  mounted() {
    this.onResize();
    screenfull.on("change", () => {
      console.log("Am I fullscreen?", screenfull.isFullscreen ? "Yes" : "No");
      this.isFullScreen = screenfull.isFullscreen;
    });
  },

  methods: {
    onResize() {
      this.windowSize = { x: window.innerWidth, y: window.innerHeight };
    },
    requestFullscreen() {
      if (screenfull.isEnabled) {
        screenfull.request();
      }
    },
    play() {
      this.playnow = true;
    },
  },
};
</script>
