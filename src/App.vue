<template>
  <div class="tag">
    <Scrollbar :always="true" class="scrollbar">
      <div class="tags" style="height: 200px">
        <div v-for="t in 800" :key="t">{{ t }}</div>
      </div>
    </Scrollbar>
  </div>
</template>

<style>
.tag {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: rgba(116, 116, 116, 0.281);
  height: 100px;
}
.tag .scrollbar {
  width: 100%;
}
.tag .scrollbar .tags {
  display: flex;
  width: 1px;
}
</style>

