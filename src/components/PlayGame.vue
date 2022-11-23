<template>
  <div id="cvh"></div>
</template>

<script>
import engine from "../engine.cvh";
export default {
  name: "PlayGame",

  computed: {},

  data: () => ({
    $engine: null,
  }),

  mounted() {
    const vm = this;
    this.$engine = engine()
      .on("game.resumed", function () {
        console.log("game.resumed");
        vm.$emit("gameResumed");
      })
      .on("game.paused", function () {
        console.log("game.paused");
        vm.$emit("gamePaused");
      })
      .on("chapter.started", function () {
        console.log("chapter.started");
        vm.$emit("gameStarted");
      })
      .on("game.ended", function (e, engine) {
        console.log("game.ended", engine);
        vm.$emit("gameEnded", engine);
      })
      .on("game.saved", function () {
        console.log("game.saved");
        vm.$emit("gameSaved");
      });
  },

  methods: {},
};
</script>
