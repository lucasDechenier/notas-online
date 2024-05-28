<template>
  <section id="home" class="text-center pa-5 flex flex-column container">
    <div class="text-center flex flex-col items-center justify-center">
      <div class="flex">
        <a href="https://vitejs.dev" target="_blank">
          <img
            src="/vite.svg"
            class="logo"
            alt="Vite logo">
        </a>
        <a href="https://vuejs.org/" target="_blank">
          <img
            src="../assets/vue.svg"
            class="logo vue"
            alt="Vue logo">
        </a>
      </div>
      <div>
        <HelloWorld msg="Vite + Vue" />
      </div>
    </div>
  </section>
</template>

<script setup>
import HelloWorld from '@/components/HelloWorld.vue'

</script>

<style scoped>

#home{
  margin: 0 auto;
  display: flex;
  flex-grow: 1;
}
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>