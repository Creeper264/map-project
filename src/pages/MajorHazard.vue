<template>
  <div>
    <a-card>
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane key="1" tab="重大危险源安全包保责任">
          <a-alert
            message="包保责任落实"
            description="实现重大危险源主要负责人、技术负责人、操作负责人的安全包保履职结构化电子记录"
            type="info"
            show-icon
            style="margin-bottom: 16px"
          />
          <a-table :columns="hazardColumns" :dataSource="hazardData" />
        </a-tab-pane>

        <a-tab-pane key="2" tab="在线监测预警">
          <a-row :gutter="[16, 16]" style="margin-bottom: 16px">
            <a-col :xs="24" :sm="12" :lg="6">
              <a-card>
                <a-statistic
                  title="在线监测点"
                  :value="156"
                  :value-style="{ color: '#1890ff' }"
                >
                  <template #prefix>
                    <WarningOutlined />
                  </template>
                </a-statistic>
              </a-card>
            </a-col>
            <a-col :xs="24" :sm="12" :lg="6">
              <a-card>
                <a-statistic
                  title="当前报警"
                  :value="3"
                  :value-style="{ color: '#ff4d4f' }"
                >
                  <template #prefix>
                    <WarningOutlined />
                  </template>
                </a-statistic>
              </a-card>
            </a-col>
            <a-col :xs="24" :sm="12" :lg="6">
              <a-card>
                <a-statistic
                  title="已处理"
                  :value="28"
                  :value-style="{ color: '#52c41a' }"
                >
                  <template #prefix>
                    <CheckCircleOutlined />
                  </template>
                </a-statistic>
              </a-card>
            </a-col>
            <a-col :xs="24" :sm="12" :lg="6">
              <a-card>
                <a-statistic
                  title="处理中"
                  :value="5"
                  :value-style="{ color: '#faad14' }"
                >
                  <template #prefix>
                    <ClockCircleOutlined />
                  </template>
                </a-statistic>
              </a-card>
            </a-col>
          </a-row>
          <a-card title="实时监测数据" style="margin-bottom: 16px">
            <a-table :columns="monitorColumns" :dataSource="monitorData" />
          </a-card>
          <a-card title="视频监控智能分析">
            <div style="padding: 20px; text-align: center; background: #f5f5f5; border-radius: 4px">
              <p>视频监控画面区域</p>
              <p style="color: #999; font-size: 12px">
                支持对火灾、烟雾、人员违章等进行智能识别和预警
              </p>
            </div>
          </a-card>
        </a-tab-pane>

        <a-tab-pane key="3" tab="风险管控">
          <a-row :gutter="[16, 16]">
            <a-col :xs="24" :lg="12">
              <a-card title="风险分布统计">
                <v-chart :option="riskChartOption" style="height: 350px" />
              </a-card>
            </a-col>
            <a-col :xs="24" :lg="12">
              <a-card title="风险预警信息">
                <a-alert
                  message="重大风险预警"
                  description="1号储罐区温度异常，当前值85°C，超出正常范围20-60°C"
                  type="error"
                  show-icon
                  style="margin-bottom: 16px"
                />
                <a-alert
                  message="较大风险预警"
                  description="2号反应釜压力偏高，当前值1.2MPa，超出正常范围0.5-1.0MPa"
                  type="warning"
                  show-icon
                />
              </a-card>
            </a-col>
          </a-row>
        </a-tab-pane>

        <a-tab-pane key="4" tab="评价/评估报告及隐患管理">
          <a-table :columns="reportColumns" :dataSource="reportData" />
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, h } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
} from 'echarts/components'
import VChart from 'vue-echarts'
import {
  WarningOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  EyeOutlined,
} from '@ant-design/icons-vue'
import type { TableColumnsType } from 'ant-design-vue'

use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
])

const activeKey = ref('1')

const riskChartOption = {
  title: {
    text: '风险分布',
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
        { name: '重大风险', value: 2, itemStyle: { color: '#ff4d4f' } },
        { name: '较大风险', value: 5, itemStyle: { color: '#ff9800' } },
        { name: '一般风险', value: 12, itemStyle: { color: '#faad14' } },
        { name: '低风险', value: 28, itemStyle: { color: '#1890ff' } },
      ],
    },
  ],
}

