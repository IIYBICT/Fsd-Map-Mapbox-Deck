<template>
  <div>
    <n-spin :show="isMapLoading">
      <template #description> 正在加载机组和管制中，请稍后... </template>
      <div class="relative overflow-hidden">
        <div
          class="absolute z-30 top-0 left-0 md:w-auto flex justify-center w-full md:flex-none"
        >
          <FilterCard
            class="flex py-3 px-5 h-16 m-2 transition hover:-translate-y-1 hover:scale-105"
          >
            <n-image
              class="rounded-md"
              width="70"
              :src="'/assets/logo.png?' + Date.now()"
            />
            <div class="flex items-center ml-5 text-2xl font-bold">
              {{ configStore.$state.configData.WebName }}
            </div>
          </FilterCard>
        </div>
        <div class="absolute z-30 top-0 right-0">
          <FilterCard
            class="py-3 px-10 h-16 m-2 invisible md:visible transition hover:-translate-y-1 hover:scale-105"
          >
            <div class="flex items-center justify-center text-2xl font-bold">
              {{ UtcDate }}
            </div>
            <div class="flex items-center justify-center text-2xl font-bold">
              UTC {{ UtcTime }}
            </div>
          </FilterCard>
        </div>

        <div
          class="absolute z-30 top-40 left-0 md:w-auto flex justify-center md:flex-none"
        >
          <FilterCard
            class="transitionData ml-1 overflow-hidden"
            :class="{ openData: isPilotDataShow || isAtcDataShow }"
          >
            <div class="mb-2">
              <div v-if="isPilotDataShow">
                <div class="flex justify-center font-bold text-lg">
                  机组列表
                </div>
                <div
                  class="flex justify-center font-bold text-sm text-gray-400"
                >
                  在线： {{ flightData.length }}
                </div>
              </div>
              <div v-if="isAtcDataShow">
                <div class="flex justify-center font-bold text-lg">
                  管制列表
                </div>
                <div
                  class="flex justify-center font-bold text-sm text-gray-400"
                >
                  在线： {{ atcData.length }}
                </div>
              </div>
              <n-data-table
                v-if="isPilotDataShow"
                :data="flightData"
                :columns="flightColumns"
                :pagination="{
                  pageSize: 5
                }"
              >
                <template #empty>
                  <n-empty size="large">
                    <template #default>
                      <div class="flex flex-col items-center">
                        <div>没有机组在线</div>
                      </div>
                    </template>
                  </n-empty>
                </template>
              </n-data-table>
              <n-data-table
                v-if="isAtcDataShow"
                :data="atcData"
                :columns="atcColumns"
                :pagination="{
                  pageSize: 5
                }"
              >
                <template #empty>
                  <n-empty size="large">
                    <template #default>
                      <div class="flex flex-col items-center">
                        <div>没有管制在线</div>
                      </div>
                    </template>
                  </n-empty>
                </template>
              </n-data-table>
            </div>
          </FilterCard>
          <div class="ml-1">
            <FilterCard
              style="cursor: pointer"
              :class="{
                'scale-105': isPilotDataShow
              }"
              @click="
                () => {
                  isAtcDataShow = false
                  isPilotDataShow = !isPilotDataShow
                }
              "
              class="flex px-5 h-16 my-2 transition hover:scale-105"
            >
              <span class="flex justify-center items-center font-bold"
                >机<br />组</span
              >
            </FilterCard>
            <FilterCard
              style="cursor: pointer"
              :class="{
                'scale-105': isAtcDataShow
              }"
              @click="
                () => {
                  isPilotDataShow = false
                  isAtcDataShow = !isAtcDataShow
                }
              "
              class="flex px-5 h-16 my-2 transition hover:scale-105"
            >
              <span class="flex justify-center items-center font-bold"
                >管<br />制</span
              >
            </FilterCard>
          </div>
        </div>

        <div
          class="absolute z-30 top-40 right-0 md:w-auto flex justify-center md:flex-none"
        >
          <FilterCard
            class="transitionDataInfo mr-1 overflow-hidden"
            :class="{ openDataInfo: isPilotDataInfoShow || isAtcDataInfoShow }"
          >
            <div class="float-right">
              <n-icon
                class="cursor-pointer"
                @click="
                  () => {
                    isPilotDataInfoShow = false
                    isAtcDataInfoShow = false
                    whazzupOneUserCall = ''
                    whazzupOneFlightCall = ''
                    FlightTrackOverlay.setProps({
                      layers: []
                    })
                    FlightNavigationTrackOverlay.setProps({
                      layers: []
                    })
                  }
                "
              >
                X
              </n-icon>
            </div>
            <div
              v-if="isPilotDataInfoShow"
              class="flex justify-center font-bold text-lg pl-4"
            >
              机组详情
            </div>
            <div
              v-if="isAtcDataInfoShow"
              class="flex justify-center font-bold text-lg pl-4"
            >
              管制详情
            </div>
            <div class="mt-5">
              <div class="flex justify-center text-xl font-bold">
                {{ whazzupOneData[0] }}
              </div>
              <div class="flex justify-center text-md text-gray-400 font-bold">
                {{ whazzupOneData[1] }}
              </div>
              <n-tabs v-if="isPilotDataInfoShow" animated class="mb-10">
                <n-tab-pane name="oasis" tab="信息">
                  <div
                    v-if="
                      whazzupOneData[11] === '' && whazzupOneData[13] === ''
                    "
                    class="flex justify-center my-5"
                  >
                    未提交飞行计划
                  </div>
                  <n-grid x-gap="12" :cols="2" class="m-2">
                    <n-gi
                      v-if="
                        whazzupOneData[11] !== '' && whazzupOneData[13] !== ''
                      "
                    >
                      <n-statistic label="离港机场">
                        {{ whazzupOneData[11] }}
                      </n-statistic>
                    </n-gi>
                    <n-gi
                      v-if="
                        whazzupOneData[11] !== '' && whazzupOneData[13] !== ''
                      "
                    >
                      <n-statistic label="降落机场">
                        {{ whazzupOneData[13] }}
                      </n-statistic>
                    </n-gi>
                    <n-gi
                      v-if="
                        whazzupOneData[11] !== '' && whazzupOneData[13] !== ''
                      "
                    >
                      <n-statistic label="机型">
                        {{ whazzupOneData[9] }}
                      </n-statistic>
                    </n-gi>
                    <n-gi>
                      <n-statistic label="应答机">
                        {{ whazzupOneData[17] }}
                      </n-statistic>
                    </n-gi>
                    <n-gi>
                      <n-statistic label="当前高度">
                        {{ whazzupOneData[7] }} ft
                      </n-statistic>
                    </n-gi>
                    <n-gi>
                      <n-statistic label="当前速度">
                        {{ whazzupOneData[8] }} kt
                      </n-statistic>
                    </n-gi>
                    <n-gi>
                      <n-statistic label="航向">
                        {{
                          Math.round(
                            (((Number(whazzupOneData[38]) & 4092) >> 2) /
                              1024) *
                              360
                          )
                        }}°
                      </n-statistic>
                    </n-gi>
                    <n-gi>
                      <n-statistic label="当前状态">
                        {{
                          Number(whazzupOneData[8]) === 0
                            ? '候机中'
                            : Number(whazzupOneData[8]) <= 30
                            ? '滑行中'
                            : '执飞中'
                        }}
                      </n-statistic>
                    </n-gi>
                  </n-grid>
                </n-tab-pane>
                <!-- <n-tab-pane name="the beatles" tab="飞行日志">
                  Hey Jude
                </n-tab-pane> -->
                <n-tab-pane name="jay chou" tab="航路">
                  <div class="hidden-scrollbar h-72">
                    <n-timeline>
                      <n-timeline-item :content="whazzupOneData[11]" />
                      <n-timeline-item
                        v-for="item in whazzupOneData[30].split(' ')"
                        :content="item"
                      />
                      <n-timeline-item :content="whazzupOneData[13]" />
                    </n-timeline>
                  </div>
                </n-tab-pane>
              </n-tabs>
              <div
                v-if="isPilotDataInfoShow"
                class="absolute left-0 bottom-0 w-full py-2"
              >
                <n-space justify="center">
                  <n-button
                    :loading="showNavigationTrackLoading"
                    @click="showNavigationTrack"
                    strong
                    secondary
                    round
                    >{{
                      isShowNavigationTrack ? '关闭' : '显示'
                    }}计划航路</n-button
                  >
                  <n-button @click="flightDog" strong secondary round
                    >{{ isFlightDog ? '关闭' : '' }}机组跟踪</n-button
                  >
                </n-space>
              </div>
              <div v-if="isAtcDataInfoShow">
                <n-grid x-gap="12" :cols="2" class="m-2">
                  <n-gi>
                    <n-statistic label="管制范围">
                      {{ whazzupOneData[19] }}
                    </n-statistic>
                  </n-gi>
                  <n-gi>
                    <n-statistic label="联系频率">
                      {{ whazzupOneData[4] }}
                    </n-statistic>
                  </n-gi>
                </n-grid>
              </div>
            </div>
          </FilterCard>
        </div>

        <div style="width: 100vw; height: 100vh" id="map" />
        <div class="absolute bottom-0 right-0 pb-10 pr-7">
          <FilterCard
            style="cursor: pointer"
            class="rounded-full px-5 py-3 text-md font-bold"
            @click="FlyTo"
          >
            回 中
          </FilterCard>
        </div>
      </div>
    </n-spin>
  </div>
