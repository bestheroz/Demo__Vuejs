<template>
  <v-menu>
    <template #activator="{ props }">
      <div class="mr-4">Developer</div>
      <v-btn icon size="36" v-bind="props" class="mr-6">
        <v-avatar size="36" color="rgb(var(--v-theme-secondary))">
          <v-icon size="24" color="white">mdi-account</v-icon>
        </v-avatar>
      </v-btn>
    </template>
  </v-menu>
</template>
