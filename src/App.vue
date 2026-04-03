<template>
  <div class="body">
    <header>
      <Header class="header"></Header>
      <Search class="search-box"></Search>
      <NavGroups></NavGroups>

    </header>

    <main>

    </main>
  </div>
</template>

<script setup>
import Header from "@/views/header/Header.vue"
import Search from "@/views/header/Search.vue";
import NavGroups from "./views/main/NavGroups.vue";
</script>

<style scoped>
.body {
  font-size: 14px;
  width: 30em;
  margin: 0 auto;
}
.header {
  margin-top: 5em;
}
.search-box {
  margin-top: 2em;
  margin-bottom: 2em;
}

/* 平板及以上：双栏 */
@media (min-width: 768px) {
  .body {
    font-size: 14px;
    width: 48em;
  }
}

/* 桌面及以上：三栏 */
@media (min-width: 1000px) {
  .body {
    font-size: 16px;
    width: 48em;
  }
}
</style>
