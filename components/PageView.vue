<script setup lang="ts">
const { data } = await useFetch('/api/pageview')

const time = useTimeAgo(() => data.value?.startAt || 0)

async function test() {
  await apis.getAboutUsingGet(undefined)
}
</script>

<template>
  <div text-gray:80>
    <span font-500 text-gray>{{ data?.pageview }}</span>
    page views since
    <span text-gray>{{ time }}</span>
  </div>
  <el-button @click="test">
    test
  </el-button>
</template>
