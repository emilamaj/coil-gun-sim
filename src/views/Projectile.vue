<template>
  <div id="projectile">
    <h1>Shape your projectile</h1>
    <p>
      Use the editor to the right to shape your projectile. Click on a red
      circle to add a point at its coordinates.
    </p>
    <p>
      The enclosed area will be revolved around the red line to develop the 3d
      volume
    </p>
    <projectile-editor @pointupdate="projectileUpdate($event)" />
    <h1>Projectile 3d view</h1>
    <p>Live view of the resulting projectile</p>
    <projectile-viewer :points="projectilePointList" />
    <!--
    <HelloWorld msg="Welcome to Your Vue.js App" />
    -->
  </div>
</template>

<script>
// @ is an alias to /src
//import HelloWorld from "@/components/HelloWorld.vue";
import ProjectileEditor from "@/components/ProjectileEditor.vue";
import ProjectileViewer from "@/components/ProjectileViewer.vue";

export default {
  name: "Projectile",
  components: {
    //HelloWorld,
    ProjectileEditor,
    ProjectileViewer,
  },
  data: function () {
    return {
      projectilePointList: [{ x: 0, y: 0 }],
    };
  },
  methods: {
    projectileUpdate(event) {
      //Although arrays are passed by reference, since the original array is often spliced, we need to update the references.
      this.projectilePointList = event;
    },
  },
  mounted() {},
};
</script>
