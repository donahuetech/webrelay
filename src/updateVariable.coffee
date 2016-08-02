{get} = require('http')

module.exports = (ip, index, value, callback) ->

  get("http://#{ip}/state.xml?extvar#{index}=#{value}", (res) ->
    received = ''
    res.on('data', (data) -> received += data.toString())
    res.on('end', ->
      process.nextTick( -> callback(null, received))
    )
  ).on('error', (err) ->
    process.nextTick( -> callback(err, null))
  )
