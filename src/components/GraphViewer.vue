<template>
  <div id="GraphViewer">
    <div id="ViewerContainer" :style="graphStyle"></div>
  </div>
</template>

<script>
//import * as Plotly from "@/plotly/plotly-latest.min.js";

export default {
  name: "GraphViewer",
  props: {
    graphParams: {
      type: Object,
      default: () => {
        return {
          points: [
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 0, 0, 0, 0],
          ],
          xDomain: [0, 100],
          yDomain: [0, 100],
          title: "Smooth Contour Lines",
        };
      },
    },
    dimensions: {
      type: Object,
      default: () => {
        return { width: 640, height: 480 };
      },
    },
  },
  computed: {
    graphStyle() {
      return `width: ${this.dimensions.width}px; height: ${this.dimensions.height}px; `;
    },
  },
  methods: {
    drawGraph() {},
  },
  mounted() {
    //Dynamically load plotly (otherwise it takes too long to build)
    const existingScript = document.getElementById("plotlyScript");
    debugger;

    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://cdn.plot.ly/plotly-latest.min.js";
      script.id = "plotlyScript";
      document.body.appendChild(script);

      script.onload = () => {
        debugger;
      };
    }

    var graphData = [
      {
        z: this.graphPoints,
        type: "contour",
        line: {
          smoothing: 0.85,
        },
        xaxis: "x",
        yaxis: "y",
      },
    ];

    var layout = {
      title: "",
      xaxis: { domain: this.xDomain, anchor: "y" },
      yaxis: { domain: this.yDomain, anchor: "x" },
    };

    Plotly.newPlot("myDiv", graphData, layout);
  },
  watch: {
    points: {
      handler: function () {
        this.mesh && this.scene.remove(this.mesh);
        this.drawScene();
        this.renderScene();
      },
      deep: true,
    },
  },
};
</script>

<style scoped lang="scss">
#ModelViewer {
  border-left: 4px solid;
  background-color: rgb(240, 240, 240);
  padding: 30px 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
}
</style>
