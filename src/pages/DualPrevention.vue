<template>
  <div>
    <a-card>
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane key="1" tab="风险分析清单">
          <div style="margin-bottom: 16px">
            <a-space>
              <a-button type="primary">
                <template #icon><PlusOutlined /></template>
                新增风险点
              </a-button>
              <a-button>导入风险清单</a-button>
              <a-button>导出风险清单</a-button>
            </a-space>
          </div>
          <a-table :columns="riskColumns" :dataSource="riskData" />
        </a-tab-pane>

        <a-tab-pane key="2" tab="排查任务">
          <div style="margin-bottom: 16px">
            <a-space>
              <a-button type="primary">
                <template #icon><PlusOutlined /></template>
                创建排查任务
              </a-button>
              <a-select v-model:value="taskStatus" style="width: 150px" placeholder="筛选状态">
                <a-select-option value="all">全部</a-select-option>
                <a-select-option value="pending">待执行</a-select-option>
                <a-select-option value="executing">执行中</a-select-option>
                <a-select-option value="completed">已完成</a-select-option>
              </a-select>
            </a-space>
          </div>
          <a-table :columns="taskColumns" :dataSource="taskData" />
        </a-tab-pane>

        <a-tab-pane key="3" tab="隐患治理">
          <div style="margin-bottom: 16px">
            <a-space>
              <a-button type="primary">隐患录入</a-button>
              <a-select v-model:value="hiddenDangerStatus" style="width: 150px" placeholder="筛选状态">
                <a-select-option value="all">全部</a-select-option>
                <a-select-option value="pending">待整改</a-select-option>
                <a-select-option value="rectifying">整改中</a-select-option>
                <a-select-option value="completed">已完成</a-select-option>
              </a-select>
            </a-space>
          </div>
          <a-table :columns="hiddenDangerColumns" :dataSource="hiddenDangerData" />
        </a-tab-pane>

        <a-tab-pane key="4" tab="机制运行成效">
          <a-row :gutter="[16, 16]">
            <a-col :xs="24" :lg="12">
              <a-card title="风险分级统计">
                <v-chart :option="riskLevelChartOption" style="height: 350px" />
              </a-card>
            </a-col>
            <a-col :xs="24" :lg="12">
              <a-card title="隐患治理统计">
                <v-chart :option="hiddenDangerChartOption" style="height: 350px" />
              </a-card>
            </a-col>
          </a-row>
          <a-row :gutter="[16, 16]" style="margin-top: 16px">
            <a-col :xs="24">
              <a-card title="机制运行监督预警">
                <a-alert
                  message="风险管控预警"
                  description="发现3个高风险点未及时更新管控措施，请及时处理"
                  type="warning"
                  show-icon
                  style="margin-bottom: 16px"
                />
                <a-alert
                  message="隐患排查预警"
                  description="本月排查任务完成率85%，低于目标值90%，请加强排查工作"
                  type="info"
                  show-icon
                />
              </a-card>
            </a-col>
          </a-row>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, h } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart, BarChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from 'echarts/components'
import VChart from 'vue-echarts'
import { PlusOutlined } from '@ant-design/icons-vue'
import type { TableColumnsType } from 'ant-design-vue'

use([
  CanvasRenderer,
  PieChart,
  BarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
])

const activeKey = ref('1')
const taskStatus = ref('all')
const hiddenDangerStatus = ref('all')

const riskLevelChartOption = {
  title: {
    text: '风险分级统计',
    left: 'center',
  },
  tooltip: {
    trigger: 'item',
  },
  legend: {
    orient: 'vertical',
    left: 'left',
  },
  series: [
    {
      name: '风险等级',
      type: 'pie',
      radius: '50%',
      data: [
        { name: '重大风险', value: 5, itemStyle: { color: '#ff4d4f' } },
        { name: '较大风险', value: 12, itemStyle: { color: '#ff9800' } },
        { name: '一般风险', value: 28, itemStyle: { color: '#faad14' } },
        { name: '低风险', value: 45, itemStyle: { color: '#1890ff' } },
      ],
    },
  ],
}

