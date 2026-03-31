<template>
  <a-layout class="layout">
    <a-layout-sider
      v-model:collapsed="collapsed"
      :width="250"
      theme="dark"
      collapsible
    >
      <div class="logo">
        <span v-if="!collapsed">安全管理系统</span>
        <span v-else>安全</span>
      </div>
      <a-menu
        v-model:selectedKeys="selectedKeys"
        theme="dark"
        mode="inline"
        @click="handleMenuClick"
      >
        <a-menu-item key="/dashboard">
          <template #icon>
            <DashboardOutlined />
          </template>
          <span>系统概览</span>
        </a-menu-item>
        <a-menu-item key="/basic-info">
          <template #icon>
            <SafetyOutlined />
          </template>
          <span>安全管理基础信息</span>
        </a-menu-item>
        <a-menu-item key="/major-hazard">
          <template #icon>
            <WarningOutlined />
          </template>
          <span>重大危险源安全管理</span>
        </a-menu-item>
        <a-menu-item key="/dual-prevention">
          <template #icon>
            <FileProtectOutlined />
          </template>
          <span>双重预防机制</span>
        </a-menu-item>
        <a-menu-item key="/special-work">
          <template #icon>
            <ToolOutlined />
          </template>
          <span>特殊作业许可与作业过程管理</span>
        </a-menu-item>
        <a-menu-item key="/intelligent-inspection">
          <template #icon>
            <RadarChartOutlined />
          </template>
          <span>智能巡检</span>
        </a-menu-item>
        <a-menu-item key="/personnel-location">
          <template #icon>
            <UserOutlined />
          </template>
          <span>人员定位</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header class="header">
        <h1 class="title">危险化学品企业安全管理系统</h1>
        <div class="user-info">
          <a-dropdown>
            <a class="user-dropdown" @click.prevent>
              <UserOutlined style="margin-right: 8px" />
              <span>{{ userStore.userInfo?.username || '用户' }}</span>
              <DownOutlined style="margin-left: 8px" />
            </a>
            <template #overlay>
              <a-menu>
                <a-menu-item>
                  <UserOutlined />
                  <span>个人信息</span>
                </a-menu-item>
                <a-menu-divider />
                <a-menu-item @click="handleLogout">
                  <LogoutOutlined />
                  <span>退出登录</span>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </a-layout-header>
      <a-layout-content class="content">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Modal } from 'ant-design-vue'
import {
  DashboardOutlined,
  SafetyOutlined,
  WarningOutlined,
  FileProtectOutlined,
  ToolOutlined,
  RadarChartOutlined,
  UserOutlined,
  LogoutOutlined,
  DownOutlined,
} from '@ant-design/icons-vue'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const collapsed = ref(false)
const selectedKeys = ref<string[]>([route.path])

watch(
  () => route.path,
  (newPath) => {
    selectedKeys.value = [newPath]
  }
)

const handleMenuClick = ({ key }: { key: string }) => {
  router.push(key)
}

const handleLogout = () => {
  Modal.confirm({
    title: '确认退出',
    content: '确定要退出登录吗？',
    onOk: () => {
      userStore.logout()
      router.push('/login')
    },
  })
}
</script>

<style scoped>
.layout {
  min-height: 100vh;
}

.logo {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.header {
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background: #fff;
}

.title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.user-info {
  color: #666;
}

.user-dropdown {
  color: #666;
  cursor: pointer;
  padding: 0 12px;
  display: flex;
  align-items: center;
  transition: color 0.3s;
}

.user-dropdown:hover {
  color: #1890ff;
}

.content {
  margin: 24px;
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  min-height: calc(100vh - 112px);
}
</style>
