var router = require('express').Router()
// var fs = require('fs-extra')
var path = require('path')
var fs = require('fs')
var bodyParser = require('body-parser')
var shell = require('shelljs')
router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())
var videoPath = '../src/statics/video/'

function removeRootDirectoryName (files) {
  let mp4Files = []
  for (var i = 0, len = files.length; i < len; i++) {
    if (files[i].indexOf('.mp4') >= 0) {
      files[i] = files[i].substring(files[i].lastIndexOf('/') + 1)
      files[i] = files[i].substring(0, files[i].lastIndexOf('.'))
      mp4Files.push(files[i])
    }
  }
  return mp4Files
}

router.get('/', (req, res) => {
  // Get all video files.
  var walk = require('walk')
  var files = []
  // Walker options
  var walker = walk.walk(videoPath, {
    followLinks: false
  })
  walker.on('file', function (root, stat, next) {
    // Add this file to the list of files
    files.push(root + '/' + stat.name)
    next()
  })
  walker.on('end', function () {
    files = removeRootDirectoryName(files)
    return res.send(files)
  })
})

router.get('/updateStatus', (req, res) => {
  // check if the file exists
  var id = req.query.track
  var pathFile = path.join(videoPath + id + '.vtt')
  if (fs.existsSync(pathFile)) {
    res.send('Found')
  } else {
    res.send('File not found.')
  }
})
router.get('/:id', (req, res) => {
  // get the vtt file from the video
  var id = req.params.id
  var pathFile = path.join(videoPath + id + '.vtt')
  fs.readFile(pathFile, 'utf8', (err, data) => {
    if (err) {
      res.send('File not found.')
    } else {
      res.send(data)
    }
  })
})
router.post('/save', (req, res) => {
  // save back to the vtt file
  var track = req.body.track
  var data = req.body.text
  var textResult = 'WEBVTT\n\n'
  for (var i = 0; i < data.length; i++) {
    textResult = textResult + data[i].startTime + ' --> ' + data[i].endTime + '\n'
    textResult = textResult + data[i].text + '\n\n'
  }
  textResult = textResult.substring(0, textResult.length - 2)
  var pathFile = path.join(videoPath + track + '.vtt')
  fs.writeFile(pathFile, textResult, (err) => {
    if (err) {
      res.status(400).send('Error')
    } else {
      res.status(200).send('Successfully write to file.')
    }
  })
})
router.post('/create', (req, res) => {
  // req.connection.setTimeout(60 * 10 * 1000)
  var track = req.body.track
  var pathFileVideo = path.join(videoPath + track + '.mp4')
  // send a first success to report a status
  res.send('success')
  // command line for jar file.
  shell.exec('java -jar VTTGenerator.jar ' + pathFileVideo, function (code, stdout, stderr) {
    console.log('Done generating file!')
  })
})

module.exports = router
