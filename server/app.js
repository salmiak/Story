const parallel = require('run-parallel')
const _ = require('lodash')
const yaml = require('js-yaml')
const ExifImage = require('exif').ExifImage
const { getFileExt } = require('./utils')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const serveStatic = require('serve-static');
require('isomorphic-fetch');
const Dropbox = require('dropbox').Dropbox;
const basicAuth = require('express-basic-auth')

// Keep node dyno on heroku live by pinging it every 5 min
// source: https://quickleft.com/blog/6-easy-ways-to-prevent-your-heroku-node-app-from-sleeping/
const http = require("http");
setInterval(function() {
    http.get("http://beckmanstory.herokuapp.com")
    console.log('It\'s alive!')
}, 300000); // every 5 minutes (300000)

const app = express()

app.use(bodyParser.json())
app.use(cors())
app.use(serveStatic(__dirname + "/../dist"))

app.listen(process.env.PORT || 8081)

// Basic Auth that is used on images endpoint to make images a little more protected.
const bAuth = basicAuth({
    users: { 'gro': 'hedda' },
    challenge: true,
    realm: '9l7VdOe',
})

const credentials = process.env.dbAccessToken || require('../credentials.json').dbAccessToken
const dbx = new Dropbox({ accessToken: credentials });

app.get('/posts', (req, res) => {
  dbx.filesListFolder({path: ''})
    .then((response) => {
      // Create one parallel process for each folder.
      parallel(_.chain(response.result.entries)
        .filter({'.tag': 'folder'})
        .map((folder) => {
          return (callback) => {

            dbx.filesListFolder({
              path: folder.path_lower
            })
              .then((response) => {

                // Get first image in folder to set as thumbnail on index.
                var imageInfo = _.chain(response.result.entries)
                  .filter((file) => { return getFileExt(file.name) === 'jpg' })
                  .sortBy((file) => { return file.name })
                  .head()
                  .value()

                var postFile = _.chain(response.entries)
                  .filter((file) => { return getFileExt(file.name) === 'md' })
                  .head()
                  .value()

                var payload = {
                  postFile: postFile,
                  firstImage: imageInfo,
                  date: new Date(), // imageInfo?new Date(imageInfo.media_info.metadata.time_taken):null,
                  name: folder.name,
                  path: folder.path_lower
                }

                /*
                if (postFile) {
                  dbx.filesDownload({path: postFile.path_lower})
                  .then((postFileResponse) => {

                    var postInfoArray = postFileResponse.fileBinary.toString('utf8').split('///')

                    if (postInfoArray.length > 1) {
                      payload.info = _.mapKeys(yaml.load(_.trim(postInfoArray[0])), (v, k) => { return k.toLowerCase() })
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
                }*/
                callback(null, payload)
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
          callback(null, _.chain(response.result.entries).find({ path_lower: '/'+req.params.path }).value())
        })
        .catch((error) => {
          console.error(error)
        })
    },
    // Content
    (callback) => {
      dbx.filesListFolder({path: '/'+req.params.path})
        .then((response) => {
          callback(null, response.result)
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

        var postInfoArray = response.result.fileBinary.toString('utf8').split('///')

        if (postInfoArray.length > 1) {
          toSend.info = _.mapKeys(yaml.load(_.trim(postInfoArray[0])), (v, k) => { return k.toLowerCase() })
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

app.get('/image/:size*', bAuth, (req, res) => {

  res.setHeader("Cache-Control", "public, max-age=2592000");
  res.setHeader("Expires", new Date(Date.now() + 2592000000).toUTCString());

  dbx.filesGetThumbnail({
    path: req.params[0],
    format: 'jpeg',
    size: req.params.size
  })
  .then(function(response) {
    res.contentType('image/jpeg');
    res.send(response.result.fileBinary)
  })
  .catch(function(error) {
    console.error(error);
  })
})

app.get('/exif*', (req, res) => {

  res.setHeader("Cache-Control", "public, max-age=2592000");
  res.setHeader("Expires", new Date(Date.now() + 2592000000).toUTCString());

  dbx.filesDownload({
    path: req.params[0]
  })
  .then(function(response) {

    try {
      new ExifImage({ image : response.result.fileBinary }, function (error, exifData) {
        if (error)
          console.log('Error: '+error.message);
        else
          // console.log(exifData); // Do something with your data!
          res.send(exifData)
      });
    } catch (error) {
      console.log('Error: ' + error.message);
    }
  })
  .catch(function(error) {
    console.error(error);
  })
})
