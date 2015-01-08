TLDs = new Meteor.Collection('tlds');

function initNamecheap() {
    console.log('Instantiating Namecheap with: ', process.env.NAMECHEAP_USERNAME,
                                                  process.env.NAMECHEAP_API_KEY,
                                                  process.env.NAMECHEAP_CLIENT_IP,
                                                  process.env.NAMECHEAP_SANDBOX);

    Namecheap = Meteor.npmRequire('namecheap');
    namecheap = new Namecheap(process.env.NAMECHEAP_USERNAME,
                              process.env.NAMECHEAP_API_KEY,
                              process.env.NAMECHEAP_CLIENT_IP,
                              process.env.NAMECHEAP_SANDBOX);
}

function initTLDPublication() {
    function tldsExpired(tlds) {
        var first = tlds.fetch()[0];
        return !first ||
               !first.last_checked ||
               !moment(first.last_checked).add(1,'day').isAfter(moment());
    }

    function updateTLD(name, last_checked) {
        TLDs.upsert({
            tld: name
        }, {
            $set: {
                last_checked: last_checked
            }
        });
    }

    function updateAllTLDs() {
        var list = Async.wrap(namecheap.domains.getTldList)();
        var last_checked = new Date();
        _.each(list.Tlds.Tld, function(tld) {
            updateTLD(tld.Name, last_checked);
        });
    }

    Meteor.publish('tlds', function() {
        var tlds = TLDs.find();

        if (tldsExpired(tlds)) {
            console.log('Updating TLD list via Namecheap');
            updateAllTLDs();
        }
        return tlds;
    });
}

Meteor.startup(function() {
    initNamecheap();
    initTLDPublication();
});

Meteor.publish('dictionary-namecheap', function(selector, options) {
    var results = Wiktionary.find(selector, options);
    _.forEach(results.fetch(), function(result) {
        if (!result.last_checked ||
            !moment(result.last_checked).add(1,'hour').isAfter(moment())) {
            //console.log('calling timeout for result ',result.word);
            //Wiktionary.update(result._id, {$set: {last_checked: new Date()}});

            setTimeout(Meteor.bindEnvironment(function() {
                //console.log('Updating result ',result.word);
                //Wiktionary.update(result._id, {$set: {status: 'R'}});
            }), Math.random()*2000);
        }
    });
    return results;
});

Meteor.methods({
    getTLDs: function() {
        console.log('in getTLDs', namecheap);
        // var res = Async.runSync(function(done) {
        //     namecheap.domains.getTldList(function(err, res) {
        //         console.log('in callback');
        //         done(err, res);
        //     });
        // });
        // console.log('returning res', res);
        // return res;
        return Async.wrap(namecheap.domains.getTldList)();
    }
});

/* TLDs:


{
    last_checked: datetime
    tlds: [
        blah
        blag2
    ]
}

*/