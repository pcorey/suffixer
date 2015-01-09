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

function initWiktionaryNamecheapPublication() {

    function entryExpired(entry) {
        return !entry.last_checked ||
               !moment(entry.last_checked).add(1,'hour').isAfter(moment());
    }

    function getWordRegex(word, suffix) {
        // var regex = Session.get('word')
        //     ? ('.*?'+Session.get('word')+'.*?'+Session.get('suffix')+'$')
        //     : (Session.get('suffix')+'$');
        // var definitionRegex = Session.get('definition')
        //     ? ('.*?'+Session.get('definition')+'.*?')
        //     : '';
        // console.log('regex:',regex);
        suffix = suffix ? suffix.replace(/\./g, '') : '';
        if (word) {
            return '.*?' + word + '.*?' + suffix + '$';
        }
        return suffix + '$';
    }

    function getDefinitionRegex(definition) {
        if (definition) {
            return '.*?'+definition+'.*?';
        }
        return '';
    }

    function getSelector(word, suffix, definition) {
        return {
            word: {$regex: getWordRegex(word, suffix), $options: 'i'},
            definition: {$regex: getDefinitionRegex(definition), $options: 'i'}
        };
    }

    function getOptions(limit) {
        return {
            limit: Math.min(limit, 20),
            sort: {word: 1}
        };
    }

    Meteor.publish('wiktionary-namecheap', function(word, suffix, definition, limit) {
        var results = Wiktionary.find(
            getSelector(word, suffix, definition),
            getOptions(limit));
        _.each(results.fetch(), function(result) {
            if (entryExpired(result)) {
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

}

Meteor.startup(function() {
    initNamecheap();
    initTLDPublication();
    initWiktionaryNamecheapPublication();
});