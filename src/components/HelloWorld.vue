<template>
  <v-container>
    <v-row class="text-center">
      <v-col class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3">Hilite Tech</h1>

        <p class="subheading font-weight-regular" v-if="!isHorizontal">
          For optimal performance,
          <br />please
          <a href="https://community.vuetifyjs.com" target="_blank"
            >go to horizontal mode</a
          >
        </p>
        <p class="subheading font-weight-regular" v-else>Ready!</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
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
  }),

  mounted() {
    this.onResize();
  },

  methods: {
    onResize() {
      this.windowSize = { x: window.innerWidth, y: window.innerHeight };
    },
  },
};
</script>