</template>
<script lang="ts" setup>
import FilterCard from '@/components/FilterCard.vue'
import { MapboxOverlay as DeckOverlay } from '@deck.gl/mapbox/typed'
import {
  IconLayer,
  LineLayer,
  PolygonLayer,
  ScatterplotLayer,
  TextLayer
} from '@deck.gl/layers/typed'
import mapboxgl, { Map } from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { ScenegraphLayer } from '@deck.gl/mesh-layers/typed'
import { h, onMounted, Ref, ref } from 'vue'
import { createSocket } from '../utils/WebSocket'
import { GetFlightTrackApi, GetnavigationTrackApi } from '../api/map'
import { useConfigStore } from '@/store/modules/config'
import {
  DataTableColumns,
  NButton,
  NDescriptions,
  NDescriptionsItem,
  NGi,
  NGrid,
  NPageHeader,
  NStatistic,
  useMessage
} from 'naive-ui'
import { getDistance } from '@/utils/compute'
import {
  ProcessFlightTrackData,
  ProcessNavigationTrackData
} from '@/utils/processData'
import axios from 'axios'
const configStore = useConfigStore()
const map = ref({}) as Ref<Map>
const flightData = ref<any[][]>([])
const atcData = ref<any[][]>([])
// 地图加载状态
const isMapLoading: Ref<boolean> = ref(true)
// 机组数据加载状态
const isPilotLoading: Ref<boolean> = ref(false)
// 机组信息显示状态
const isPilotDataShow: Ref<boolean> = ref(false)
// ATC数据加载状态
const isAtcDataShow: Ref<boolean> = ref(false)
// ATC信息显示状态
const isAtcDataInfoShow: Ref<boolean> = ref(false)
// 机组信息显示状态
const isPilotDataInfoShow: Ref<boolean> = ref(false)
// 单个whazzup数据
const whazzupOneData = ref<string[]>([])
// 所有whazzup数据
const whazzupAllData = ref<string>('')
// 存储点击后的呼号用于获取实时信息
const whazzupOneUserCall = ref<string>('')
// 存储点击后的机组航班号（管制席位）用于获取实时信息
const whazzupOneFlightCall = ref<string>('')
// 存储点击后的机组（管制）的经纬度和高度
const whazzupOneUserCallLon = ref<number>(0)
const whazzupOneFlightCallLat = ref<number>(0)
const whazzupOneFlightCallHeight = ref<number>(0)
// 计划航路加载状态
const showNavigationTrackLoading = ref<boolean>(false)
// 是否显示计划航路
const isShowNavigationTrack = ref<boolean>(false)
// 是否跟踪
const isFlightDog = ref<boolean>(false)

