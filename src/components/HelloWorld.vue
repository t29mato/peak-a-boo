<template>
  <main>
    <h1>Peak_a_boo</h1>
    <h2>Discover Japan's Top 300 Famous Mountains</h2>
    <label v-for="option in options" :key="option.value" :style="{'background-color': option.color}" >
      <input v-model="selectedFamousMountains" :name="option.name" :value="option.value" type="checkbox"
             @change="trackCheckboxToggle(`toggle ${option.label}`, 'famous mountains', option.label)">
      {{ option.label }}
    </label>
    <br>
    <span>Physical difficulty</span>
    <label v-for="difficulty in physicalDifficulties" :key="difficulty.value">
      <input type="checkbox" :name="difficulty.name" :value="difficulty.value" v-model="selectedDifficulties"
             @change="trackCheckboxToggle(`toggle ${difficulty.label}`, 'famous mountains', difficulty.label)">
      {{ difficulty.label }}
    </label>
    <br>
    <input placeholder="mountain name" type="text" v-model="mountainName" @input="closeInfoWindow" />
    <br>
    Count: {{filteredMarkers.length}}

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
        { label: 'The 100', value: 1, name: 'option', color: 'red' },
        { label: 'The 200', value: 2, name: 'option', color: 'orange' },
        { label: 'The 300', value: 3, name: 'option', color: 'yellow' }
      ],
      physicalDifficulties: [
        { label: '☆1', value: 1, name: 'physicalDifficulty' },
        { label: '☆2', value: 2, name: 'physicalDifficulty' },
        { label: '☆3', value: 3, name: 'physicalDifficulty' },
        { label: '☆4', value: 4, name: 'physicalDifficulty' },
        { label: '☆5', value: 5, name: 'physicalDifficulty' },
        { label: '☆6', value: 6, name: 'physicalDifficulty' },
      ],
      selectedFamousMountains: [],
      selectedDifficulties: [],
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
      let markers = this.markers
      if (this.selectedFamousMountains.length !== 0) {
        const selectedMarkers = []
        for (let i = 1; i <= 3; i++) {
          if (this.selectedFamousMountains.includes(i)) {
            selectedMarkers.push(...markers.filter(m => {
              if (selectedMarkers.map(marker => marker.id).includes(m.id)) {
                return false
              }
              return m['category'] === i
            }))
          }
        }
        markers = selectedMarkers
      }
      if (this.mountainName) {
        const name = this.mountainName
        markers = markers.filter(m => {
          return new RegExp(`${name}`, 'i').test(m["name_ja"]) || new RegExp(`${name}`, 'i').test(m["name_en"])
        })
      }

      if (this.selectedDifficulties.length !== 0) {
        const selectedMarkers = []
        for (let i = 1; i <= 6; i++) {
          if (this.selectedDifficulties.includes(i)) {
            selectedMarkers.push(...markers.filter(m => {
              if (selectedMarkers.map(marker => marker.id).includes(m.id)) {
                return false
              }
              return m['physical_difficulty_min'] <= i && i <= m['physical_difficulty_max']
            }))
          }
        }
        return selectedMarkers
      }
      return markers
    }
  },
  methods: {
    trackCheckboxToggle(name, category, label) {
      this.$gtag.event(name, {
        'event_category': category,
        'event_label': label
      });
    },
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
        case 1:
          url = url.replace("<color>", "red")
          break
        case 2:
          url = url.replace("<color>", "orange")
          break
        case 3:
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
    <a href="https://yamap.com/mountains/${m['yamap_id']}" target="_blank">Yamap</a>
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