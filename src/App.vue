<template>
  <div class="container">
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid">
            <router-link :to="{name:'Home'}" class="nav-link">Home</router-link>
            <router-link :to="{name:'Create'}" class="nav-link">Create</router-link> 
            <router-link :to="{name:'List'}" class="nav-link">List</router-link> 
            <router-link :to="{name:'About'}" class="nav-link">About</router-link>
        </div>
      </nav>
    <router-view/>
    <!-- 안내창 -->
    <teleport to="#popup">
      <transition name="fade">
        <ToastBox 
            :message="toastMessage" 
            v-if="toastShow" 
        />
      </transition> 
    </teleport> 
  </div> 
</template>


<script>
import ToastBox from '@/components/ToastBox.vue'
import { useToast } from '@/composables/toast.js'

export default {
  name: 'App',
  components: {
    ToastBox
  },
  setup() {

    const {
      toastMessage,
      toastShow,
      triggerToast
    } = useToast();

    return {
        toastMessage,
        toastShow,
        triggerToast
    }
  }
  
}
</script>

<style>
#app {
  font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>
