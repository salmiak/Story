<template>
  <div class="exif">
    <div v-if="exifData" class="exifContent">
      <i class="fal fa-clock" /> {{formatDateTime}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      f/{{exifData.exif.FNumber}} |
      <i class="fal fa-stopwatch" /> 1/{{(1/exifData.exif.ExposureTime)}} |
      ISO: {{exifData.exif.ISO}}
    </div>
    <div v-else class="exifContent">
      Loading info...
    </div>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  name: 'Exif',
  props: ['path'],
  data () {
    return {
      exifData: undefined,
      request: undefined
    }
  },
  mounted () {
    this.$http.get('exif' + this.path, {
      before (req) {
        if (this.request) {
          this.request.abort()
        }
        this.request = req
      }
    }).then(response => {
      this.exifData = response.body
      this.request = undefined
    }, err => {
      // error callback
      console.error(err)
    })
  },
  beforeDestroy () {
    if (this.request) {
      this.request.abort()
    }
  },
  computed: {
    formatDateTime () {
      if (!this.exifData) {
        return ''
      }
      moment.locale('sv')
      return moment(this.exifData.exif.DateTimeOriginal, 'YYYY:MM:DD HH:mm:ss').format('lll[:]ss')
    }
  }
}
</script>

<style lang="less" scoped>
.exif {
  font-size: .6rem;
  position: absolute;
  bottom: .5rem;
  &Content {
    background: fade(#000, 70%);
    margin: 0 auto;
    color: #FFF;
    border-radius: 5rem;
    padding: .5rem 1rem;
    white-space: nowrap;
  }
}
</style>
