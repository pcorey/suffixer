var json = require('./dictionary.json');
var mongojs = require('mongojs');
var db = mongojs('localhost:3001/meteor', ['dictionary']);

console.log('length: ', Object.keys(json).length);

for (var key in json) {
    if (json.hasOwnProperty(key)) {
        var obj = {
            word: key,
            definition: json[key]
        };
        //console.log('inserting', obj);
        db.dictionary.insert(obj);
        //console.log(key, json[key]);
    }
}

console.log('done');