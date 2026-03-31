<template>
  <div>
    <a-row :gutter="[16, 16]">
      <a-col :xs="24" :sm="12" :lg="6">
        <a-card>
          <a-statistic
            title="重大危险源"
            :value="8"
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
            title="在线监测点"
            :value="156"
            :value-style="{ color: '#1890ff' }"
          >
            <template #prefix>
              <SafetyOutlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="12" :lg="6">
        <a-card>
          <a-statistic
            title="隐患整改完成率"
            :value="92.5"
            suffix="%"
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
            title="待处理预警"
            :value="3"
            :value-style="{ color: '#faad14' }"
          >
            <template #prefix>
              <ClockCircleOutlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="[16, 16]" style="margin-top: 16px">
      <a-col :xs="24" :lg="12">
        <a-card title="风险分布统计" style="height: 400px">
          <v-chart :option="riskChartOption" style="height: 350px" />
        </a-card>
      </a-col>
      <a-col :xs="24" :lg="12">
        <a-card title="最新预警信息" style="height: 400px">
          <a-table
            :dataSource="alarmData"
            :columns="alarmColumns"
            :pagination="false"
            size="small"
          />
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { h } from 'vue'
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
  SafetyOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons-vue'
import type { TableColumnsType } from 'ant-design-vue'

use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
])

const riskChartOption = {
  title: {
    text: '风险分布统计',
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
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
    },
  ],
}

const alarmColumns: TableColumnsType = [
  { title: '时间', dataIndex: 'time', key: 'time' },
  { title: '级别', dataIndex: 'level', key: 'level' },
  { title: '类型', dataIndex: 'type', key: 'type' },
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

const alarmData = [
  { key: '1', time: '2024-01-15 08:30', level: '高', type: '温度异常', status: '已处理' },
  { key: '2', time: '2024-01-15 10:15', level: '中', type: '压力异常', status: '处理中' },
  { key: '3', time: '2024-01-15 14:20', level: '低', type: '液位异常', status: '待处理' },
]
</script>