const AtcGeoData = ref([])
const UtcTime = ref('00:00:00')
const UtcDate = ref('0000-00-00')
// 机组图层
let FlightOverlay: DeckOverlay
// 机组航迹图层
let FlightTrackOverlay: DeckOverlay
// 计划航路图层
let FlightNavigationTrackOverlay: DeckOverlay
// 管制图层
let AtcOverlay: DeckOverlay
// 管制图层
let AtcNoOverlay: DeckOverlay
const createFlightColumns = (): DataTableColumns<any> => {
  return [
    {
      key: 'no',
      align: 'center',
      render(row) {
        return h(
          NDescriptions,
          {
            onclick: () => {
              isShowNavigationTrack.value = false
              isFlightDog.value = false
              whazzupOneUserCall.value = row[1]
              whazzupOneFlightCall.value = row[0]
              whazzupOneUserCallLon.value = Number(row[6])
              whazzupOneFlightCallLat.value = Number(row[5])
              whazzupOneFlightCallHeight.value = row[7]
              FlightNavigationTrackOverlay.setProps({ layers: [] })
              whazzupOneData.value = row
              map.value.flyTo({
                center: [Number(row[6]), Number(row[5])],
                // zoom: 10,
                bearing: Math.round(
                  (((Number(row[38]) & 4092) >> 2) / 1024) * 360
                ),
                zoom: 14,
                pitch: 10
              })
              isPilotDataInfoShow.value = true
              isAtcDataInfoShow.value = false
              onLoading(whazzupAllData.value)
            },
            labelPlacement: 'top',
            column: 2,
            labelAlign: 'center'
          },
          {
            default: () => [
              h(
                NDescriptionsItem,
                {
                  label: '呼号'
                },
                {
                  default: () => row[0]
                }
              ),
              h(
                NDescriptionsItem,
                {
                  label: '离港-到达机场'
                },
                {
                  default: () =>
                    row[11] === '' || row[13] === ''
                      ? '未提交飞行计划'
                      : `${row[11]}-${row[13]}`
                }
              )
            ]
          }
        )
      }
    }
  ]
}
const createAtcColumns = (): DataTableColumns<any> => {
  return [
    {
      key: 'no',
      align: 'center',
      render(row) {
        return h(
          NDescriptions,
          {
            onclick: () => {
              whazzupOneUserCall.value = row[1]
              whazzupOneFlightCall.value = row[0]
              map.value.flyTo({
                center: [Number(row[6]), Number(row[5])]
                // zoom: 10,
              })
              FlightNavigationTrackOverlay.setProps({ layers: [] })
              isShowNavigationTrack.value = false
              isFlightDog.value = false
              whazzupOneData.value = row
              isAtcDataInfoShow.value = true
              isPilotDataInfoShow.value = false
            },
            labelPlacement: 'top',
            column: 3,
            labelAlign: 'center'
          },
          {
            default: () => [
              h(
                NDescriptionsItem,
                {
                  label: '席位'
                },
                {
                  default: () => row[0]
                }
              ),
              h(
                NDescriptionsItem,
                {
                  label: '联系频率'
                },
                {
                  default: () => row[4]
                }
              ),
              h(
                NDescriptionsItem,
                {
                  label: '管制范围'
                },
                {
                  default: () => row[19]
                }
              )
            ]
          }
        )
      }
    }
  ]
}
const atcColumns = createAtcColumns()
const flightColumns = createFlightColumns()
const message = useMessage()
const REFRESH_TIME = 0
// 初始化websocket
const initWs = setInterval(() => {
  if (isMapLoading.value) {
    axios.get('/assets/region.json').then((e: any) => {
      AtcGeoData.value = e.data
    })
    // 根据url转换为ws
    const url = window.document.location.href
      .replace('http', 'ws')
      .replace('https', 'ws')
    // 开发环境的ws
    createSocket(
      'ws://demo.map.deteam.cn/ws/whazzup',
      configStore.$state.configData.WhUpdateTime * 1000,
      (e) => {
        if (!isPilotLoading.value) {
          whazzupAllData.value = e.data
          onLoading(e.data)
          isMapLoading.value = false
        }
      }
    ).wsInit()
    // 生产环境的ws
    // createSocket(
    //   url + 'ws/whazzup',
    //   configStore.$state.configData.WhUpdateTime * 1000,
    //   (e) => {
    //     if (!isPilotLoading.value) {
    //       whazzupAllData.value = e.data
    //       onLoading(e.data)
    //       isMapLoading.value = false
    //     }
    //   }
    // ).wsInit()
    clearInterval(initWs)
  }
}, 500)
const FlyTo = () => {
  map.value.flyTo({
    bearing: 0,
    pitch: 0
  })
}

