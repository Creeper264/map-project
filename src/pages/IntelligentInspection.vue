<template>
  <div>
    <a-card>
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane key="1" tab="巡检任务">
          <div style="margin-bottom: 16px">
            <a-space>
              <a-button type="primary">
                <template #icon><PlusOutlined /></template>
                创建巡检任务
              </a-button>
              <a-select v-model:value="taskStatus" style="width: 150px" placeholder="任务状态">
                <a-select-option value="all">全部</a-select-option>
                <a-select-option value="pending">待执行</a-select-option>
                <a-select-option value="executing">执行中</a-select-option>
                <a-select-option value="completed">已完成</a-select-option>
              </a-select>
            </a-space>
          </div>
          <a-table :columns="taskColumns" :dataSource="taskData" />
        </a-tab-pane>

        <a-tab-pane key="2" tab="巡检路线">
          <a-row :gutter="[16, 16]">
            <a-col :xs="24" :lg="8">
              <a-card title="巡检路线列表">
                <a-list :dataSource="routeList" item-layout="horizontal">
                  <template #renderItem="{ item }">
                    <a-list-item>
                      <a-list-item-meta>
                        <template #title>
                          <a @click="selectRoute(item)">{{ item.name }}</a>
                        </template>
                        <template #description>
                          <span>巡检点: {{ item.points }}个</span>
                        </template>
                      </a-list-item-meta>
                    </a-list-item>
                  </template>
                </a-list>
              </a-card>
            </a-col>
            <a-col :xs="24" :lg="16">
              <a-card :title="selectedRoute ? selectedRoute.name : '巡检路线地图'">
                <div class="map-container" style="height: 500px">
                  <div class="map-toolbar">
                    <a-space>
                      <a-button size="small" @click="zoomIn">
                        <template #icon><ZoomInOutlined /></template>
                      </a-button>
                      <a-button size="small" @click="zoomOut">
                        <template #icon><ZoomOutOutlined /></template>
                      </a-button>
                      <a-button size="small" @click="resetView">重置</a-button>
                    </a-space>
                  </div>
                  <div 
                    class="map-wrapper"
                    :style="{ transform: `scale(${mapScale})`, transformOrigin: 'top left' }"
                  >
                    <img 
                      src="/campus-map.png" 
                      alt="校园地图" 
                      class="map-image"
                      style="min-height: 500px"
                      @error="handleImageError"
                    />
                    <!-- 巡检路线 -->
                    <svg v-if="selectedRoute" class="route-overlay">
                      <polyline
                        :points="routePath"
                        fill="none"
                        stroke="#1890ff"
                        stroke-width="4"
                        opacity="0.8"
                      />
                    </svg>
                    <!-- 巡检点标记 -->
                    <div
                      v-for="point in inspectionPoints"
                      :key="point.id"
                      class="inspection-point"
                      :class="point.status"
                      :style="{ left: point.x + '%', top: point.y + '%' }"
                      @mouseenter="showPointTooltip(point)"
                      @mouseleave="hidePointTooltip"
                    >
                      <div class="point-icon">
                        <span v-if="point.status === 'start'">起</span>
                        <span v-else-if="point.status === 'completed'">✓</span>
                        <span v-else-if="point.status === 'abnormal'">!</span>
                        <span v-else>{{ point.order }}</span>
                      </div>
                      <div v-if="tooltipVisible && tooltipPoint?.id === point.id" class="tooltip">
                        <div><strong>{{ point.name }}</strong></div>
                        <div>状态: {{ point.statusName }}</div>
                        <div>巡检人: {{ point.inspector }}</div>
                        <div>时间: {{ point.time }}</div>
                      </div>
                    </div>
                    <div v-if="!selectedRoute" class="map-placeholder">
                      <p>请选择巡检路线查看地图</p>
                    </div>
                  </div>
                  <div class="map-legend">
                    <a-space>
                      <div>
                        <span class="legend-point start">起</span>
                        <span>起点</span>
                      </div>
                      <div>
                        <span class="legend-point normal">1</span>
                        <span>巡检点</span>
                      </div>
                      <div>
                        <span class="legend-point completed">✓</span>
                        <span>已完成</span>
                      </div>
                      <div>
                        <span class="legend-point abnormal">!</span>
                        <span>异常</span>
                      </div>
                    </a-space>
                  </div>
                </div>
              </a-card>
            </a-col>
          </a-row>
        </a-tab-pane>

        <a-tab-pane key="3" tab="巡检记录">
          <div style="margin-bottom: 16px">
            <a-space>
              <a-range-picker v-model:value="dateRange" />
              <a-select v-model:value="recordStatus" style="width: 150px" placeholder="记录状态">
                <a-select-option value="all">全部</a-select-option>
                <a-select-option value="normal">正常</a-select-option>
                <a-select-option value="abnormal">异常</a-select-option>
              </a-select>
            </a-space>
          </div>
          <a-table :columns="recordColumns" :dataSource="recordData" />
        </a-tab-pane>

        <a-tab-pane key="4" tab="统计分析">
          <a-row :gutter="[16, 16]">
            <a-col :xs="24" :lg="12">
              <a-card title="巡检完成率统计">
                <v-chart :option="completionChartOption" style="height: 350px" />
              </a-card>
            </a-col>
            <a-col :xs="24" :lg="12">
              <a-card title="异常发现统计">
                <v-chart :option="abnormalChartOption" style="height: 350px" />
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
import { LineChart, BarChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from 'echarts/components'
import VChart from 'vue-echarts'
import { PlusOutlined, ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons-vue'
import dayjs, { type Dayjs } from 'dayjs'
import type { TableColumnsType } from 'ant-design-vue'

use([
  CanvasRenderer,
  LineChart,
  BarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
])

const activeKey = ref('1')
const taskStatus = ref('all')
const dateRange = ref<[Dayjs, Dayjs] | null>(null)
const recordStatus = ref('all')
const selectedRoute = ref<any>(null)
const mapScale = ref(1)
const tooltipVisible = ref(false)
const tooltipPoint = ref<any>(null)
const imageError = ref(false)

// 巡检点数据（示例数据，实际应从API获取）
const inspectionPoints = ref<Array<{
  id: number
  name: string
  x: number
  y: number
  status: string
  statusName: string
  inspector: string
  time: string
  order: number
}>>([])

// 巡检路线路径（示例数据）
const routePath = ref('')

const zoomIn = () => {
  if (mapScale.value < 2) {
    mapScale.value += 0.1
  }
}

const zoomOut = () => {
  if (mapScale.value > 0.5) {
    mapScale.value -= 0.1
  }
}

const resetView = () => {
  mapScale.value = 1
}

const showPointTooltip = (point: any) => {
  tooltipPoint.value = point
  tooltipVisible.value = true
}

const hidePointTooltip = () => {
  tooltipVisible.value = false
  tooltipPoint.value = null
}

const handleImageError = () => {
  imageError.value = true
}

// 根据选择的路线生成巡检点和路线
const generateRouteData = (route: any) => {
  if (!route) {
    inspectionPoints.value = []
    routePath.value = ''
    return
  }

  // 示例巡检点数据（实际应从API获取）
  if (route.id === 1) {
    // 储罐区巡检路线
    inspectionPoints.value = [
      { id: 1, name: '1号储罐温度监测点', x: 25, y: 30, status: 'start', statusName: '起点', inspector: '张三', time: '08:00', order: 0 },
      { id: 2, name: '2号储罐压力监测点', x: 35, y: 35, status: 'completed', statusName: '已完成', inspector: '张三', time: '08:15', order: 1 },
      { id: 3, name: '3号储罐液位监测点', x: 45, y: 40, status: 'completed', statusName: '已完成', inspector: '张三', time: '08:30', order: 2 },
      { id: 4, name: '4号储罐安全阀', x: 55, y: 45, status: 'normal', statusName: '待巡检', inspector: '张三', time: '-', order: 3 },
    ]
    routePath.value = '25%,30% 35%,35% 45%,40% 55%,45%'
  } else if (route.id === 2) {
    // 反应装置巡检路线
    inspectionPoints.value = [
      { id: 5, name: '1号反应釜温度', x: 60, y: 50, status: 'start', statusName: '起点', inspector: '李四', time: '14:00', order: 0 },
      { id: 6, name: '2号反应釜压力', x: 70, y: 55, status: 'abnormal', statusName: '异常', inspector: '李四', time: '14:20', order: 1 },
      { id: 7, name: '3号反应釜搅拌器', x: 80, y: 60, status: 'normal', statusName: '待巡检', inspector: '李四', time: '-', order: 2 },
    ]
    routePath.value = '60%,50% 70%,55% 80%,60%'
  } else {
    inspectionPoints.value = []
    routePath.value = ''
  }
}

const completionChartOption = {
  title: {
    text: '巡检完成率',
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
    max: 100,
    axisLabel: {
      formatter: '{value}%',
    },
  },
  series: [
    {
      name: '完成率',
      type: 'line',
      data: [95, 98, 92, 96, 94, 97],
      itemStyle: { color: '#1890ff' },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(24, 144, 255, 0.3)' },
            { offset: 1, color: 'rgba(24, 144, 255, 0.1)' },
          ],
        },
      },
    },
  ],
}

