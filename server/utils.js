const _ = require('lodash')
const yaml = require('js-yaml')

module.exports = {
  getFileExt: function (name) {
    var re = /(?:\.([^.]+))?$/;  // Expression that gets file extension
    return re.exec(name)[1]
  },
  parseInfoFile: function(binaryData) {
    const postInfoArray = binaryData.toString('utf8').split('///')

    if (postInfoArray.length > 1) {
      return {
        info: _.mapKeys(yaml.load(_.trim(postInfoArray[0])), (v, k) => { return k.toLowerCase() })
      }
    } else {
      return undefined
    }
  }
}
