<template>
  <div>
    <a-card>
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane key="1" tab="作业申请">
          <div style="margin-bottom: 16px">
            <a-space>
              <a-button type="primary">
                <template #icon><PlusOutlined /></template>
                新建作业申请
              </a-button>
              <a-select v-model:value="workType" style="width: 150px" placeholder="作业类型">
                <a-select-option value="all">全部</a-select-option>
                <a-select-option value="hot">动火作业</a-select-option>
                <a-select-option value="confined">受限空间作业</a-select-option>
                <a-select-option value="high">高处作业</a-select-option>
                <a-select-option value="electric">临时用电</a-select-option>
              </a-select>
            </a-space>
          </div>
          <a-table :columns="applicationColumns" :dataSource="applicationData" />
        </a-tab-pane>

        <a-tab-pane key="2" tab="作业审批">
          <div style="margin-bottom: 16px">
            <a-space>
              <a-select v-model:value="approvalStatus" style="width: 150px" placeholder="审批状态">
                <a-select-option value="all">全部</a-select-option>
                <a-select-option value="pending">待审批</a-select-option>
                <a-select-option value="approved">已批准</a-select-option>
                <a-select-option value="rejected">已拒绝</a-select-option>
              </a-select>
            </a-space>
          </div>
          <a-table :columns="approvalColumns" :dataSource="approvalData" />
        </a-tab-pane>

        <a-tab-pane key="3" tab="作业过程管理">
          <div style="margin-bottom: 16px">
            <a-space>
              <a-select v-model:value="processStatus" style="width: 150px" placeholder="作业状态">
                <a-select-option value="all">全部</a-select-option>
                <a-select-option value="scheduled">已预约</a-select-option>
                <a-select-option value="executing">执行中</a-select-option>
                <a-select-option value="completed">已完成</a-select-option>
              </a-select>
            </a-space>
          </div>
          <a-table :columns="processColumns" :dataSource="processData" />
        </a-tab-pane>

        <a-tab-pane key="4" tab="安全条件确认">
          <a-card>
            <a-descriptions title="安全条件确认清单" bordered>
              <a-descriptions-item label="作业环境检查">已完成</a-descriptions-item>
              <a-descriptions-item label="安全防护措施">已完成</a-descriptions-item>
              <a-descriptions-item label="作业人员资质">已完成</a-descriptions-item>
              <a-descriptions-item label="应急准备">已完成</a-descriptions-item>
              <a-descriptions-item label="监护人员到位">已完成</a-descriptions-item>
              <a-descriptions-item label="安全交底">已完成</a-descriptions-item>
            </a-descriptions>
          </a-card>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, h } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import type { TableColumnsType } from 'ant-design-vue'

const activeKey = ref('1')
const workType = ref('all')
const approvalStatus = ref('all')
const processStatus = ref('all')

const applicationColumns: TableColumnsType = [
  { title: '作业编号', dataIndex: 'number', key: 'number' },
  { title: '作业类型', dataIndex: 'type', key: 'type' },
  { title: '作业地点', dataIndex: 'location', key: 'location' },
  { title: '申请人', dataIndex: 'applicant', key: 'applicant' },
  { title: '申请时间', dataIndex: 'applyTime', key: 'applyTime' },
  { title: '计划开始时间', dataIndex: 'planStart', key: 'planStart' },
  { title: '计划结束时间', dataIndex: 'planEnd', key: 'planEnd' },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    customRender: ({ text: status }: { text: string }) => {
      const colorMap: Record<string, string> = {
        待审批: 'orange',
        已批准: 'green',
        已拒绝: 'red',
      }
      return h('a-tag', { color: colorMap[status] }, status)
    },
  },
  {
    title: '操作',
    key: 'action',
    customRender: () => {
      return h('div', [
        h('a-button', { type: 'link' }, { default: () => '查看详情' }),
        h('a-button', { type: 'link' }, { default: () => '编辑' }),
      ])
    },
  },
]

const applicationData = [
  {
    key: '1',
    number: 'ZW-2024-001',
    type: '动火作业',
    location: '1号储罐区',
    applicant: '张三',
    applyTime: '2024-01-15 08:30',
    planStart: '2024-01-16 09:00',
    planEnd: '2024-01-16 17:00',
    status: '待审批',
  },
  {
    key: '2',
    number: 'ZW-2024-002',
    type: '受限空间作业',
    location: '2号反应装置',
    applicant: '李四',
    applyTime: '2024-01-15 10:00',
    planStart: '2024-01-17 08:00',
    planEnd: '2024-01-17 12:00',
    status: '已批准',
  },
]

const approvalColumns: TableColumnsType = [
  { title: '作业编号', dataIndex: 'number', key: 'number' },
  { title: '作业类型', dataIndex: 'type', key: 'type' },
  { title: '申请人', dataIndex: 'applicant', key: 'applicant' },
  { title: '审批人', dataIndex: 'approver', key: 'approver' },
  { title: '审批时间', dataIndex: 'approvalTime', key: 'approvalTime' },
  { title: '审批意见', dataIndex: 'opinion', key: 'opinion' },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    customRender: ({ text: status }: { text: string }) => {
      const colorMap: Record<string, string> = {
        待审批: 'orange',
        已批准: 'green',
        已拒绝: 'red',
      }
      return h('a-tag', { color: colorMap[status] }, status)
    },
  },
  {
    title: '操作',
    key: 'action',
    customRender: () => {
      return h('div', [
        h('a-button', { type: 'link' }, { default: () => '审批' }),
        h('a-button', { type: 'link' }, { default: () => '查看详情' }),
      ])
    },
  },
]

const approvalData = [
  {
    key: '1',
    number: 'ZW-2024-001',
    type: '动火作业',
    applicant: '张三',
    approver: '-',
    approvalTime: '-',
    opinion: '-',
    status: '待审批',
  },
]

const processColumns: TableColumnsType = [
  { title: '作业编号', dataIndex: 'number', key: 'number' },
  { title: '作业类型', dataIndex: 'type', key: 'type' },
  { title: '作业地点', dataIndex: 'location', key: 'location' },
  { title: '作业人员', dataIndex: 'workers', key: 'workers' },
  { title: '监护人员', dataIndex: 'supervisor', key: 'supervisor' },
  { title: '开始时间', dataIndex: 'startTime', key: 'startTime' },
  { title: '结束时间', dataIndex: 'endTime', key: 'endTime' },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    customRender: ({ text: status }: { text: string }) => {
      const colorMap: Record<string, string> = {
        已预约: 'blue',
        执行中: 'processing',
        已完成: 'success',
      }
      return h('a-tag', { color: colorMap[status] }, status)
    },
  },
  {
    title: '操作',
    key: 'action',
    customRender: () => {
      return h('div', [
        h('a-button', { type: 'link' }, { default: () => '查看详情' }),
        h('a-button', { type: 'link' }, { default: () => '过程监控' }),
      ])
    },
  },
]

const processData = [
  {
    key: '1',
    number: 'ZW-2024-002',
    type: '受限空间作业',
    location: '2号反应装置',
    workers: '李四、王五',
    supervisor: '赵六',
    startTime: '2024-01-17 08:00',
    endTime: '-',
    status: '执行中',
  },
]
</script>
