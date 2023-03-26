<template>
  <main>
    <h1>Peak_a_boo</h1>
    <h2>Discover Japan's Top 300 Famous Mountains</h2>
    <label v-for="option in options" :key="option.value" :style="{'background-color': option.color}">
      <input type="checkbox" :name="option.name" :value="option.value" v-model="selectedOptions">
      {{ option.label }}
    </label>
    <br>
    <span>Physical difficulty</span>
    <label v-for="difficulty in physicalDifficulties" :key="difficulty.value">
      <input type="checkbox" :name="difficulty.name" :value="difficulty.value" v-model="selectedDifficulties">
      {{ difficulty.label }}
    </label>
    <br>
    <input placeholder="moutain name" type="text" v-model="mountainName" @input="closeInfoWindow" />

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
          @closeclick="closeInfoWindow"
      />
      <GmapMarker
        :key="m['ID']"
        v-for="m in filteredMarkers"
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
      mountainName: "",
      options: [
        { label: 'The 100', value: 100, name: 'option', color: 'red' },
        { label: 'The 200', value: 200, name: 'option', color: 'orange' },
        { label: 'The 300', value: 300, name: 'option', color: 'yellow' }
      ],
      physicalDifficulties: [
        { label: '☆1', value: 1, name: 'physicalDifficulty' },
        { label: '☆2', value: 2, name: 'physicalDifficulty' },
        { label: '☆3', value: 3, name: 'physicalDifficulty' },
        { label: '☆4', value: 4, name: 'physicalDifficulty' },
        { label: '☆5', value: 5, name: 'physicalDifficulty' },
        { label: '☆6', value: 6, name: 'physicalDifficulty' },
      ],
      selectedOptions: [100,200,300],
      selectedDifficulties: [1,2,3,4,5,6],
      map: null,
      markers: [],
      info: {
        isOpen: false,
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
      let markers = []
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
      if (this.mountainName) {
        const name = this.mountainName
        markers = markers.filter(m => {
          return new RegExp(`${name}`, 'i').test(m["name_ja"]) || new RegExp(`${name}`, 'i').test(m["name_en"])
        })
      }

      const selectedMarkers = []
      for (let i = 1; i <= 6; i++) {
        if (this.selectedDifficulties.includes(i)) {
          selectedMarkers.push(...markers.filter(m => {
            if (m['name_ja'] === "水晶岳") {
              console.log("水晶岳", i, m)
            }
            if (selectedMarkers.map(marker => marker.id).includes(m.id)) {
              return false
            }

            return m['physical_difficulty_min'] <= i && i <= m['physical_difficulty_max']
          }))
        }
      }
      return selectedMarkers
    }
  },
  methods: {
    closeInfoWindow() {
      this.info.isOpen = false
    },
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
    Course constant: ${m['course_constant_min']} - ${m['course_constant_max']}<br>
    Physical difficulty: ${this.showPhysicalDifficulty(m['physical_difficulty_min'],m['physical_difficulty_max'])}<br>
    Schedule: ${m['rough_schedule_en']}<br>
    <a href="https://yamap.com/search/mountains?keyword=${m['name_ja']}" target="_blank">Yamap</a>
    <a href="https://www.yamareco.com/modules/yamainfo/search_pt.php?searchkey=${this.convertToPercentEncodedEucjp(m['name_ja'])}&request=1" target="_blank">YamaReco</a>
</div>`
      this.info.position = { lat: m.lat, lng: m.lng }
    },
    showPhysicalDifficulty(min, max) {
      if (min === max) {
        return min
      }
      return `${min} - ${max}`
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