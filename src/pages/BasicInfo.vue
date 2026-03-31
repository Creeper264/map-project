<template>
  <div>
    <a-card>
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane key="1" tab="安全生产许可相关证照">
          <div style="margin-bottom: 16px">
            <a-button type="primary" @click="handleAdd">
              <template #icon><PlusOutlined /></template>
              新增证照
            </a-button>
          </div>
          <a-table :columns="licenseColumns" :dataSource="licenseData" />
        </a-tab-pane>

        <a-tab-pane key="2" tab="生产过程基础信息">
          <div style="margin-bottom: 16px">
            <a-button type="primary" @click="handleAdd">
              <template #icon><PlusOutlined /></template>
              新增工艺信息
            </a-button>
          </div>
          <a-table :columns="processColumns" :dataSource="processData" />
        </a-tab-pane>

        <a-tab-pane key="3" tab="设备设施基础信息">
          <div style="margin-bottom: 16px">
            <a-button type="primary" @click="handleAdd">
              <template #icon><PlusOutlined /></template>
              新增设备
            </a-button>
          </div>
          <a-table :columns="equipmentColumns" :dataSource="equipmentData" />
        </a-tab-pane>

        <a-tab-pane key="4" tab="企业人员基础信息">
          <div style="margin-bottom: 16px">
            <a-button type="primary" @click="handleAdd">
              <template #icon><PlusOutlined /></template>
              新增人员
            </a-button>
          </div>
          <a-table :columns="personnelColumns" :dataSource="personnelData" />
        </a-tab-pane>

        <a-tab-pane key="5" tab="第三方人员基础信息">
          <div style="margin-bottom: 16px">
            <a-button type="primary" @click="handleAdd">
              <template #icon><PlusOutlined /></template>
              新增第三方人员
            </a-button>
          </div>
          <a-table :columns="thirdPartyColumns" :dataSource="thirdPartyData" />
        </a-tab-pane>
      </a-tabs>
    </a-card>

    <a-modal
      v-model:open="modalVisible"
      :title="editingRecord ? '编辑信息' : '新增信息'"
      @ok="handleSubmit"
      width="600px"
    >
      <a-form :model="formData" layout="vertical">
        <a-form-item label="名称" name="name">
          <a-input v-model:value="formData.name" />
        </a-form-item>
        <a-form-item label="编号" name="number">
          <a-input v-model:value="formData.number" />
        </a-form-item>
        <a-form-item label="类型" name="type">
          <a-select v-model:value="formData.type">
            <a-select-option value="type1">类型1</a-select-option>
            <a-select-option value="type2">类型2</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="日期" name="date">
          <a-date-picker v-model:value="formData.date" style="width: 100%" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, h } from 'vue'
import { message } from 'ant-design-vue'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import type { TableColumnsType } from 'ant-design-vue'

const activeKey = ref('1')
const modalVisible = ref(false)
const editingRecord = ref<any>(null)
const formData = ref({
  name: '',
  number: '',
  type: '',
  date: null,
})

const licenseColumns: TableColumnsType = [
  { title: '证照名称', dataIndex: 'name', key: 'name' },
  { title: '证照编号', dataIndex: 'number', key: 'number' },
  { title: '发证日期', dataIndex: 'issueDate', key: 'issueDate' },
  { title: '有效期至', dataIndex: 'expiryDate', key: 'expiryDate' },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    customRender: ({ text: status }: { text: string }) => {
      const colorMap: Record<string, string> = {
        有效: 'green',
        即将到期: 'orange',
        已过期: 'red',
      }
      return h('a-tag', { color: colorMap[status] }, status)
    },
  },
  {
    title: '操作',
    key: 'action',
    customRender: ({ record }: { record: any }) => {
      return h('div', [
        h('a-button', {
          type: 'link',
          onClick: () => handleEdit(record),
        }, { default: () => '编辑' }),
        h('a-button', {
          type: 'link',
          danger: true,
          onClick: () => handleDelete(record),
        }, { default: () => '删除' }),
      ])
    },
  },
]

const licenseData = [
  {
    key: '1',
    name: '危险化学品安全生产许可证',
    number: 'WH[2023]001',
    issueDate: '2023-01-15',
    expiryDate: '2026-01-14',
    status: '有效',
  },
  {
    key: '2',
    name: '危险化学品登记证',
    number: 'WH[2023]002',
    issueDate: '2023-03-20',
    expiryDate: '2024-03-19',
    status: '即将到期',
  },
]

const processColumns: TableColumnsType = [
  { title: '工艺名称', dataIndex: 'name', key: 'name' },
  { title: '反应类型', dataIndex: 'type', key: 'type' },
  { title: '涉及危险化学品', dataIndex: 'chemicals', key: 'chemicals' },
  { title: '重大危险源', dataIndex: 'hazard', key: 'hazard' },
  { title: '重点监控单元', dataIndex: 'monitor', key: 'monitor' },
  {
    title: '操作',
    key: 'action',
    customRender: () => {
      return h('div', [
        h('a-button', { type: 'link' }, { default: () => '编辑' }),
        h('a-button', { type: 'link' }, { default: () => '查看详情' }),
      ])
    },
  },
]

