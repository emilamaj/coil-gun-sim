<template>
  <div id="CoilViewer">
    <div id="ViewerContainer"></div>
  </div>
</template>

<script>
import * as THREE from "three-full";

export default {
  name: "CoilViewer",
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
  },
  methods: {
    drawBackground() {},
    drawScene() {
      let pt = [];
      //Convert the list of points as objects like {x: 1, y:2} to THREE.Vector2
      this.points.forEach((p) => {
        //X and Y axis need to be reversed for whatever reason...
        pt.push(new THREE.Vector2(p.y, p.x));
      });
      //Don't forget to add the first point again to close the loop
      pt.push(new THREE.Vector2(this.points[0].y, this.points[0].x));

      var geometry = new THREE.LatheGeometry(pt, 32); //, 0, 5.0);
      this.mesh = new THREE.Mesh(geometry, this.material);
      this.scene.add(this.mesh);
    },
    renderScene() {
      this.renderer.render(this.scene, this.camera);
    },
  },
  mounted() {
    this.scene = new THREE.Scene();
    // camera
    this.camera = new THREE.PerspectiveCamera(
      45,
      this.dimensions.width / this.dimensions.height,
      1,
      1000
    );
    this.camera.position.set(100, 50, 100);

    // Skybox
    const path = "textures/cube/pisa/";
    const urls = [
      path + "px.png",
      path + "nx.png",
      path + "py.png",
      path + "ny.png",
      path + "pz.png",
      path + "nz.png",
    ];
    const textureCube = new THREE.CubeTextureLoader().load(urls, () => {
      requestAnimationFrame(this.renderScene);
    });
    //textureCube.encoding = THREE.sRGBEncoding;
    this.scene.background = textureCube;

    // For use in drawScene()
    this.material = new THREE.MeshPhongMaterial({
      color: 0xffd700,
      specular: 0x888888,
      shininess: 20,
      flatShading: true,
      envMap: textureCube,
      side: THREE.DoubleSide,
    });

    const helperScan = new THREE.GridHelper(100, 100);
    helperScan.position.y = 0;
    helperScan.material.opacity = 0.6;
    helperScan.material.transparent = true;
    this.scene.add(helperScan);

    // shape
    // meshes
    // lights
    const lightDirScan = new THREE.DirectionalLight(0xffffff, 1.0);
    lightDirScan.position.set(0.3, -0.3, 0.7); //Light "direction"
    lightDirScan.color.setHSL(0.1, 0.01, 0.25);
    this.scene.add(lightDirScan);

    const ambientLight = new THREE.AmbientLight(0xcccccc, 1);
    this.scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1, 50);
    pointLight.position.set(20, 25, 10);
    this.scene.add(pointLight);
    // renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(this.dimensions.width, this.dimensions.height);
    //this.renderer.setClearColor(0x20252f);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    document
      .getElementById("CoilViewer")
      .appendChild(this.renderer.domElement);
    // controls
    this.controls = new THREE.OrbitControls(
      this.camera,
      this.renderer.domElement
    );
    this.controls.addEventListener("change", this.renderScene);
    this.drawScene();
    this.renderScene();
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
#CoilViewer {
  border-left: 4px solid;
  background-color: rgb(240, 240, 240);
  padding: 30px 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
}
</style>
