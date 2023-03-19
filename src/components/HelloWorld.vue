<template>
  <main>
    <h1>Peak_a_boo</h1>
    <h2>Discover Japan's Top 300 Famous Mountains</h2>
    <label v-for="option in options" :key="option.value" :style="{'background-color': option.color}">
      <input type="checkbox" :name="option.name" :value="option.value" v-model="selectedOptions">
      {{ option.label }}
    </label>

    <GmapMap
      :center="{lat:37, lng:138}"
      :zoom="7"
      map-type-id="terrain"
      style="width: auto; height: 90vh"
    >
      <GmapInfoWindow
          :opened="info.isOpen"
          :position="info.position"
          :options="info.options"
      />
      <GmapMarker
        :key="index"
        v-for="(m, index) in filteredMarkers"
        :position="{ lat: m.lat, lng: m.lng }"
        :clickable="true"
        :icon="{
          url: generateIconUrl(m['category'])
        }"
        @click="toggleInfo(m)"
      />
    </GmapMap>
  </main>
</template>

<script lang="ts">
import mountainsData from '@/assets/100Mountains - 300.csv';
import Encoding from 'encoding-japanese';

export default {
  name: 'JapanMountains',
  data() {
    return {
      options: [
        { label: 'The 100', value: 100, name: 'option', color: 'red' },
        { label: 'The 200', value: 200, name: 'option', color: 'orange' },
        { label: 'The 300', value: 300, name: 'option', color: 'yellow' }
      ],
      selectedOptions: [100,200,300],
      map: null,
      markers: [],
      info: {
        isOpen: false,
        content: 'fuga',
        position: null,
        options: {
          content: 'hoge',
          pixelOffset: {
            width: 0,
            height: -35
          },
        }
      }
    }
  },
  mounted() {
  },
  created() {
    this.markers = mountainsData
  },
  computed: {
    filteredMarkers() {
      const markers = []
      if (this.selectedOptions.includes(100)) {
        markers.push(...this.markers.filter(m => {
          return m['category'] === 100
        }))
      }
      if (this.selectedOptions.includes(200)) {
        markers.push(...this.markers.filter(m => {
          return m['category'] === 200
        }))
      }
      if (this.selectedOptions.includes(300)) {
        markers.push(...this.markers.filter(m => {
          return m['category'] === 300
        }))
      }
      return markers
    }
  },
  methods: {
    convertToPercentEncodedEucjp(str) {
      const unicodeArray = Encoding.stringToCode(str)
      const eucjpArray = Encoding.convert(unicodeArray, {
        to: 'EUC-JP',
        from: 'UNICODE'
      })
      const hexArrayEncodedByPercent = eucjpArray.map((value) => {
        return "%" + value.toString(16)
      })
      return hexArrayEncodedByPercent.join('')
    },
    generateIconUrl(category) {
      let url = "https://maps.google.com/mapfiles/ms/icons/<color>-dot.png"
      switch (category) {
        case 100:
          url = url.replace("<color>", "red")
          break
        case 200:
          url = url.replace("<color>", "orange")
          break
        case 300:
          url = url.replace("<color>", "yellow")
      }
      return url
    },
    toggleInfo(m) {
      this.info.isOpen = true
      this.info.options.content = `
<div style="text-align: left">
    ${m['name_ja']} (${m['elevation']})<br>
    ${m["name_en"]}<br>
    Difficulty: ${m['difficulty']}<br>
    Schedule: ${m['rough_schedule_en']}<br>
    <a href="https://yamap.com/search/mountains?keyword=${m['name_ja']}" target="_blank">Yamap</a>
    <a href="https://www.yamareco.com/modules/yamainfo/search_pt.php?searchkey=${this.convertToPercentEncodedEucjp(m['name_ja'])}&request=1" target="_blank">YamaReco</a>
</div>`
      this.info.position = { lat: m.lat, lng: m.lng }
    },
  }
}
</script>

<style>
#map {
  height: 400px;
  width: 100%;
}
</style>