setInterval(() => {
  const time = new Date()
  UtcTime.value =
    time.getUTCHours().toString().padStart(2, '00') +
    ':' +
    time.getUTCMinutes().toString().padStart(2, '00') +
    ':' +
    time.getUTCSeconds().toString().padStart(2, '00')
  UtcDate.value =
    time.getUTCFullYear().toString().padStart(2, '00') +
    '-' +
    (time.getUTCMonth() + 1).toString().padStart(2, '00') +
    '-' +
    time.getUTCDate().toString().padStart(2, '00')
}, 1000)

// 显示/关闭计划航路事件
const showNavigationTrack = () => {
  showNavigationTrackLoading.value = true
  if (isShowNavigationTrack.value) {
    FlightNavigationTrackOverlay.setProps({ layers: [] })
    showNavigationTrackLoading.value = false
    isShowNavigationTrack.value = false
  } else {
    GetNavigationTrack(
      whazzupOneData.value[30],
      whazzupOneData.value[11],
      whazzupOneData.value[13]
    )
  }
}
// 机组跟踪事件
const flightDog = () => {
  if (isFlightDog.value) {
    isFlightDog.value = false
  } else {
    isFlightDog.value = true
    onLoading(whazzupAllData.value)
  }
}
const onLoading = (resData: any) => {
  const whazzup = resData
    .substring(resData.indexOf('!CLIENTS') + 9, resData.indexOf('!SERVERS'))
    .trim()
  const whazzupData = whazzup.split('\n')

  const flightList: any[] = []
  const atcList: any[] = []
  const atcAllList: any[] = []
  const AtcFssData: any[] = []
  const AtcCrtData: any[] = []
  let isPilotOpen = false
  let isAtcOpen = false
  whazzupData.map((item: string) => {
    const data = item.split(':')
    if (data.length > 10 && data[3] === 'PILOT') {
      if (
        whazzupOneFlightCall.value === data[0] &&
        whazzupOneUserCall.value === data[1]
      ) {
        whazzupOneUserCallLon.value = Number(data[6])
        whazzupOneFlightCallLat.value = Number(data[5])
        whazzupOneFlightCallHeight.value = Number(data[7])
        whazzupOneData.value = data
        isPilotOpen = true
        if (isFlightDog.value) {
          map.value.flyTo({
            center: [Number(data[6]), Number(data[5])],
            zoom: 14,
            bearing: Math.round(
              (((Number(data[38]) & 4092) >> 2) / 1024) * 360
            ),
            pitch: 70
          })
        }
      }
      flightList.push(data)
    }
    if (data.length > 10 && data[3] === 'ATC') {
      if (
        whazzupOneFlightCall.value === data[0] &&
        whazzupOneUserCall.value === data[1]
      ) {
        isAtcOpen = true
      }
      if (data[0].match('FSS')) {
        AtcGeoData.value.map((item: any) => {
          if (
            item.id == 'ZBPE' ||
            item.id == 'ZGZU' ||
            item.id == 'ZJSA' ||
            item.id == 'ZLHW' ||
            item.id == 'ZPKM' ||
            item.id == 'ZSHA' ||
            item.id == 'ZWUQ' ||
            item.id == 'ZYSH'
          ) {
            AtcFssData.push({
              id: data[0],
              userCall: data[1],
              data: data,
              coordinates: item.coordinates[0][0]
            })
          }
        })
      } else if (data[0].match('CTR')) {
        AtcGeoData.value.map((item: any) => {
          if (item.id == data[0].split('_')[0]) {
            AtcCrtData.push({
              id: data[0],
              userCall: data[1],
              data: data,
              coordinates: item.coordinates[0][0]
            })
          }
        })
      } else {
        atcList.push(data)
      }
      atcAllList.push(data)
    }
  })

  if (isPilotOpen === false) {
    FlightTrackOverlay.setProps({
      layers: []
    })
    FlightNavigationTrackOverlay.setProps({
      layers: []
    })
    isShowNavigationTrack.value = false
    isPilotDataInfoShow.value = false
  } else {
    if (whazzupOneFlightCall.value !== '' && whazzupOneUserCall.value !== '') {
      GetFlightTrack(whazzupOneFlightCall.value, whazzupOneUserCall.value)
    }
  }

  if (isAtcOpen === false) {
    isAtcDataInfoShow.value = false
  }
  flightData.value = flightList
  atcData.value = atcAllList
  AtcOverlay.setProps({
    layers: [
      new PolygonLayer({
        id: 'ATC-FSS',
        onClick: (e) => {
          FlightNavigationTrackOverlay.setProps({ layers: [] })
          isShowNavigationTrack.value = false
          isFlightDog.value = false
          whazzupOneData.value = e.object.data
          whazzupOneFlightCall.value = e.object.id
          whazzupOneUserCall.value = e.object.userCall
          isAtcDataInfoShow.value = true
          isPilotDataInfoShow.value = false
        },
        data: AtcFssData,
        pickable: true,
        stroked: true,
        filled: true,
        wireframe: true,
        lineWidthMinPixels: 1,
        getPolygon: (d) => d.coordinates,
        getFillColor: (d) => [0, 0, 0, 50],
        getLineColor: [80, 80, 80],
        getLineWidth: 1
      }),
      new PolygonLayer({
        id: 'ATC-CTR',
        onClick: (e) => {
          FlightNavigationTrackOverlay.setProps({ layers: [] })
          isShowNavigationTrack.value = false
          isFlightDog.value = false
          whazzupOneData.value = e.object.data
          whazzupOneFlightCall.value = e.object.id
          whazzupOneUserCall.value = e.object.userCall
          isAtcDataInfoShow.value = true
          isPilotDataInfoShow.value = false
        },
        data: AtcCrtData,
        pickable: true,
        stroked: true,
        filled: true,
        wireframe: true,
        lineWidthMinPixels: 1,
        getPolygon: (d) => d.coordinates,
        getFillColor: (d) => [0, 0, 0, 100],
        getLineColor: [80, 80, 80],
        getLineWidth: 1
      })
    ]
  })
  AtcNoOverlay.setProps({
    layers: [
      new ScatterplotLayer({
        onClick: (e) => {
          FlightNavigationTrackOverlay.setProps({ layers: [] })
          isShowNavigationTrack.value = false
          isFlightDog.value = false
          whazzupOneData.value = e.object
          whazzupOneFlightCall.value = e.object[0]
          whazzupOneUserCall.value = e.object[1]
          isAtcDataInfoShow.value = true
          isPilotDataInfoShow.value = false
        },
        id: 'atc',
        data: atcList,
        pickable: true,
        opacity: 0.8,
        stroked: true,
        filled: true,
        radiusScale: 6,
        lineWidthMinPixels: 1,
        getPosition: (d: any) => [Number(d[6]), Number(d[5])],
        getRadius: (d: any) => Number(d[19]) * 100,
        getFillColor: (d) => [0, 0, 0, 100],
        getLineColor: (d) => [0, 0, 0]
      })
    ]
  })
  FlightOverlay.setProps({
    layers: [
      new ScenegraphLayer({
        onClick: (e) => {
          FlightNavigationTrackOverlay.setProps({ layers: [] })
          whazzupOneData.value = e.object
          map.value.flyTo({
            center: [Number(e.object[6]), Number(e.object[5])],
            // zoom: 10,
            bearing: Math.round(
              (((Number(e.object[38]) & 4092) >> 2) / 1024) * 360
            )
            // pitch: 10,
          })
          isShowNavigationTrack.value = false
          isFlightDog.value = false
          isPilotDataInfoShow.value = true
          isAtcDataInfoShow.value = false
          whazzupOneFlightCall.value = e.object[0]
          whazzupOneUserCall.value = e.object[1]
          whazzupOneUserCallLon.value = Number(e.object[6])
          whazzupOneFlightCallLat.value = Number(e.object[5])
          whazzupOneFlightCallHeight.value = Number(e.object[7])
          onLoading(whazzupAllData.value)
          // GetFlightTrack(e.object[0], e.object[1]);
          // GetNavigationTrack(e.object[30], e.object[11], e.object[13]);
        },
        id: 'Flight-layer',
        data: flightList,
        pickable: true,
        sizeScale: 25,
        scenegraph: '/assets/airplane.glb',
        sizeMinPixels: 0.6,
        sizeMaxPixels: 0.6,
        // getAltitude: (d: any) => Number(d[7]),
        getPosition: (d: any) => [Number(d[6]), Number(d[5]), Number(d[7])],
        getOrientation: (d: any) => [
          0,
          -Math.round((((Number(d[38]) & 4092) >> 2) / 1024) * 360),
          90
        ],
        transitions: {
          getPosition: REFRESH_TIME
        }
      })
    ]
  })
}