const processData = [
  {
    key: '1',
    name: '硝化工艺',
    type: '硝化反应',
    chemicals: '硝酸、苯',
    hazard: '一级重大危险源',
    monitor: '反应釜A',
  },
]

const equipmentColumns: TableColumnsType = [
  { title: '设备名称', dataIndex: 'name', key: 'name' },
  { title: '设备类型', dataIndex: 'type', key: 'type' },
  { title: '设备编号', dataIndex: 'number', key: 'number' },
  { title: '上次检测日期', dataIndex: 'lastCheck', key: 'lastCheck' },
  { title: '下次检测日期', dataIndex: 'nextCheck', key: 'nextCheck' },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    customRender: ({ text: status }: { text: string }) => {
      const colorMap: Record<string, string> = {
        正常: 'green',
        临期: 'orange',
        超期: 'red',
      }
      return h('a-tag', { color: colorMap[status] }, status)
    },
  },
  {
    title: '操作',
    key: 'action',
    customRender: () => {
      return h('div', [
        h('a-button', { type: 'link' }, { default: () => '编辑' }),
        h('a-button', { type: 'link' }, { default: () => '检测记录' }),
      ])
    },
  },
]

const equipmentData = [
  {
    key: '1',
    name: '压力容器A',
    type: '压力容器',
    number: 'YL-001',
    lastCheck: '2023-06-15',
    nextCheck: '2024-06-14',
    status: '正常',
  },
  {
    key: '2',
    name: '安全阀B',
    type: '安全阀',
    number: 'AQF-002',
    lastCheck: '2023-12-01',
    nextCheck: '2024-01-31',
    status: '临期',
  },
]

const personnelColumns: TableColumnsType = [
  { title: '姓名', dataIndex: 'name', key: 'name' },
  { title: '职位', dataIndex: 'position', key: 'position' },
  { title: '证书类型', dataIndex: 'certType', key: 'certType' },
  { title: '证书编号', dataIndex: 'certNumber', key: 'certNumber' },
  { title: '证书有效期', dataIndex: 'certExpiry', key: 'certExpiry' },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    customRender: ({ text: status }: { text: string }) => {
      const colorMap: Record<string, string> = {
        有效: 'green',
        即将到期: 'orange',
        已过期: 'red',
      }
      return h('a-tag', { color: colorMap[status] }, status)
    },
  },
  {
    title: '操作',
    key: 'action',
    customRender: () => {
      return h('a-button', { type: 'link' }, { default: () => '编辑' })
    },
  },
]

const personnelData = [
  {
    key: '1',
    name: '张三',
    position: '主要负责人',
    certType: '安全生产管理人员',
    certNumber: 'AQ-2023-001',
    certExpiry: '2025-12-31',
    status: '有效',
  },
  {
    key: '2',
    name: '李四',
    position: '注册安全工程师',
    certType: '注册安全工程师',
    certNumber: 'ZC-2022-005',
    certExpiry: '2024-06-30',
    status: '即将到期',
  },
]

const thirdPartyColumns: TableColumnsType = [
  { title: '姓名', dataIndex: 'name', key: 'name' },
  { title: '类型', dataIndex: 'type', key: 'type' },
  { title: '所属单位', dataIndex: 'company', key: 'company' },
  { title: '作业证书', dataIndex: 'cert', key: 'cert' },
  { title: '进入时间', dataIndex: 'enterTime', key: 'enterTime' },
  { title: '离开时间', dataIndex: 'leaveTime', key: 'leaveTime' },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    customRender: ({ text: status }: { text: string }) => {
      const colorMap: Record<string, string> = {
        在岗: 'green',
        已离开: 'default',
      }
      return h('a-tag', { color: colorMap[status] }, status)
    },
  },
  {
    title: '操作',
    key: 'action',
    customRender: () => {
      return h('a-button', { type: 'link' }, { default: () => '查看详情' })
    },
  },
]

const thirdPartyData = [
  {
    key: '1',
    name: '王五',
    type: '承包商',
    company: 'XX建设公司',
    cert: '特种作业证',
    enterTime: '2024-01-10 08:00',
    leaveTime: '-',
    status: '在岗',
  },
]

const handleEdit = (record: any) => {
  editingRecord.value = record
  formData.value = { ...record }
  modalVisible.value = true
}

const handleDelete = (record: any) => {
  message.success('删除成功')
}

const handleAdd = () => {
  editingRecord.value = null
  formData.value = {
    name: '',
    number: '',
    type: '',
    date: null,
  }
  modalVisible.value = true
}

const handleSubmit = () => {
  message.success(editingRecord.value ? '更新成功' : '添加成功')
  modalVisible.value = false
}
</script>
