<template>
  <div class=container>
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid">
            <router-link to="/" class="nav-link">Home</router-link>
            <router-link to="/create" class="nav-link">Create</router-link> 
            <router-link to="/list" class="nav-link">List</router-link> 
            <router-link to="/about" class="nav-link">About</router-link>
        </div>
    </nav>
    <router-view/>
  </div> 
  
</template>


<script>
export default {
  name: 'App',
  components: {

  }
}
</script>

<style>
#app {
  font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
</style>
