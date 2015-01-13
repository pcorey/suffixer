function initWiktionaryNamecheapPublication() {

    function domainCheckExpired(domain) {
        return !domain.last_checked ||
               !moment(domain.last_checked).add(1,'minute').isAfter(moment());
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

    function buildCheckCallback(entry, domain) {
        return Meteor.bindEnvironment(function(err, res) {
            if (err || !res || !res.DomainCheckResult || (res && res.DomainCheckResult && res.DomainCheckResult.ErrorNo)) {
                Kadira.trackError('Namecheap.domains.check', 'Unable to check domain ' + domain.domain, res);
                //console.log('Error checking ' + domain.domain + ':', err, res);
                return;
            }

            Wiktionary.update({
                '_id': entry._id,
                'domains.domain': domain.domain
            }, {
                $set: {
                    'domains.$.available': res.DomainCheckResult.Available,
                    'domains.$.last_checked': new Date()
                }
            });
        })
    }

    function checkAndUpdateDomain(entry, domain) {
        if (domainCheckExpired(domain)) {
            Namecheap.domains.check(domain.domain, buildCheckCallback(entry, domain));
        }
    }

    Meteor.publish('wiktionary-namecheap', function(word, suffix, definition, limit) {
        var results = Wiktionary.find(
            getSelector(word, suffix, definition),
            getOptions(limit));
        _.each(results.fetch(), function(result) {
            _.each(result.domains, function(domain) {
                checkAndUpdateDomain(result, domain);
            });
        });
        return results;
    });

}

Meteor.startup(function() {
    initWiktionaryNamecheapPublication();
});