const abnormalChartOption = {
  title: {
    text: '异常发现统计',
    left: 'center',
  },
  tooltip: {
    trigger: 'axis',
  },
  xAxis: {
    type: 'category',
    data: ['设备故障', '安全隐患', '环境异常', '其他'],
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      name: '异常数量',
      type: 'bar',
      data: [12, 8, 5, 3],
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: '#ff4d4f' },
            { offset: 1, color: '#ff7875' },
          ],
        },
      },
    },
  ],
}

const taskColumns: TableColumnsType = [
  { title: '任务名称', dataIndex: 'name', key: 'name' },
  { title: '巡检路线', dataIndex: 'route', key: 'route' },
  { title: '执行人', dataIndex: 'executor', key: 'executor' },
  { title: '计划时间', dataIndex: 'planTime', key: 'planTime' },
  { title: '完成时间', dataIndex: 'completeTime', key: 'completeTime' },
  { title: '完成进度', dataIndex: 'progress', key: 'progress' },
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
        h('a-button', { type: 'link' }, { default: () => '实时监控' }),
      ])
    },
  },
]

const taskData = [
  {
    key: '1',
    name: '日常巡检-储罐区',
    route: '储罐区巡检路线',
    executor: '张三',
    planTime: '2024-01-15 08:00',
    completeTime: '2024-01-15 10:30',
    progress: '100%',
    status: '已完成',
  },
  {
    key: '2',
    name: '日常巡检-反应装置',
    route: '反应装置巡检路线',
    executor: '李四',
    planTime: '2024-01-15 14:00',
    completeTime: '-',
    progress: '60%',
    status: '执行中',
  },
]

