<template>
  <main>
    <h1>Peak a boo</h1>
    <GmapMap
      :center="{lat:37, lng:138}"
      :zoom="7"
      map-type-id="terrain"
      style="width: 500px; height: 500px"
    >
      <GmapMarker
        :key="index"
        v-for="(m, index) in markers"
        :position="{ lat: m.lat, lng: m.lng }"
        :clickable="true"
        @click="center=m.position"
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
      markers: []
    }
  },
  mounted() {
    this.initMap()
    this.getMountainData()
  },
  created() {
    this.markers = mountainsData
  },
  methods: {
    initMap() {
    },
    getMountainData() {
      // const url = `https://sheets.googleapis.com/v4/spreadsheets/103XN0NGfmb_5GqWeoLSd6y2s42Ho23tK09ju4jElzzo/values/Sheet1?key=AIzaSyDbuUv2T_wJvZ3P_dkCgzf-Zp-rgaTqwBo`
      // axios.get(url)
      //   .then((response) => {
      //     const data = response.data.values.slice(1) // 1行目はヘッダーなのでスキップ
      //     for (let i = 0; i < data.length; i++) {
      //       const mountain = data[i]
      //       const name = mountain[0]
      //       const lat = parseFloat(mountain[1])
      //       const lng = parseFloat(mountain[2])
      //       const marker = {
      //         position: { lat: lat, lng: lng },
      //         title: name
      //       }
      //       this.markers.push(marker)
      //     }
      //   })
      //   .catch((error) => {
      //     console.error(error)
      //   })
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