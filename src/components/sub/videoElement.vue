<template>
  <q-card-media center>
    <video style="margin: 0 0% 0 25%; width: 50%;" controls ref="myVideo" :src="srcVideo">
      <track :src="srcSub" kind="subtitles" srclang="en" label="English" default>
    </video>
  </q-card-media>
</template>
<script>
export default {
  name: 'videoElement',
  props: ['srcVideo', 'srcSub', 'startTime'],
  data () {
    return {
    }
  },
  methods: {
  },
  watch: {
    startTime: function (val) {
      this.$refs.myVideo.pause()
      this.$refs.myVideo.currentTime = val
      this.$refs.myVideo.play()
    }
  }
}
</script>
