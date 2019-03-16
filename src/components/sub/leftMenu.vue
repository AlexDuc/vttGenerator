<template>
  <q-card inline style="margin: 0.5% 1% 1% 1%; width: 30%;">
    <q-scroll-area style="height: calc(100vh - 60px - 2vh);"
        :delay="1500">
    <q-list>
      <q-item class="item" :class="{picked: i == pickedIndex}" v-for ="(vi, i) in listVideo" :key="i" @click.native="chooseVideo(i)">
        <q-item-side>
          <q-item-tile color="blue" icon="local movies" />
        </q-item-side>
        <q-item-main >
          <q-item-tile label>{{vi}}</q-item-tile>
          <q-item-tile sublabel></q-item-tile>
        </q-item-main>
      </q-item>
    </q-list>
    </q-scroll-area>
  </q-card>
</template>

<script>
import axios from 'axios'
export default {
  name: 'leftMenu',
  created () {
    axios.get('/api/track/')
      .then((response) => {
        let data = response.data
        this.listVideo = data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  data () {
    return {
      listVideo: [],
      pickedIndex: -1
    }
  },
  methods: {
    chooseVideo (index) {
      this.pickedIndex = index
      this.$emit('chosenVideo', this.listVideo[index])
    }
  }
}
</script>
<style lang="scss" scoped>
.item {
  cursor: pointer;
}
.picked{
  background: rgba(20, 11, 11, 0.5);
}
</style>
