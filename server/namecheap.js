Meteor.startup(function() {
    console.log('Instantiating Namecheap with: ', process.env.NAMECHEAP_USERNAME,
                                                  process.env.NAMECHEAP_API_KEY,
                                                  process.env.NAMECHEAP_CLIENT_IP,
                                                  process.env.NAMECHEAP_SANDBOX);
    Namecheap = new  Meteor.npmRequire('namecheap')(process.env.NAMECHEAP_USERNAME,
                                                    process.env.NAMECHEAP_API_KEY,
                                                    process.env.NAMECHEAP_CLIENT_IP,
                                                    process.env.NAMECHEAP_SANDBOX);
});

Meteor.publish('dictionary-namecheap', function(selector, options) {
    var results = Wiktionary.find(selector, options);
    _.forEach(results.fetch(), function(result) {
        if (!result.last_checked ||
            !moment(result.last_checked).add(1,'minute').isAfter(moment())) {
            console.log('calling timeout for result ',result.word);
            Wiktionary.update(result._id, {$set: {last_checked: new Date()}});
            setTimeout(Meteor.bindEnvironment(function() {
                console.log('Updating result ',result.word);
                Wiktionary.update(result._id, {$set: {status: 'R'}});
            }), Math.random()*2000);
        }
    });
    return results;
});