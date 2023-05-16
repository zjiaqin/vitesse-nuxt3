<script setup lang="ts">
import { useBreakpoints } from '@/composables/useBreakpoint'

const bs = useBreakpoints()

const { data } = await useFetch('/api/pageview')

const time = useTimeAgo(() => data.value?.startAt || 0)

async function test() {
  await apis.getAboutUsingGet(undefined)
  ElMessage.success('成功')
}
const { locale, locales, setLocale } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const availableLocales = computed(() => {
  return (locales.value).filter(i => i.code !== locale.value)
})
</script>

<template>
  <div text-gray:80>
    <span font-500 text-gray>{{ data?.pageview }}</span>
    page views since
    <span text-gray>{{ time }}</span>
  </div>
  {{ bs.lg }}
  <el-button @click="test">
    {{ $t('fPRsRg35uDjygihtioopI') }}
  </el-button>

  切换语言：
  <el-button @click="switchLocalePath('en')">
    en
  </el-button>
  <el-button @click="switchLocalePath('zh')">
    zh
  </el-button>
  <NuxtLink v-for="locale in availableLocales" :key="locale.code" :to="switchLocalePath(locale.code)">
    {{
      locale.name
    }}
  </NuxtLink>
  <a
    href="#"
    @click.prevent.stop="setLocale('zh')"
  > 中文</a>
  <a
    href="#"
    @click.prevent.stop="setLocale('en')"
  > English</a>
</template>