const hiddenDangerChartOption = {
  title: {
    text: '隐患治理统计',
    left: 'center',
  },
  tooltip: {
    trigger: 'axis',
  },
  xAxis: {
    type: 'category',
    data: ['1月', '2月', '3月', '4月', '5月', '6月'],
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      name: '发现隐患',
      type: 'bar',
      data: [12, 15, 18, 10, 14, 16],
      itemStyle: { color: '#ff4d4f' },
    },
    {
      name: '已整改',
      type: 'bar',
      data: [10, 14, 16, 9, 13, 15],
      itemStyle: { color: '#52c41a' },
    },
  ],
}

const riskColumns: TableColumnsType = [
  { title: '风险点名称', dataIndex: 'name', key: 'name' },
  { title: '风险等级', dataIndex: 'level', key: 'level' },
  { title: '风险类型', dataIndex: 'type', key: 'type' },
  { title: '管控措施', dataIndex: 'measures', key: 'measures' },
  { title: '责任人', dataIndex: 'responsible', key: 'responsible' },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    customRender: ({ text: status }: { text: string }) => {
      const colorMap: Record<string, string> = {
        正常: 'green',
        预警: 'orange',
        异常: 'red',
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
        h('a-button', { type: 'link' }, { default: () => '查看详情' }),
      ])
    },
  },
]

const riskData = [
  {
    key: '1',
    name: '1号储罐区',
    level: '重大风险',
    type: '火灾爆炸',
    measures: '温度监控、压力监控、液位监控',
    responsible: '张三',
    status: '正常',
  },
  {
    key: '2',
    name: '2号反应装置',
    level: '较大风险',
    type: '中毒窒息',
    measures: '有毒气体检测、通风系统',
    responsible: '李四',
    status: '预警',
  },
]

const taskColumns: TableColumnsType = [
  { title: '任务名称', dataIndex: 'name', key: 'name' },
  { title: '排查类型', dataIndex: 'type', key: 'type' },
  { title: '排查范围', dataIndex: 'scope', key: 'scope' },
  { title: '执行人', dataIndex: 'executor', key: 'executor' },
  { title: '计划时间', dataIndex: 'planTime', key: 'planTime' },
  { title: '完成时间', dataIndex: 'completeTime', key: 'completeTime' },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    customRender: ({ text: status }: { text: string }) => {
      const colorMap: Record<string, string> = {
        待执行: 'default',
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
        h('a-button', { type: 'link' }, { default: () => '执行' }),
      ])
    },
  },
]

const taskData = [
  {
    key: '1',
    name: '月度综合排查',
    type: '综合排查',
    scope: '全厂区',
    executor: '安全部',
    planTime: '2024-01-20',
    completeTime: '-',
    status: '待执行',
  },
  {
    key: '2',
    name: '储罐区专项排查',
    type: '专项排查',
    scope: '储罐区',
    executor: '李四',
    planTime: '2024-01-15',
    completeTime: '2024-01-15',
    status: '已完成',
  },
]

const hiddenDangerColumns: TableColumnsType = [
  { title: '隐患编号', dataIndex: 'number', key: 'number' },
  { title: '隐患描述', dataIndex: 'description', key: 'description' },
  { title: '隐患等级', dataIndex: 'level', key: 'level' },
  { title: '发现时间', dataIndex: 'findTime', key: 'findTime' },
  { title: '整改责任人', dataIndex: 'responsible', key: 'responsible' },
  { title: '整改期限', dataIndex: 'deadline', key: 'deadline' },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    customRender: ({ text: status }: { text: string }) => {
      const colorMap: Record<string, string> = {
        待整改: 'red',
        整改中: 'orange',
        已完成: 'green',
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
        h('a-button', { type: 'link' }, { default: () => '整改反馈' }),
      ])
    },
  },
]

const hiddenDangerData = [
  {
    key: '1',
    number: 'HD-2024-001',
    description: '1号储罐区安全阀未定期校验',
    level: '重大隐患',
    findTime: '2024-01-10',
    responsible: '王五',
    deadline: '2024-01-25',
    status: '整改中',
  },
  {
    key: '2',
    number: 'HD-2024-002',
    description: '2号反应装置压力表读数异常',
    level: '一般隐患',
    findTime: '2024-01-12',
    responsible: '赵六',
    deadline: '2024-01-20',
    status: '待整改',
  },
]
</script>