onMounted(() => {
  // 初始化地图
  mapboxgl.accessToken = configStore.$state.configData.MapboxToken
  map.value = new mapboxgl.Map({
    container: 'map',
    style: configStore.$state.configData.MapboxStyle,
    center: [110, 34],
    zoom: 4,
    bearing: 0,
    pitch: 0,
    customAttribution: [
      'DataElement',
      'De Map ' + configStore.$state.configData.Version
    ]
  })
  // 飞机图层
  FlightOverlay = new DeckOverlay({
    getTooltip: ({ object }) => {
      return object && `${object[0]}`
    }
  })

  // 飞行航迹图层
  FlightTrackOverlay = new DeckOverlay({})

  // 飞行计划航路图层
  FlightNavigationTrackOverlay = new DeckOverlay({
    getTooltip: ({ object }) => {
      return (
        object &&
        `${object.start[0]}至${object.end[0]}，距离：${getDistance(
          object.start[1],
          object.start[2],
          object.end[1],
          object.end[2]
        )}`
      )
    }
  })
  // 管制图层
  AtcOverlay = new DeckOverlay({
    getTooltip: ({ object }) => {
      return object && `${object.id}`
    }
  })
  AtcNoOverlay = new DeckOverlay({
    getTooltip: ({ object }) => {
      return object && `${object[0]}`
    }
  })
  map.value.addControl(AtcOverlay)
  map.value.addControl(AtcNoOverlay)
  map.value.addControl(FlightNavigationTrackOverlay)
  map.value.addControl(FlightTrackOverlay)
  map.value.addControl(FlightOverlay)
})
// 获取并渲染航迹
const GetFlightTrack = async (flightCall: string, userCall: string) => {
  const resData = await GetFlightTrackApi(flightCall, userCall)
  let indexTwo = 1
  const list: {
    start: number[]
    end: number[]
  }[] = []
  const list1: {
    start: number[]
    end: number[]
  }[] = []

  if (resData.data.Data.length > 4) {
    for (let index = 0; index < resData.data.Data.length - 1; index++) {
      const element = resData.data.Data[index].split(':')
      const element1 = resData.data.Data[indexTwo].split(':')
      if (indexTwo >= resData.data.Data.length - 2) {
        list1.push({
          start: [
            Number(element[6]),
            Number(element[5]),
            Number(element[8]) === 0 ? 0 : Number(element[7])
          ],
          end: [
            Number(element1[6]),
            Number(element1[5]),
            Number(element1[8]) === 0 ? 0 : Number(element1[7])
          ]
        })
      } else if (element.length > 10 && element1.length > 10) {
        list.push({
          start: [
            Number(element[6]),
            Number(element[5]),
            Number(element[8]) === 0 ? 0 : Number(element[7])
          ],
          end: [
            Number(element1[6]),
            Number(element1[5]),
            Number(element1[8]) === 0 ? 0 : Number(element1[7])
          ]
        })

        indexTwo += 1
      }
    }
  }
  ProcessFlightTrackData(list)
  ProcessFlightTrackData(list1)
  FlightTrackOverlay.setProps({
    layers: [
      new LineLayer({
        id: 'flight-Track',
        data: list,
        opacity: 0.8,
        getSourcePosition: (d) => d.start,
        getTargetPosition: (d) => d.end,
        getColor: (d) => [71, 219, 156],
        getWidth: 3,
        pickable: true
      }),
      new LineLayer({
        id: 'flight-Track-1',
        data: list1,
        opacity: 0.8,
        getSourcePosition: (d) => d.start,
        getTargetPosition: (d) => d.end,
        getColor: (d) => [
          71 * (1 - (d.start[2] / 10000) * 2),
          219 * (d.start[2] / 10000),
          156 * (d.start[2] / 10000)
        ],
        getWidth: 3,
        pickable: true
      })
    ]
  })
}

