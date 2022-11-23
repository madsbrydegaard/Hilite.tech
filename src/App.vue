<template>
  <v-app>
    <v-main>
      <HelloWorld
        v-if="status === 'initiating'"
        @toggle-play="togglePlay"
        @toggle-fullscreen="toggleFullscreen"
        @toggle-horizontal="toggleHorizontal"
      />
      <PlayGame v-if="status === 'playing'" @game-ended="gameEnded" />
      <EndGame v-if="status === 'ended'" :result="result" />
    </v-main>
  </v-app>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";
import PlayGame from "./components/PlayGame.vue";
import EndGame from "./components/EndGame.vue";

export default {
  name: "App",

  components: {
    HelloWorld,
    PlayGame,
    EndGame,
  },

  data: () => ({
    isFullscreen: false,
    status: "initiating",
    isHorizontal: false,
    result: 0,
  }),

  methods: {
    toggleFullscreen(isFullscreen) {
      this.isFullscreen = isFullscreen;
    },
    toggleHorizontal(isHorizontal) {
      this.isHorizontal = isHorizontal;
    },
    togglePlay(isPlaying) {
      this.status = isPlaying ? "playing" : "initiating";
    },
    gameEnded(engine) {
      this.result = engine.score();
      this.status = "ended";
    },
  },
};
</script>
