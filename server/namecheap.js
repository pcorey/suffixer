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
            return '.+' + word + '.*?' + suffix + '$';
        }
        return '[a-zA-Z0-9][a-zA-Z0-0-]*[a-zA-Z0-9]?' + suffix + '$';
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
    initWiktionaryNamecheapPublication();
});