const routeList = [
  { id: 1, name: '储罐区巡检路线', points: 12 },
  { id: 2, name: '反应装置巡检路线', points: 8 },
  { id: 3, name: '公用工程巡检路线', points: 15 },
  { id: 4, name: '辅助设施巡检路线', points: 10 },
]

const selectRoute = (route: any) => {
  selectedRoute.value = route
  generateRouteData(route)
}

const recordColumns: TableColumnsType = [
  { title: '记录编号', dataIndex: 'number', key: 'number' },
  { title: '巡检点', dataIndex: 'point', key: 'point' },
  { title: '巡检人', dataIndex: 'inspector', key: 'inspector' },
  { title: '巡检时间', dataIndex: 'time', key: 'time' },
  { title: '巡检结果', dataIndex: 'result', key: 'result' },
  { title: '异常描述', dataIndex: 'abnormal', key: 'abnormal' },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    customRender: ({ text: status }: { text: string }) => {
      const colorMap: Record<string, string> = {
        正常: 'green',
        异常: 'red',
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

const recordData = [
  {
    key: '1',
    number: 'XJ-2024-001',
    point: '1号储罐温度监测点',
    inspector: '张三',
    time: '2024-01-15 08:30',
    result: '温度正常',
    abnormal: '-',
    status: '正常',
  },
  {
    key: '2',
    number: 'XJ-2024-002',
    point: '2号反应釜压力监测点',
    inspector: '李四',
    time: '2024-01-15 09:15',
    result: '压力偏高',
    abnormal: '压力值1.2MPa，超出正常范围',
    status: '异常',
  },
]
</script>

<style scoped>
.map-container {
  position: relative;
  height: 500px;
  border-radius: 4px;
  overflow: hidden;
  background: #f5f5f5;
}

.map-toolbar {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
  background: rgba(255, 255, 255, 0.9);
  padding: 8px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.map-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: auto;
}

.map-image {
  width: 100%;
  height: auto;
  display: block;
}

.map-placeholder {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #999;
  text-align: center;
  z-index: 1;
}

.route-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
}

.inspection-point {
  position: absolute;
  cursor: pointer;
  z-index: 5;
  transform: translate(-50%, -50%);
}

.point-icon {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 12px;
  font-weight: bold;
  border: 2px solid #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s;
}

.inspection-point:hover .point-icon {
  transform: scale(1.2);
}

.inspection-point.start .point-icon {
  background: #1890ff;
}

.inspection-point.normal .point-icon {
  background: #52c41a;
}

.inspection-point.completed .point-icon {
  background: #52c41a;
}

.inspection-point.abnormal .point-icon {
  background: #ff4d4f;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.tooltip {
  position: absolute;
  bottom: 35px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.85);
  color: #fff;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 20;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.tooltip::after {
  content: '';
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-top-color: rgba(0, 0, 0, 0.85);
}

.map-legend {
  position: absolute;
  bottom: 10px;
  left: 10px;
  background: rgba(255, 255, 255, 0.9);
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 12px;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.legend-point {
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin-right: 4px;
  border: 2px solid #fff;
  text-align: center;
  line-height: 16px;
  font-size: 10px;
  font-weight: bold;
  color: #fff;
  vertical-align: middle;
}

.legend-point.start {
  background: #1890ff;
}

.legend-point.normal {
  background: #52c41a;
}

.legend-point.completed {
  background: #52c41a;
}

.legend-point.abnormal {
  background: #ff4d4f;
}
</style>
