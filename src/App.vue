<template>
  <v-app>
    <v-main>
      <PlayGame v-if="isPlaying" />
      <HelloWorld
        v-else
        @togglePlay="togglePlay"
        @toggleFullscreen="toggleFullscreen"
        @toggleHorizontal="toggleHorizontal"
      />
    </v-main>
  </v-app>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";
import PlayGame from "./components/PlayGame.vue";
export default {
  name: "App",

  components: {
    HelloWorld,
    PlayGame,
  },

  data: () => ({
    isFullscreen: false,
    isPlaying: false,
    isHorizontal: false,
  }),

  methods: {
    toggleFullscreen(isFullscreen) {
      this.isFullscreen = isFullscreen;
    },
    toggleHorizontal(isHorizontal) {
      this.isHorizontal = isHorizontal;
    },
    togglePlay(isPlaying) {
      this.isPlaying = isPlaying;
    },
  },
};
</script>