// 获取并渲染计划航路
const GetNavigationTrack = async (route: string, dep: string, arr: string) => {
  let indexTwo = 1
  const list: {
    start: [string, number, number]
    end: [string, number, number]
  }[] = []
  let listEnd = [0, 0, 0]

  if (route === '' || dep === '' || arr === '') {
    message.error('未提交飞行计划')
  } else {
    const resData = await GetnavigationTrackApi(route, dep, arr)
    isShowNavigationTrack.value = true
    for (let index = 0; index < resData.data.Data.length; index++) {
      const element = resData.data.Data[index]
      const element1 = resData.data.Data[indexTwo]

      if (element.length === 3 && element1 !== undefined) {
        list.push({
          start: [element[0], Number(element[1]), Number(element[2])],
          end: [element1[0], Number(element1[1]), Number(element1[2])]
        })
        indexTwo++
      } else {
        listEnd = [element[0], Number(element[1]), Number(element[2])]
      }
    }
    // 跨全球数据处理
    ProcessNavigationTrackData(list)
    FlightNavigationTrackOverlay.setProps({
      layers: [
        new LineLayer({
          id: 'flight-Navigation-Track',
          data: list,
          opacity: 0.8,
          getSourcePosition: (d) => [d.start[1], d.start[2]],
          getTargetPosition: (d) => [d.end[1], d.end[2]],
          getColor: (d) => [203, 203, 203],
          getWidth: 3,
          pickable: true
        }),
        new TextLayer({
          id: 'text-layer',
          data: [
            ...list,
            {
              start: listEnd,
              end: [0, 0, 0]
            }
          ],
          pickable: true,
          getPosition: (d) => [d.start[1], d.start[2]],
          getText: (d) => d.start[0],
          getSize: 12,
          fontSettings: {
            sdf: true
          },
          outlineWidth: 2,
          outlineColor: [210, 210, 210],
          getAngle: 0,
          getTextAnchor: 'middle',
          getAlignmentBaseline: 'center'
        })
      ]
    })
  }
  showNavigationTrackLoading.value = false
}
</script>
<style scoped>
#map {
  width: 100vw;
  height: 100vh;
}
.transitionData {
  visibility: hidden;
  width: 0;
  height: auto;
  max-height: 500px;
  transition: width 0.3s, height 0.3s, visibility 0.3s;
}
.openData {
  visibility: visible;
  width: 320px;
  height: auto;
}
.transitionDataInfo {
  visibility: hidden;
  width: 0;
  height: 600px;
  transition: width 0.3s, height 0.3s, visibility 0.3s;
}
.openDataInfo {
  visibility: visible;
  width: 320px;
  height: 600px;
}
.hidden-scrollbar {
  overflow-y: scroll;
  scrollbar-width: none; /* firefox */
  -ms-overflow-style: none; /* IE 10+ */
}
.hidden-scrollbar::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}
</style>
