<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
          <router-link to="/" class="navbar-brand">Home</router-link>
          <router-link to="/create" class="navbar-brand">Create</router-link>
          <router-link to="/update" class="navbar-brand">Update</router-link>
          <router-link to="/delete" class="navbar-brand">Delete</router-link>
          <router-link to="/list" class="navbar-brand">List</router-link>
          <router-link to="/about" class="navbar-brand">About</router-link>
      </div>
  </nav>
  <router-view/>
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
