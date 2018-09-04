const parallel = require('run-parallel')
const _ = require('lodash')
const yaml = require('js-yaml')

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
require('isomorphic-fetch');
const Dropbox = require('dropbox').Dropbox;

const app = express()
app.use(bodyParser.json())
app.use(cors())

app.listen(process.env.PORT || 8081)

const credentials = require('../credentials.json')

const dbx = new Dropbox({ accessToken: credentials.dbAccessToken });


app.get('/posts', (req, res) => {
  dbx.filesListFolder({path: ''})
    .then((response) => {
      console.log(response)
      res.send(_.chain(response.entries)
        .filter({'.tag': 'folder'})
        .map((folder) => {
          return {
            name: folder.name,
            path: folder.path_lower
          }
        })
        .value())
    })
    .catch((error) => {
      console.log(error);
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
    // Images
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

    var re = /(?:\.([^.]+))?$/;  // Expression that gets file extension

    var images = _
      .chain(results[1].entries)
      .filter((file) => { return re.exec(file.name)[1] === 'jpg'})
      .map("path_lower")
      .value().sort()

    var infoFile = _
      .chain(results[1].entries)
      .find((file) => { return re.exec(file.name)[1] === 'md'})
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
