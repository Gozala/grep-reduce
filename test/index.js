"use strict";

var grep = require("../grep")
var into = require("reducers/into")

var cities = {
  "kiev": 1985,
  "tbilisi": 1985,
  "amsterdam": 2008,
  "paris": 2010,
  "san francisco": 2012
}

exports["test grep"] = function(assert) {
  assert.deepEqual(into(grep("", Object.keys(cities))), [
    [ 'kiev', 0.75 ],
    [ 'tbilisi', 0.75 ],
    [ 'amsterdam', 0.75 ],
    [ 'paris', 0.75 ],
    [ 'san francisco', 0.75 ]
  ], "no input gives 0.75 match on all")

  assert.deepEqual(into(grep("t", Object.keys(cities))), [
    [ 'tbilisi', 0.8444911182523067 ],
    [ 'amsterdam', 0.6833333333333333 ]
  ], "more matches scores better")

  assert.deepEqual(into(grep("nope", Object.keys(cities))), [],
                   "no matches")
}

exports["test grep with serializer"] = function(assert) {
  var data = Object.keys(cities).reduce(function(data, name) {
    data.push({ key: name, value: cities[name] })
    return data
  }, [])

  function serialize(value) {
    return value.key + "\n" + value.value
  }

  assert.deepEqual(into(grep("", data, serialize)), [
    [ { key: 'kiev', value: 1985 }, 0.75 ],
    [ { key: 'tbilisi', value: 1985 }, 0.75 ],
    [ { key: 'amsterdam', value: 2008 }, 0.75 ],
    [ { key: 'paris', value: 2010 }, 0.75 ],
    [ { key: 'san francisco', value: 2012 }, 0.75 ]
  ], "no input gives 0.75 match on all")

  assert.deepEqual(into(grep("t", data, serialize)), [
    [ { key: 'tbilisi', value: 1985 }, 0.8221687836487032 ],
    [ { key: 'amsterdam', value: 2008 }, 0.7203867390495347 ]
  ], "more matches scores better")

  assert.deepEqual(into(grep("nope", data, serialize)), [],
                   "no matches")

  assert.deepEqual(into(grep("19", data, serialize)), [
    [ { key: 'kiev', value: 1985 }, 0.6178511301977578 ],
    [ { key: 'tbilisi', value: 1985 }, 0.5520620726159657 ]
  ], "values are also searched if they are serialized")
}

require("test").run(exports)
