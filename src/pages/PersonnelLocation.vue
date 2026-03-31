<template>
  <div>
    <a-card>
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane key="1" tab="人员实时定位">
          <a-row :gutter="[16, 16]">
            <a-col :xs="24" :lg="6">
              <a-card title="人员统计">
                <a-statistic
                  title="在岗人员"
                  :value="156"
                  :value-style="{ color: '#1890ff' }"
                  style="margin-bottom: 16px"
                />
                <a-statistic
                  title="外来人员"
                  :value="12"
                  :value-style="{ color: '#faad14' }"
                  style="margin-bottom: 16px"
                />
                <a-statistic
                  title="报警人员"
                  :value="3"
                  :value-style="{ color: '#ff4d4f' }"
                />
              </a-card>
              <a-card title="区域人员分布" style="margin-top: 16px">
                <a-list :dataSource="areaList" size="small">
                  <template #renderItem="{ item }">
                    <a-list-item>
                      <a-list-item-meta>
                        <template #title>{{ item.name }}</template>
                        <template #description>{{ item.count }}人</template>
                      </a-list-item-meta>
                    </a-list-item>
                  </template>
                </a-list>
              </a-card>
            </a-col>
            <a-col :xs="24" :lg="18">
              <a-card title="人员定位地图">
                <div class="map-container">
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
                    id="location-map" 
                    class="map-wrapper"
                    :style="{ transform: `scale(${mapScale})`, transformOrigin: 'top left' }"
                    @mousemove="handleMapMouseMove"
                  >
                    <img 
                      src="/campus-map.png" 
                      alt="校园地图" 
                      class="map-image"
                      @error="handleImageError"
                    />
                    <!-- 人员标记点 -->
                    <div
                      v-for="person in personMarkers"
                      :key="person.id"
                      class="person-marker"
                      :class="person.type"
                      :style="{ left: person.x + '%', top: person.y + '%' }"
                      @mouseenter="showPersonTooltip(person)"
                      @mouseleave="hidePersonTooltip"
                    >
                      <div class="marker-dot"></div>
                      <div v-if="tooltipVisible && tooltipPerson?.id === person.id" class="tooltip">
                        <div><strong>{{ person.name }}</strong></div>
                        <div>类型: {{ person.typeName }}</div>
                        <div>位置: {{ person.location }}</div>
                        <div>时间: {{ person.time }}</div>
                      </div>
                    </div>
                    <!-- 区域标记 -->
                    <div
                      v-for="area in areaMarkers"
                      :key="area.id"
                      class="area-marker"
                      :class="area.type"
                      :style="{ left: area.x + '%', top: area.y + '%', width: area.width + '%', height: area.height + '%' }"
                    ></div>
                  </div>
                  <div class="map-legend">
                    <a-space>
                      <div>
                        <span class="legend-dot blue"></span>
                        <span>在岗人员 (156人)</span>
                      </div>
                      <div>
                        <span class="legend-dot orange"></span>
                        <span>外来人员 (12人)</span>
                      </div>
                      <div>
                        <span class="legend-dot red"></span>
                        <span>报警人员 (3人)</span>
                      </div>
                      <div>
                        <span class="legend-area green"></span>
                        <span>安全区域</span>
                      </div>
                      <div>
                        <span class="legend-area red"></span>
                        <span>危险区域</span>
                      </div>
                    </a-space>
                  </div>
                </div>
              </a-card>
            </a-col>
          </a-row>
        </a-tab-pane>

        <a-tab-pane key="2" tab="人员活动轨迹">
          <div style="margin-bottom: 16px">
            <a-space>
              <a-select v-model:value="selectedPerson" style="width: 200px" placeholder="选择人员">
                <a-select-option value="person1">张三</a-select-option>
                <a-select-option value="person2">李四</a-select-option>
                <a-select-option value="person3">王五</a-select-option>
              </a-select>
              <a-range-picker v-model:value="trajectoryDateRange" />
              <a-button type="primary">查询轨迹</a-button>
            </a-space>
          </div>
          <a-card title="活动轨迹地图">
            <div class="map-container" style="height: 500px">
              <div class="map-wrapper">
                <img 
                  src="/campus-map.png" 
                  alt="校园地图" 
                  class="map-image"
                  style="min-height: 500px"
                  @error="handleImageError"
                />
                <!-- 轨迹路线 -->
                <svg v-if="selectedPerson && trajectoryPoints" class="trajectory-overlay">
                  <polyline
                    :points="trajectoryPoints"
                    fill="none"
                    stroke="#1890ff"
                    stroke-width="3"
                    stroke-dasharray="5,5"
                    opacity="0.8"
                  />
                  <circle
                    v-for="(point, index) in trajectoryPointsArray"
                    :key="index"
                    :cx="point.x + '%'"
                    :cy="point.y + '%'"
                    r="5"
                    fill="#1890ff"
                    stroke="#fff"
                    stroke-width="2"
                  />
                </svg>
                <div v-if="!selectedPerson" class="map-placeholder">
                  <p>请选择人员查看活动轨迹</p>
                </div>
              </div>
            </div>
          </a-card>
        </a-tab-pane>

        <a-tab-pane key="3" tab="报警信息">
          <div style="margin-bottom: 16px">
            <a-space>
              <a-select v-model:value="alarmType" style="width: 150px" placeholder="报警类型">
                <a-select-option value="all">全部</a-select-option>
                <a-select-option value="sos">SOS报警</a-select-option>
                <a-select-option value="area">区域报警</a-select-option>
                <a-select-option value="timeout">超时报警</a-select-option>
              </a-select>
            </a-space>
          </div>
          <a-table :columns="alarmColumns" :dataSource="alarmData" />
        </a-tab-pane>

        <a-tab-pane key="4" tab="统计分析">
          <a-row :gutter="[16, 16]">
            <a-col :xs="24" :lg="12">
              <a-card title="人员分布统计">
                <v-chart :option="distributionChartOption" style="height: 350px" />
              </a-card>
            </a-col>
            <a-col :xs="24" :lg="12">
              <a-card title="人员流动趋势">
                <v-chart :option="trendChartOption" style="height: 350px" />
              </a-card>
            </a-col>
          </a-row>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, h, watch } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart, LineChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from 'echarts/components'
