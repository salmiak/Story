# Story

## ToDo
- Add OAuth to Dropbox

- Client:
  - Next / Prev post link on posts
    - Links next to content (or at bottom of text)
  - Infinit scroll on front page
  - Format EXIF date with dateFns (https://github.com/you-dont-need/You-Dont-Need-Momentjs#string--time-format)
  - Image loading spinner

- Endpoints:
  - info : based on bloginfo.md in root of apps folder
  x posts
  x post
  x image
  - refactor and send complete file-list on request and use VueStore on client side

## Notes

Image sizes are:
```
- w32h32
- w64h64
- w128h128
- w256h256
- w480h320
- w640h480
- w960h640
- w1024h768
- w2048h1536
```



## Project setup
```
$ npm install
```

### Compiles and hot-reloads frontend for development
```
$ npm run serve
```

### Backend on nodemon for developement
```
$ npm run server
```

## Heroku

### Setup

1. Make sure to have [heroku installed](https://devcenter.heroku.com/articles/heroku-cli#download-and-install).
2. Login to heroku
```
$ heroku login
```
3. Add heroku as new remote
```
$ git remote add heroku https://git.heroku.com/beckmanstory.git
```

### Deploy to Heroku
1. Login to heroku
```
$ heroku login
```
2. Make sure all changes are commited to `master`.
3. Push to heroku
```
$ git push heroku master
```

// Version 4
