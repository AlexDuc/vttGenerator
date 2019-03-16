<template>
  <div class="main">
    <leftMenu @chosenVideo="chosenVideo"/>
    <q-card v-if="isChosen" inline style="margin-top: 0.5%; width: 66%; padding: 1%;" >
      <videoElement v-if="srcVideo != ''" :srcVideo="srcVideo" :srcSub="srcSub" :startTime="startTime"/>
      <q-card-title>
        {{
          isNoVTT
          ? "No VTT file found"
          : "VTT Content"
        }}
        <div slot="right" class="row items-center">
           <q-btn v-show="!isNoVTT" align="between" class="btn-fixed-width" color="primary" label="Download" icon="lightbulb_outline" @click.native="download()"/>
        </div>
      </q-card-title>
      <q-btn color="primary" v-if="isNoVTT" label="Generate VTT File" @click.native="generateVTT()"/>
      <q-scroll-area v-else style="height: calc(100vh - 60px - 45vh);" :delay="1500">
        <template v-for="(item, i) in arrayObjectText">
          <q-card style="padding: 1%; margin: 1% 0% 1% 0%"  :key = "i">
            <q-field :error= "item.isNOTValidStartTime" :error-label="item.errorStartTimeMessage">
              <q-input style="width: 30%; padding-top: 1%;"  v-model="item.startTime" stack-label="Starting Time" @input="validateStartTime(i)"/>
            </q-field>
            <q-field :error= "item.isNOTValidEndTime" :error-label="item.errorEndTimeMessage">
              <q-input style="width: 30%; padding-top: 1%;" v-model="item.endTime" stack-label="Ending Time" @input="validateEndTime(i)"/>
            </q-field>
            <q-input v-model="item.text"   type="textarea"
              float-label="Textarea"
              style="padding-top: 1%;"
              :max-height="100"
              rows="7" stack-label="Text"
            />
            <q-card-actions>
              <q-btn color="primary" label="Save" @click.native="save()"/>
              <q-btn color="secondary" label="Play" @click.native="play(i)"/>
              <q-btn color="black" label="Delete" @click.native="deleteLine(i)"/>
              <q-btn color="amber" label="Split" @click.native="splitLine(i)"/>
              <q-btn-dropdown label="Merge">
                <q-list link>
                  <q-item v-close-overlay v-if="i > 0">
                    <q-item-main>
                      <q-btn  small @click.native="mergeLines(i)">Merge Line Above</q-btn>
                    </q-item-main>
                  </q-item>
                  <q-item v-close-overlay v-if="i < arrayObjectText.length - 1">
                    <q-item-main>
                      <q-btn small @click.native="mergeLines(i, true)">Merge Line Below</q-btn>
                    </q-item-main>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
            </q-card-actions>
          </q-card>
        </template>
      </q-scroll-area>
    </q-card>
  </div>
</template>

