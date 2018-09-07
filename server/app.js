const parallel = require('run-parallel')
const _ = require('lodash')
const yaml = require('js-yaml')
const { getFileExt } = require('./utils')

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const serveStatic = require('serve-static');
require('isomorphic-fetch');
const Dropbox = require('dropbox').Dropbox;

const app = express()
app.use(bodyParser.json())
app.use(cors())
app.use(serveStatic(__dirname + "/../dist"))

app.listen(process.env.PORT || 8081)

const credentials = process.env.dbAccessToken || require('../credentials.json').dbAccessToken

const dbx = new Dropbox({ accessToken: credentials });

app.get('/posts', (req, res) => {
  dbx.filesListFolder({path: ''})
    .then((response) => {
      parallel(_.chain(response.entries)
        .filter({'.tag': 'folder'})
        .map((folder) => {
          return (callback) => {

            dbx.filesListFolder({
              path: folder.path_lower,
              include_media_info: true
            })
              .then((response) => {

                var imageInfo = _.chain(response.entries)
                  .filter((file) => { return getFileExt(file.name) === 'jpg' })
                  .sortBy((file) => { return (new Date( file.media_info.metadata.time_taken)).getTime() })
                  .head()
                  .value()

                var postFile = _.chain(response.entries)
                  .filter((file) => { return getFileExt(file.name) === 'md' })
                  .head()
                  .value()

                var payload = {
                  postFile: postFile,
                  firstImage: imageInfo,
                  date: imageInfo?new Date(imageInfo.media_info.metadata.time_taken):null,
                  name: folder.name,
                  path: folder.path_lower
                }

                if (postFile) {
                  dbx.filesDownload({path: postFile.path_lower})
                  .then((postFileResponse) => {

                    var postInfoArray = postFileResponse.fileBinary.toString('utf8').split('///')

                    if (postInfoArray.length > 1) {
                      payload.info = yaml.load(_.trim(postInfoArray[0]))
                    }
                    if (payload.info.Date) {
                      payload.date = new Date(payload.info.Date)
                    }
                    if (payload.info.cover) {
                      coverImage = _.chain(response.entries)
                        .filter((file) => { return file.name.search(payload.info.cover) !== -1 })
                        .head()
                        .value()
                      payload.firstImage = coverImage || payload.firstImage
                    }

                    callback(null, payload)
                  })
                  .catch((err) => {
                    console.error(err)
                  })
                } else {
                  callback(null, payload)
                }
              })
              .catch((error) => {
                console.log(error)
              })
          }
        })
        .value(),
      (err, results) => {
        results = _.chain(results)
          .sortBy((folder) => {
            return folder.date?folder.date.getTime():0
          })
          .reverse()
          .value()
        res.send(results)
      })
    })
    .catch((error) => {
      console.log(error)
    });
});

app.get('/posts/:path', (req, res) => {

  parallel([
    // Folder info
    (callback) => {
      dbx.filesListFolder({path: ''})
        .then((response) => {
          callback(null, _.chain(response.entries).find({ path_lower: '/'+req.params.path }).value())
        })
        .catch((error) => {
          console.error(error)
        })
    },
    // Content
    (callback) => {
      dbx.filesListFolder({path: '/'+req.params.path})
        .then((response) => {
          callback(null, response)
        })
        .catch((error) => {
          console.error(error)
        })
    }
  ],
  (err, results) => {

    var images = _
      .chain(results[1].entries)
      .filter((file) => { return getFileExt(file.name) === 'jpg'})
      .map("path_lower")
      .value().sort()

    var infoFile = _
      .chain(results[1].entries)
      .find((file) => { return getFileExt(file.name) === 'md'})
      .value()

    var toSend = {
      name: results[0].name,
      path: results[0].path_lower,
      images: images,
      info: {}
    }

    if (infoFile) {
      dbx.filesDownload({path: infoFile.path_lower})
      .then((response) => {

        var postInfoArray = response.fileBinary.toString('utf8').split('///')

        if (postInfoArray.length > 1) {
          toSend.info = yaml.load(_.trim(postInfoArray[0]))
          toSend.post = _.trim(postInfoArray[1])
        } else {
          toSend.post = _.trim(postInfoArray[0])
        }

        res.send(toSend)
      })
      .catch((err) => {
        console.error(err)
      })
    } else {
      res.send(toSend)
    }
  })
})

app.get('/image/:size*', (req, res) => {
  dbx.filesGetThumbnail({
    path: req.params[0],
    format: 'jpeg',
    size: req.params.size
  })
  .then(function(response) {
    res.contentType('image/jpeg');
    res.send(response.fileBinary)
  })
  .catch(function(error) {
    console.error(error);
  });;
})