import VChart from 'vue-echarts'
import { ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons-vue'
import dayjs, { type Dayjs } from 'dayjs'
import type { TableColumnsType } from 'ant-design-vue'

use([
  CanvasRenderer,
  PieChart,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
])

const activeKey = ref('1')
const selectedPerson = ref('')
const trajectoryDateRange = ref<[Dayjs, Dayjs] | null>(null)
const alarmType = ref('all')
const mapScale = ref(1)
const tooltipVisible = ref(false)
const tooltipPerson = ref<any>(null)
const imageError = ref(false)

// 人员标记点数据（示例数据，实际应从API获取）
const personMarkers = ref([
  { id: 1, name: '张三', type: 'normal', typeName: '在岗人员', x: 25, y: 30, location: '1号储罐区', time: '10:30' },
  { id: 2, name: '李四', type: 'normal', typeName: '在岗人员', x: 45, y: 35, location: '2号反应装置', time: '10:32' },
  { id: 3, name: '王五', type: 'visitor', typeName: '外来人员', x: 60, y: 50, location: '办公区', time: '10:35' },
  { id: 4, name: '赵六', type: 'alarm', typeName: '报警人员', x: 30, y: 40, location: '危险区域', time: '10:28' },
])

// 区域标记数据
const areaMarkers = ref([
  { id: 1, type: 'safe', x: 20, y: 25, width: 15, height: 20 },
  { id: 2, type: 'danger', x: 25, y: 30, width: 10, height: 15 },
])

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

const showPersonTooltip = (person: any) => {
  tooltipPerson.value = person
  tooltipVisible.value = true
}

const hidePersonTooltip = () => {
  tooltipVisible.value = false
  tooltipPerson.value = null
}

const handleMapMouseMove = () => {
  // 可以在这里添加鼠标移动相关的逻辑
}

const handleImageError = () => {
  imageError.value = true
}

// 轨迹数据（示例）
const trajectoryPoints = ref('')
const trajectoryPointsArray = ref<Array<{ x: number; y: number }>>([])

// 当选择人员时，生成轨迹数据
const generateTrajectory = () => {
  if (selectedPerson.value) {
    // 示例轨迹点（使用百分比坐标，实际应从API获取）
    const points = [
      { x: 20, y: 25 },
      { x: 30, y: 30 },
      { x: 40, y: 35 },
      { x: 50, y: 40 },
      { x: 60, y: 45 },
    ]
    trajectoryPointsArray.value = points
    trajectoryPoints.value = points.map(p => `${p.x}%,${p.y}%`).join(' ')
  } else {
    trajectoryPoints.value = ''
    trajectoryPointsArray.value = []
  }
}

// 监听选择人员变化
watch(selectedPerson, () => {
  generateTrajectory()
})

const distributionChartOption = {
  title: {
    text: '人员分布统计',
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
      name: '人员分布',
      type: 'pie',
      radius: '50%',
      data: [
        { name: '生产区', value: 65, itemStyle: { color: '#1890ff' } },
        { name: '储罐区', value: 32, itemStyle: { color: '#52c41a' } },
        { name: '办公区', value: 28, itemStyle: { color: '#faad14' } },
        { name: '辅助区', value: 31, itemStyle: { color: '#ff9800' } },
      ],
    },
  ],
}

