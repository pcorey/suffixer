function initWiktionaryNamecheapPublication() {

    function domainCheckExpired(domain) {
        return !domain.last_checked ||
               !moment(domain.last_checked).add(1,'minute').isAfter(moment());
    }

    function getWordRegex(word, suffix) {
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

    function getSelector(word, suffix, definition, hideRegistered) {
        var selector = {
            word: {$regex: getWordRegex(word, suffix), $options: 'i'},
            definition: {$regex: getDefinitionRegex(definition), $options: 'i'}
        };

        if (hideRegistered) {
            selector.domains = {
                $elemMatch: {
                    available: true
                }
            };
        }

        return selector;
    }

    function getOptions(limit) {
        return {
            limit: limit,
            sort: {word: 1}
        };
    }

    function buildCheckCallback(entry, domain) {
        return Meteor.bindEnvironment(function(err, res) {
            if (err || !res || !res.DomainCheckResult || (res && res.DomainCheckResult && res.DomainCheckResult.ErrorNo)) {
                Kadira.trackError('Namecheap.domains.check', err ? err.message : res.DomainCheckResult.Description);
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

    Meteor.publish('wiktionary-namecheap', function(word, suffix, definition, limit, hideRegistered) {
        var results = Wiktionary.find(
            getSelector(word, suffix, definition, hideRegistered),
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