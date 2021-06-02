<template>
  <div id="nav">
    <router-link to="/">Home</router-link>
    <span> | </span>
    <router-link to="/projectile">Projectile</router-link>
    <span> | </span>
    <router-link to="/coil">Coil</router-link>
    <span> | </span>
    <router-link to="/simulator">Simulator</router-link>
    <span> | </span>
    <router-link to="/about">About</router-link>
  </div>
  <router-view />
</template>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Montserrat&display=swap");
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css");

#app {
  font-family: Montserrat, Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
  a {
    font-size: 1.5em;
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
