<template>
  <main>
    <h1>日本百名山</h1>
    <div id="map"></div>
  </main>
</template>

<script lang="ts">
import { GmapMarker } from 'vue2-google-maps'
import axios from 'axios'

export default {
  name: 'JapanMountains',
  data() {
    return {
      map: null,
      markers: []
    }
  },
  mounted() {
    this.initMap()
    this.getMountainData()
  },
  methods: {
    initMap() {
      const center = { lat: 37.500837, lng: 137.499528 } // 日本の中心地
      this.map = new google.maps.Map(document.getElementById('map'), {
        center: center,
        zoom: 5
      })
    },
    getMountainData() {
      const url = `https://sheets.googleapis.com/v4/spreadsheets/SPREADSHEET_ID/values/Sheet1?key=API_KEY`
      axios.get(url)
        .then((response) => {
          const data = response.data.values.slice(1) // 1行目はヘッダーなのでスキップ
          for (let i = 0; i < data.length; i++) {
            const mountain = data[i]
            const name = mountain[0]
            const lat = parseFloat(mountain[1])
            const lng = parseFloat(mountain[2])
            const marker = {
              position: { lat: lat, lng: lng },
              title: name
            }
            this.markers.push(marker)
          }
        })
        .then(() => {
          this.addMarkers()
        })
        .catch((error) => {
          console.error(error)
        })
    },
    addMarkers() {
      for (let i = 0; i < this.markers.length; i++) {
        const marker = new GmapMarker({
          position: this.markers[i].position,
          map: this.map,
          title: this.markers[i].title
        })
      }
    }
  }
}
</script>

<style>
#map {
  height: 400px;
  width: 100%;
}
</style>