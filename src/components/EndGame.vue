<template>
  <v-container v-resize="onResize">
    <v-row class="text-center">
      <v-col class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3">Congrats</h1>

        <p class="subheading font-weight-regular">
          You got <br />
          <span class="text-h3 font-weight-bold">{{ this.result }}</span
          ><br />
          points
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "EndGame",

  props: ["result"],

  data: () => ({}),
};
</script>
