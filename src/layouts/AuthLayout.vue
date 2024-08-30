<template>
  <div class="d-flex text-center flex-column flex-md-row flex-grow-1">
    <div
      class="pa-2 pa-md-4 flex-grow-1 align-center justify-center d-flex flex-column"
    >
      <div class="layout-content ma-auto w-100">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.layout-content {
  max-width: 480px;
}
</style>
