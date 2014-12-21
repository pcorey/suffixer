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
    var results = Dictionary.find(selector, options);
    _.forEach(results.fetch(), function(result) {
        if (result) {
            console.log(result.word);
        }
    });
    return results;
});