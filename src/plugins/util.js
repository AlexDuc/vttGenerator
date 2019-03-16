import moment from 'moment'

function milisecTovtt (sec) {
  // convert from milisecond to vtt time
  let str = moment.utc(sec).format(moment.HTML5_FMT.TIME_MS)
  return str
}

function vttTomilisec (time) {
  // convert from vtt time to milisecond
  let arrayTime = time.split('.')
  let arraySecond = arrayTime[0].split(':')
  let seconds = (+arraySecond[0]) * 60 * 60 + (+arraySecond[1]) * 60 + (+arraySecond[2])
  let milisecond = seconds + '.' + arrayTime[1]
  return milisecond
}

function validateFormat (time) {
  if (time.length === 12) {
    var sec = moment(time, moment.HTML5_FMT.TIME_MS, true).isValid()
    if (sec) {
      return 'Valid'
    } else {
      return 'Time must folllow HH:mm:ss.SSS format'
    }
  } else {
    return 'Time must have 12 letters and folllow HH:mm:ss.SSS format.'
  }
}

export { milisecTovtt, vttTomilisec, validateFormat }
