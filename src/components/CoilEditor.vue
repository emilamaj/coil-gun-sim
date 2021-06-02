<template>
  <div id="CoilEditor">
    <div class="param">
      <span class="inputLabel">Layer Count</span
      ><input
        class="paramInput"
        type="number"
        v-model="coilParams.layerCount"
      />
    </div>
    <div class="param">
      <span class="inputLabel">Turns per layer</span
      ><input
        class="paramInput"
        type="number"
        v-model="coilParams.layerTurns"
      />
    </div>
    <div class="param">
      <span class="inputLabel">Wire Diameter</span
      ><input class="paramInput" type="number" v-model="coilParams.wireDia" />
    </div>
  </div>
</template>

<script>
export default {
  name: "CoilEditor",
  props: {},
  data: function () {
    return {
      coilParams: { layerCount: 3, layerTurns: 10, wireDia: 1 },
    };
  },
  methods: {},
  mounted() {},
  watch: {
    coilParams: {
      handler: function () {
        this.$emit("coilUpdate", this.coilParams);
      },
      deep: true,
    },
  },
};
</script>

<style scoped lang="scss">
#CoilEditor {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
</style>
