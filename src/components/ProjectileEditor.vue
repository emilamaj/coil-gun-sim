<template>
  <div id="ProjectileEditor">
    <div class="PointEditor">
      <div class="PointGroup">
        <div class="Point" v-for="point in pointList">
          <input
            class="CoordInput"
            type="number"
            v-model="point.x"
            @input="editPoint($event, point, 'x')"
          />
          <input
            class="CoordInput"
            type="number"
            v-model="point.y"
            @input="editPoint($event, point, 'y')"
          />
          <button class="RemoveButton" v-on:click="removePoint(point)">
            <i class="fa fa-trash" />
          </button>
        </div>
      </div>
      <div class="EditorSettings">
        <div class="SaveLoad">
          <button class="SettingButton" @click="savePoints">
            <span>Save... <i class="fa fa-save" /></span>
          </button>
          <button class="SettingButton" @click="loadPoints">
            <span>Load... <i class="fa fa-folder-open" /></span>
          </button>
        </div>
      </div>
    </div>
    <div id="ViewerContainer" />
  </div>
</template>

<script>
import * as Two from "../two/two.js";

export default {
  name: "ProjectileEditor",
  props: {
    points: {
      type: Array,
      default: () => {
        return [
          { x: 1, y: 2 },
          { x: 50, y: 40 },
          { x: 60, y: 20 },
        ];
      },
    },
    dimensions: {
      type: Object,
      default: () => {
        return { width: 640, height: 480 };
      },
    },
    coordRange: {
      type: Object,
      default: () => {
        return { x: 64, y: 48 };
      },
    },
    loadStoredPoints: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
  },
  data: function () {
    return {
      scale: 10.0,
      translate: { x: 10.0, y: 10.0 },
      pointRadius: 4,
      midPointRadius: 3,
      pointList: [{ x: 0, y: 0 }],
      movingPointIndex: -1,
      movingGrid: false,
    };
  },
  methods: {
    loadPoints() {
      this.pointList = JSON.parse(localStorage.getItem("projectilePointList"));
    },
    savePoints() {
      localStorage.setItem(
        "projectilePointList",
        JSON.stringify(this.pointList)
      );
    },
    toScreenX(coord) {
      return coord * this.scale + this.translate.x;
    },
    toScreenY(coord) {
      return coord * this.scale + this.translate.y;
    },
    fromScreenX(coord) {
      return (coord - this.translate.x) / this.scale;
    },
    fromScreenY(coord) {
      return (coord - this.translate.y) / this.scale;
    },
    addPoint() {
      // this.pointList.push({});
    },
    removePoint(point) {
      this.pointList.splice(this.pointList.indexOf(point), 1);
      this.drawElements();
      this.two.update();
    },
    editPoint(event, point, coord) {
      this.cleanPoints();
      this.drawElements();
      this.two.update();
    },
    cleanPoints() {
      //Cast coordinate to int
      this.pointList = this.pointList.map((pt) => {
        return { x: Math.round(pt.x), y: Math.round(pt.y) };
      });
    },
    drawBackground() {
      if (this.twoGridLineList) {
        this.twoGridLineList.forEach((ln) => {
          this.two.scene.remove(ln);
        });
      }
      this.twoGridLineList = [];

      //Draw background grid
      for (let i = 0; i <= this.coordRange.x; i++) {
        let ln = this.two.makeLine(
          this.toScreenX(i),
          this.toScreenY(0),
          this.toScreenX(i),
          this.toScreenY(this.coordRange.y)
        );

        if (i == 0 || i == this.coordRange.x) {
          ln.stroke = "black";
          ln.linewidth = 2;
        } else {
          ln.stroke = "grey";
        }
        this.twoGridLineList.push(ln);
      }

      for (let j = 0; j <= this.coordRange.y; j++) {
        let ln = this.two.makeLine(
          this.toScreenX(0),
          this.toScreenY(j),
          this.toScreenX(this.coordRange.x),
          this.toScreenY(j)
        );
        ln.stroke = j == this.coordRange.y ? "black" : "grey";
        ln.linewidth = j == this.coordRange.y ? 2 : 1;
        if (j == 0) {
          ln.stroke = "darkred";
          ln.linewidth = 3;
        }
        this.twoGridLineList.push(ln);
      }
    },
    drawFrame() {
      //Draw Static Frame
    },
    drawElements() {
      //Draw points
      if (this.twoPointList) {
        this.twoPointList.forEach((pt) => {
          this.two.scene.remove(pt);
        });
      }
      this.twoPointList = [];
      this.pointList.forEach((pt) => {
        let circ = this.two.makeCircle(
          this.toScreenX(pt.x),
          this.toScreenY(pt.y),
          this.pointRadius
        );
        circ.fill = "darkslategrey";
        this.twoPointList.push(circ);
      });

      //Draw lines
      if (this.twoLineList) {
        this.twoLineList.forEach((ln) => {
          this.two.scene.remove(ln);
        });
      }
      this.twoLineList = [];

      if (this.twoMidPointList) {
        this.twoMidPointList.forEach((pt) => {
          this.two.scene.remove(pt);
        });
      }
      this.twoMidPointList = [];

      if (this.pointList.length > 1) {
        //The shape will be closed (last point is linked to the first)
        //Index proxy
        let px = [...this.pointList.keys(), 0];
        for (let i = 0; i < px.length - 1; i++) {
          // Line between two points
          let line = this.two.makeLine(
            this.toScreenX(this.pointList[px[i]].x),
            this.toScreenY(this.pointList[px[i]].y),
            this.toScreenX(this.pointList[px[i + 1]].x),
            this.toScreenY(this.pointList[px[i + 1]].y)
          );
          this.twoLineList.push(line);

          // Point in the middle of the line
          let circ = this.two.makeCircle(
            this.toScreenX(
              (this.pointList[px[i]].x + this.pointList[px[i + 1]].x) * 0.5
            ),
            this.toScreenY(
              (this.pointList[px[i]].y + this.pointList[px[i + 1]].y) * 0.5
            ),
            this.midPointRadius
          );
          circ.fill = "red";
          this.twoMidPointList.push(circ);
        }
        //Close the shape
      }
    },
    selectTargetOnDown(event) {
      if (this.movingPointIndex >= 0) {
        this.movingPointIndex = -1;
        return;
      }

      let idx = -1;
      //Check if a point was clicked
      for (let i = 0; i < this.pointList.length; i++) {
        if (
          (event.offsetX - this.toScreenX(this.pointList[i].x)) ** 2 +
            (event.offsetY - this.toScreenY(this.pointList[i].y)) ** 2 <=
          this.pointRadius ** 2
        ) {
          idx = i;
          break;
        }
      }
      //Check if a mid-point was clicked
      if (this.pointList.length > 1) {
        let px = [...this.pointList.keys(), 0];
        for (let i = 0; i < px.length - 1; i++) {
          if (
            (event.offsetX -
              this.toScreenX(
                0.5 * (this.pointList[px[i]].x + this.pointList[px[i + 1]].x)
              )) **
              2 +
              (event.offsetY -
                this.toScreenY(
                  0.5 * (this.pointList[px[i]].y + this.pointList[px[i + 1]].y)
                )) **
                2 <=
            this.midPointRadius ** 2
          ) {
            //Add a new point where the mid-point placeholder was displayed
            this.pointList.splice(i + 1, 0, {
              x: 0.5 * (this.pointList[px[i]].x + this.pointList[px[i + 1]].x),
              y: 0.5 * (this.pointList[px[i]].y + this.pointList[px[i + 1]].y),
            });
            idx = i + 1;
            break;
          }
        }
      }

      if (idx >= 0) {
        this.movingPointIndex = idx;
        this.two.renderer.domElement.style.cursor = "grabbing";
      } else {
        this.movingGrid = true;
        this.two.renderer.domElement.style.cursor = "move";
      }
      /*
      this.cleanPoints();
      this.drawElements();
      this.two.update();
      */
    },
    releaseTargetOnUp(event) {
      this.movingPointIndex = -1;
      this.movingGrid = false;
      if (this.movingPointIndex >= 0 || this.movingGrid) {
        this.two.renderer.domElement.style.cursor = "default";
      }
      this.cleanPoints();
      this.drawElements();
      this.two.update();
    },
    moveTargetOnMove(event) {
      if (this.movingPointIndex >= 0) {
        //Move the point accordingly
        this.pointList[this.movingPointIndex].x = this.fromScreenX(
          event.offsetX
        );
        this.pointList[this.movingPointIndex].y = this.fromScreenY(
          event.offsetY
        );
        this.drawElements();
        this.two.update();
      } else if (!this.movingGrid) {
        //Set the correct cursor
        let cur = "default";
        //Hovering a point
        for (let i = 0; i < this.pointList.length; i++) {
          if (
            (event.offsetX - this.toScreenX(this.pointList[i].x)) ** 2 +
              (event.offsetY - this.toScreenY(this.pointList[i].y)) ** 2 <=
            this.pointRadius ** 2
          ) {
            cur = "grab";
          }
        }

        //Hovering a mid-point
        if (this.pointList.length > 1) {
          let px = [...this.pointList.keys(), 0];
          for (let i = 0; i < px.length - 1; i++) {
            if (
              (event.offsetX -
                this.toScreenX(
                  0.5 * (this.pointList[px[i]].x + this.pointList[px[i + 1]].x)
                )) **
                2 +
                (event.offsetY -
                  this.toScreenY(
                    0.5 *
                      (this.pointList[px[i]].y + this.pointList[px[i + 1]].y)
                  )) **
                  2 <=
              this.midPointRadius ** 2
            ) {
              cur = "grab";
            }
          }
        }
        this.two.renderer.domElement.style.cursor = cur;
      } else {
        // We want to move the map
        this.translate.x += event.movementX;
        this.translate.y += event.movementY;
        this.drawBackground();
        this.drawElements();
        this.two.update();
      }
    },
    zoomActionOnScroll(event) {
      //Scale by 20%
      let factor = event.deltaY >= 0 ? 0.8 : 1.2;
      this.scale *= factor;
      //Translate so that the mouse cursor lands at the fixed point of the affine transform
      this.translate.x =
        event.offsetX + factor * (this.translate.x - event.offsetX);
      this.translate.y =
        event.offsetY + factor * (this.translate.y - event.offsetY);

      this.drawBackground();
      this.drawElements();
      this.two.update();
      event.preventDefault();
    },
  },
  mounted() {
    if (this.loadStoredPoints) {
      this.pointList = JSON.parse(localStorage.getItem("projectilePointList"));
    } else {
      this.pointList = this.points.slice(0);
    }
    //Setup Canvas
    let elem = document.getElementById("ViewerContainer");
    this.two = new Two({ ...this.dimensions, type: Two.Types.webgl }).appendTo(
      elem
    );
    this.two.renderer.domElement.classList.add("ShapeViewer");

    this.twoGridLineList = [];
    this.twoPointList = [];
    this.twoLineList = [];
    this.twoMidPointList = [];

    this.two.renderer.domElement.addEventListener(
      "mousedown",
      this.selectTargetOnDown
    );
    this.two.renderer.domElement.addEventListener(
      "mouseup",
      this.releaseTargetOnUp
    );
    this.two.renderer.domElement.addEventListener(
      "mousemove",
      this.moveTargetOnMove
    );
    this.two.renderer.domElement.addEventListener(
      "mousewheel",
      this.zoomActionOnScroll
    );

    this.drawBackground();
    this.drawElements();
    this.two.update();
  },
  watch: {
    scale: function (newScale, oldScale) {
      /*
      this.drawBackground();
      this.cleanPoints();
      this.drawElements();
      */
    },
    pointList: {
      handler: function () {
        if (this.loadStoredPoints) {
          localStorage.setItem(
            "projectilePointList",
            JSON.stringify(this.pointList)
          );
        }
        this.$emit("pointupdate", this.pointList);
      },
      deep: true,
    },
  },
};
</script>

<style scoped lang="scss">
#ProjectileEditor {
  border-left: 4px solid;
  background-color: rgb(240, 240, 240);
  padding: 30px 0;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  .PointEditor {
    background-color: #ffffff;
    border: 1px solid;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    .PointGroup {
      height: 420px;
      overflow-y: scroll;
      .Point {
        display: flex;
        justify-content: center;
        .CoordInput {
          width: 100%;
        }
        .RemoveButton {
          background-color: rgb(44, 44, 44);
          border: none;
          color: white;
          padding: 12px 16px;
          font-size: 16px;
          cursor: pointer;
        }
        .RemoveButton:hover {
          background-color: rgb(71, 71, 60);
        }
      }
    }
    .EditorSettings {
      padding: 20px 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .SaveLoad {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        .SettingButton {
          background-color: rgb(44, 44, 44);
          border: none;
          color: white;
          padding: 12px 16px;
          font-size: 16px;
          cursor: pointer;
        }
        .SettingButton:hover {
          background-color: rgb(71, 71, 60);
        }
      }
    }
  }
  #ViewerContainer {
    border: 1px solid;
    background-color: #ffffff;
  }
}
</style>
