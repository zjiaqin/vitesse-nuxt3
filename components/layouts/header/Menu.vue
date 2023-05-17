<script setup lang="ts">
const navs = [
  {
    name: 'introduce',
    label: '主页',
    url: '#',
  },
  {
    name: 'faq',
    label: '分类',
    url: '#',
  },
  {
    name: 'api',
    label: '标签',
    url: '#',
  },
  {
    name: 'api',
    label: '友人',
    url: '#',
  },
  {
    name: 'api',
    label: '关于/留言',
    url: '#',
  },
]
</script>

<template>
  <div class="wrapper" border-lessTextColor mx-a mt-40 flex justify-center border-y border-solid py-15 space-x-45>
    <NuxtLink v-for="nav in navs" :key="nav.name" :to="nav.url" text-14>
      {{ nav.label }}
    </NuxtLink>
  </div>
</template>

<style lang="scss" scoped>
.wrapper{
  max-width: var(--page-max-width);
}
</style>
