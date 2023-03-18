<template>
  <main>
    <h1>Peak a boo</h1>
    <GmapMap
      :center="{lat:37, lng:138}"
      :zoom="7"
      map-type-id="terrain"
      style="width: auto; height: 90vh"
    >
      <GmapInfoWindow
          :content="info.content"
          :opened="info.isOpen"
          :position="info.position"
          :options="info.options"
      />
      <GmapMarker
        :key="index"
        v-for="(m, index) in markers"
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
      map: null,
      markers: [],
      info: {
        isOpen: false,
        content: null,
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
  methods: {
    generateIconUrl(m) {
      let url = "https://maps.google.com/mapfiles/ms/icons/<color>-dot.png"
      const mountain_number = m["No."]
      if (mountain_number<100) {
        url = url.replace("<color>", "red")
      } else if (mountain_number.toString().startsWith("2")) {
        url = url.replace("<color>", "orange")
      } else {
        url = url.replace("<color>", "yellow")
      }
      return url
    },
    toggleInfo(marker) {
      this.info.isOpen = true
      this.info.content = `<div>${marker["山名"]}</div>`
      this.info.position = { lat: marker.lat, lng: marker.lng }
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