<script>
import FileSaver from 'file-saver'
import leftMenu from './leftMenu.vue'
import videoElement from './videoElement.vue'
import {
  vttTomilisec,
  validateFormat
} from '../../plugins/util'
import axios from 'axios'
import {
  QSpinnerGears,
  QSpinnerPie
} from 'quasar'
export default {
  name: 'rightMain',
  data () {
    return {
      arrayObjectText: [],
      srcVideo: '',
      srcSub: '',
      currentVideo: '',
      isNoVTT: false,
      isChosen: false,
      timerID: 0,
      hasError: false,
      startTime: 0
    }
  },
  methods: {
    async chosenVideo (nameOfFile) {
      this.loading('Loading Video...')
      this.srcVideo = ''
      this.srcSub = ''
      this.isChosen = true
      this.currentVideo = nameOfFile
      let textVTT = await axios.get('/api/track/' + this.currentVideo)
      if (textVTT.data !== 'File not found.') {
        this.isNoVTT = false
        let arrayText = textVTT.data.split('\n')
        this.arrayObjectText.length = 0
        for (let i = 2; i < arrayText.length; i += 3) {
          if (arrayText[i]) {
            let objText = {}
            objText['startTime'] = arrayText[i].split(' --> ')[0]
            objText['endTime'] = arrayText[i].split(' --> ')[1]
            objText['text'] = arrayText[i + 1]
            objText['isNOTValidStartTime'] = false
            objText['errorStartTimeMessage'] = ''
            objText['isNOTValidEndTime'] = false
            objText['errorEndTimeMessage'] = ''
            this.arrayObjectText.push(objText)
          }
        }
        this.srcSub = '../statics/video/' + this.currentVideo + '.vtt'
        this.srcVideo = '../statics/video/' + this.currentVideo + '.mp4'
      } else {
        this.isNoVTT = true
      }
      if (this.$q.loading.isActive) {
        this.$q.loading.hide()
      }
    },
    async generateVTT () {
      this.loading('Configuring VTT Generator')
      await axios.post('/api/track/create', {track: this.currentVideo})
      // update progress
      this.timerID = setInterval(async () => {
        let textVTT = await axios.get('/api/track/updateStatus?track=' + this.currentVideo)
        if (textVTT.data !== 'File not found.') {
          this.$q.notify({
            color: 'positive',
            position: 'bottom',
            message: 'Success!'
          })
          if (this.$q.loading.isActive) {
            this.$q.loading.hide()
          }
          clearInterval(this.timerID)
          this.chosenVideo(this.currentVideo)
        } else {
          this.$q.loading.show({
            spinner: QSpinnerGears,
            message: 'Generating VTT file for ' + this.currentVideo,
            messageColor: 'white',
            spinnerSize: 250, // in pixels
            spinnerColor: 'white'
          })
        }
      }, 10000)
    },
    play (index) {
      this.startTime = vttTomilisec(this.arrayObjectText[index].startTime)
    },
    async save () {
      for (let i in this.arrayObjectText) {
        if (this.arrayObjectText[i].isNOTValidStartTime || this.arrayObjectText[i].isNOTValidEndTime) {
          this.$q.notify('Please review fields again.')
          return
        }
      }
      this.srcVideo = ''
      this.srcSub = ''
      let isSuccess = await axios.post('/api/track/save', {track: this.currentVideo, text: this.arrayObjectText})
      if (isSuccess) {
        if (this.$q.loading.isActive) {
          this.$q.loading.hide()
        }
        this.$q.notify({
          color: 'positive',
          position: 'bottom',
          message: 'Success!'
        })
        this.srcVideo = '../statics/video/' + this.currentVideo + '.mp4'
        this.srcSub = '../statics/video/' + this.currentVideo + '.vtt'
      }
    },
    validateStartTime (index) {
      let result = validateFormat(this.arrayObjectText[index].startTime)
      if (result !== 'Valid') {
        this.arrayObjectText[index].errorStartTimeMessage = result
        this.arrayObjectText[index].isNOTValidStartTime = true
      } else {
        if (!this.arrayObjectText[index].isNOTValidEndTime) {
          if (vttTomilisec(this.arrayObjectText[index].startTime) < vttTomilisec(this.arrayObjectText[index].endTime)) {
            this.arrayObjectText[index].errorStartTimeMessage = ''
            this.arrayObjectText[index].isNOTValidStartTime = false
          } else {
            this.arrayObjectText[index].errorStartTimeMessage = 'Start Time must be less than End Time'
          }
        }
      }
    },
    validateEndTime (index) {
      let result = validateFormat(this.arrayObjectText[index].endTime)
      if (result !== 'Valid') {
        this.arrayObjectText[index].errorEndTimeMessage = result
        this.arrayObjectText[index].isNOTValidEndTime = true
      } else {
        if (!this.arrayObjectText[index].isNOTValidStartTime) {
          if (vttTomilisec(this.arrayObjectText[index].startTime) < vttTomilisec(this.arrayObjectText[index].endTime)) {
            this.arrayObjectText[index].errorEndTimeMessage = ''
            this.arrayObjectText[index].isNOTValidEndTime = false
          } else {
            this.arrayObjectText[index].errorEndTimeMessage = 'End Time must be greater than Start Time'
          }
        }
      }
    },
    loading (message) {
      this.$q.loading.show({
        spinner: QSpinnerPie,
        message: message,
        messageColor: 'white',
        spinnerSize: 250, // in pixels
        spinnerColor: 'white'
      })
    },
    mergeLines (index, option) {
      this.loading('Merging...')
      let source = 0
      let dest = 1
      if (option) {
        // merge line below
        source = index
        dest = index + 1
      } else {
        // merge line above
        source = index - 1
        dest = index
      }
      this.arrayObjectText[source].endTime = this.arrayObjectText[dest].endTime
      this.arrayObjectText[source].text = this.arrayObjectText[source].text + ' ' + this.arrayObjectText[dest].text
      this.arrayObjectText.splice(dest, 1)
      this.save()
    },
    splitLine (index) {
      let endTime = this.arrayObjectText[index].endTime
      this.arrayObjectText[index].endTime = ''
      let objText = {}
      objText['startTime'] = ''
      objText['endTime'] = endTime
      objText['text'] = ''
      objText['isNOTValidStartTime'] = true
      objText['errorStartTimeMessage'] = 'Time must have 12 letters and folllow HH:mm:ss.SSS format.'
      objText['isNOTValidEndTime'] = false
      objText['errorEndTimeMessage'] = ''
      this.arrayObjectText.splice(index + 1, 0, objText)
    },
    deleteLine (index) {
      this.loading('Deleting...')
      this.arrayObjectText.splice(index, 1)
      this.save()
    },
    async download () {
      let textVTT = await axios.get('/api/track/' + this.currentVideo)
      var blob = new Blob([textVTT.data], {type: 'text/plain;charset=utf-8'})
      FileSaver.saveAs(blob, this.currentVideo + '.vtt')
    }
  },
  components: {
    leftMenu,
    videoElement
  }
}
</script>

<style lang="scss" scoped>
.main {
    height: 100%;
    overflow: hidden;
}
</style>