const trendChartOption = {
  title: {
    text: '人员流动趋势',
    left: 'center',
  },
  tooltip: {
    trigger: 'axis',
  },
  xAxis: {
    type: 'category',
    data: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00'],
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      name: '在岗人数',
      type: 'line',
      data: [120, 145, 130, 150, 140, 100],
      itemStyle: { color: '#1890ff' },
      smooth: true,
    },
  ],
}

const areaList = [
  { name: '生产区', count: 65 },
  { name: '储罐区', count: 32 },
  { name: '办公区', count: 28 },
  { name: '辅助区', count: 31 },
]

const alarmColumns: TableColumnsType = [
  { title: '报警时间', dataIndex: 'time', key: 'time' },
  { title: '人员姓名', dataIndex: 'name', key: 'name' },
  { title: '报警类型', dataIndex: 'type', key: 'type' },
  { title: '报警位置', dataIndex: 'location', key: 'location' },
  { title: '报警描述', dataIndex: 'description', key: 'description' },
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
  {
    title: '操作',
    key: 'action',
    customRender: () => {
      return h('div', [
        h('a-button', { type: 'link' }, { default: () => '查看详情' }),
        h('a-button', { type: 'link' }, { default: () => '处理' }),
      ])
    },
  },
]

const alarmData = [
  {
    key: '1',
    time: '2024-01-15 10:30',
    name: '张三',
    type: 'SOS报警',
    location: '1号储罐区',
    description: '人员触发SOS报警',
    status: '待处理',
  },
  {
    key: '2',
    time: '2024-01-15 14:20',
    name: '李四',
    type: '区域报警',
    location: '危险区域',
    description: '人员进入禁止区域',
    status: '处理中',
  },
  {
    key: '3',
    time: '2024-01-15 16:45',
    name: '王五',
    type: '超时报警',
    location: '2号反应装置',
    description: '人员在危险区域停留超时',
    status: '已处理',
  },
]
</script>

<style scoped>
.map-container {
  position: relative;
  height: 600px;
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
  cursor: move;
}

.map-image {
  width: 100%;
  height: auto;
  display: block;
  min-height: 600px;
}

.person-marker {
  position: absolute;
  cursor: pointer;
  z-index: 5;
}

.person-marker .marker-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  animation: pulse 2s infinite;
}

.person-marker.normal .marker-dot {
  background: #1890ff;
}

.person-marker.visitor .marker-dot {
  background: #faad14;
}

.person-marker.alarm .marker-dot {
  background: #ff4d4f;
  animation: alarm-pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.8;
  }
}

@keyframes alarm-pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.5);
    opacity: 0.6;
  }
}

.tooltip {
  position: absolute;
  bottom: 20px;
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

.area-marker {
  position: absolute;
  border: 2px dashed;
  opacity: 0.3;
  pointer-events: none;
}

.area-marker.safe {
  border-color: #52c41a;
  background: rgba(82, 196, 26, 0.1);
}

.area-marker.danger {
  border-color: #ff4d4f;
  background: rgba(255, 77, 79, 0.1);
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

.legend-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 4px;
  border: 1px solid #fff;
}

.legend-dot.blue {
  background: #1890ff;
}

.legend-dot.orange {
  background: #faad14;
}

.legend-dot.red {
  background: #ff4d4f;
}

.legend-area {
  display: inline-block;
  width: 16px;
  height: 10px;
  margin-right: 4px;
  border: 1px dashed;
}

.legend-area.green {
  border-color: #52c41a;
  background: rgba(82, 196, 26, 0.2);
}

.legend-area.red {
  border-color: #ff4d4f;
  background: rgba(255, 77, 79, 0.2);
}

.trajectory-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 3;
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
</style>
