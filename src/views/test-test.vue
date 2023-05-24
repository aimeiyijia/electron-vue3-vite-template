<script setup lang="ts">
// import { dialog } from 'electron'
// const { dialog } = require('electron')
import { dialog } from '@electron/remote'
// 函数式
// 定义状态
const dialogVisible = ref(false)
// add remove detail
const operaType = ref('add')
// 打开动作
const open = () => {
  dialogVisible.value = true

  console.log('hahhaha')
}
const handleOpen = () => {
  dialog.showOpenDialog({
    properties: ['openDirectory']
  })
  open()
  operaType.value = 'add'
}
const handleRemove = () => {
  open()
  operaType.value = 'remove'
}
const handleDetail = () => {
  open()
  operaType.value = 'detail'
}

const operaTitle = computed(() => {
  const titleMap: { [key: string]: string } = {
    add: '新增',
    remove: '删除',
    detail: '详情'
  }
  return titleMap[operaType.value] || '未知操作'
})
</script>

<template>
  <div>
    <!-- 事件 -->
    <el-button @click="handleOpen">新增</el-button>
    <el-button @click="handleRemove">删除</el-button>
    <el-button @click="handleDetail">详情</el-button>
  </div>
  <el-dialog v-model="dialogVisible" :title="operaTitle" width="30%" :before-close="handleClose">
    <span>操作类型{{ operaType }}</span>
  </el-dialog>
</template>

<style>
.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