const hazardColumns: TableColumnsType = [
  { title: '危险源名称', dataIndex: 'name', key: 'name' },
  { title: '危险源级别', dataIndex: 'level', key: 'level' },
  { title: '主要负责人', dataIndex: 'principal', key: 'principal' },
  { title: '技术负责人', dataIndex: 'tech', key: 'tech' },
  { title: '操作负责人', dataIndex: 'operator', key: 'operator' },
  {
    title: '风险等级',
    dataIndex: 'risk',
    key: 'risk',
    customRender: ({ text: risk }: { text: string }) => {
      const colorMap: Record<string, string> = {
        重大风险: 'red',
        较大风险: 'orange',
        一般风险: 'gold',
        低风险: 'blue',
      }
      return h('a-tag', { color: colorMap[risk] }, risk)
    },
  },
  {
    title: '操作',
    key: 'action',
    customRender: () => {
      return h('div', [
        h('a-button', { type: 'link' }, { default: () => '查看详情' }),
        h('a-button', { type: 'link' }, { default: () => '包保履职' }),
      ])
    },
  },
]

const hazardData = [
  {
    key: '1',
    name: '1号储罐区',
    level: '一级',
    principal: '张三',
    tech: '李四',
    operator: '王五',
    risk: '重大风险',
  },
  {
    key: '2',
    name: '2号反应装置',
    level: '二级',
    principal: '赵六',
    tech: '孙七',
    operator: '周八',
    risk: '较大风险',
  },
]

const monitorColumns: TableColumnsType = [
  { title: '监测点名称', dataIndex: 'name', key: 'name' },
  { title: '监测参数', dataIndex: 'param', key: 'param' },
  { title: '当前值', dataIndex: 'value', key: 'value' },
  { title: '正常范围', dataIndex: 'range', key: 'range' },
  { title: '报警时间', dataIndex: 'alarmTime', key: 'alarmTime' },
  {
    title: '报警级别',
    dataIndex: 'level',
    key: 'level',
    customRender: ({ text: level }: { text: string }) => {
      const colorMap: Record<string, string> = {
        高: 'red',
        中: 'orange',
        低: 'gold',
      }
      return h('a-tag', { color: colorMap[level] }, level)
    },
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    customRender: ({ text: status }: { text: string }) => {
      const colorMap: Record<string, string> = {
        已处理: 'green',
        处理中: 'orange',
        待处理: 'red',
      }
      return h('a-tag', { color: colorMap[status] }, status)
    },
  },
]

const monitorData = [
  {
    key: '1',
    name: '1号储罐温度',
    param: '温度',
    value: '85°C',
    range: '20-60°C',
    alarmTime: '2024-01-15 10:30',
    level: '高',
    status: '处理中',
  },
  {
    key: '2',
    name: '2号反应釜压力',
    param: '压力',
    value: '1.2MPa',
    range: '0.5-1.0MPa',
    alarmTime: '2024-01-15 14:20',
    level: '中',
    status: '待处理',
  },
]

const reportColumns: TableColumnsType = [
  { title: '报告名称', dataIndex: 'name', key: 'name' },
  { title: '报告类型', dataIndex: 'type', key: 'type' },
  { title: '编制日期', dataIndex: 'date', key: 'date' },
  { title: '有效期', dataIndex: 'validity', key: 'validity' },
  {
    title: '操作',
    key: 'action',
    customRender: () => {
      return h('div', [
        h('a-button', { type: 'link' }, { default: () => '查看' }),
        h('a-button', { type: 'link' }, { default: () => '下载' }),
      ])
    },
  },
]

const reportData = [
  {
    key: '1',
    name: '重大危险源安全评价报告',
    type: '安全评价',
    date: '2023-06-15',
    validity: '2026-06-14',
  },
  {
    key: '2',
    name: 'SIL等级评估报告',
    type: 'SIL评估',
    date: '2023-09-20',
    validity: '2026-09-19',
  },
]
</script>
