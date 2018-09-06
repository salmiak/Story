module.exports = {
  getFileExt: function (name) {
    var re = /(?:\.([^.]+))?$/;  // Expression that gets file extension
    return re.exec(name)[1]
  }
}
