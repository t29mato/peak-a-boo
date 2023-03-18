<template>
  <main>
    <h1>Peak a boo</h1>
    <label v-for="option in options" :key="option.value">
      <input type="checkbox" :name="option.name" :value="option.value" v-model="selectedOptions"> {{ option.label }}
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
          url: generateIconUrl(m)
        }"
        @click="toggleInfo(m)"
      />
    </GmapMap>
  </main>
</template>

<script lang="ts">
import mountainsData from '@/assets/100Mountains - 300.csv';

export default {
  name: 'JapanMountains',
  data() {
    return {
      options: [
        { label: 'The 100', value: 100, name: 'option' },
        { label: 'The 200', value: 200, name: 'option' },
        { label: 'The 300', value: 300, name: 'option' }
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
      console.log(this.selectedOptions)
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
    generateIconUrl(m) {
      let url = "https://maps.google.com/mapfiles/ms/icons/<color>-dot.png"
      const mountain_ID = m["ID"]
      console.log(m)
      if (mountain_ID<100) {
        url = url.replace("<color>", "red")
      } else if (mountain_ID.toString().startsWith("2")) {
        url = url.replace("<color>", "orange")
      } else {
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
    Schedule: ${m['rough_schedule_en']}
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