<template>
  <div id="cvh"></div>
</template>

<script>
import engine from "../engine.cvh";
export default {
  name: "PlayGame",

  computed: {},

  data: () => ({}),

  mounted() {
    engine();
  },

  methods: {},
};
</script>
