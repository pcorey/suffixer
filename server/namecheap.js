function initWiktionaryNamecheapPublication() {

    //var throttledCheck = _.throttle(Namecheap.domains.check, 250);

    function domainCheckExpired(domain) {
        return !domain.last_checked ||
               !moment(domain.last_checked).add(1,'month').isAfter(moment());
    }

    function getWordRegex(suffix) {
        suffix = suffix ? suffix.replace(/\./g, '') : '';
        return '^[a-zA-Z0-9][a-zA-Z0-0-]*[a-zA-Z0-9]?' + suffix + '$';
    }

    function getDefinitionRegex(definition) {
        return {
            $search: definition
        };
    }

    function getSelector(suffix, definition, hideRegistered, favorites) {
        var selector = {
            $or: [
                {
                    _id: {$in: favorites}
                },
                {
                    $and: [
                        {word: {$regex: getWordRegex(suffix), $options: 'i'}},
                        {$text: getDefinitionRegex(definition)}
                    ]
                }
            ]
        };

        if (hideRegistered) {
            selector.domains = {
                $elemMatch: {
                    $or: [
                        {available: true},
                        {available: undefined}
                    ]
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

    function buildProcessResult(domainMap) {
        return function(result) {
            if (result.ErrorNo) {
                Kadira.trackError('Namecheap.domains.check', JSON.stringify(result));
                return;
            }
            var id = domainMap[result.Domain];
            Wiktionary.update({
                '_id': id,
                'domains.domain': result.Domain
            }, {
                $set: {
                    'domains.$.available': result.Available,
                    'domains.$.last_checked': new Date()
                }
            });
        };
    }

    function buildCheckCallback(domainMap) {
        return Meteor.bindEnvironment(function(err, res) {
            if (err) {
                console.log('err', err);
                Kadira.trackError('Namecheap.domains.check', err.message);
                return;
            }
            if (!res.DomainCheckResult) {
                console.log('no checkresult', res);
                Kadira.trackError('Namecheap.domains.check', JSON.stringify(res));
                return;
            }
            if (res.DomainCheckResult.constructor == Array) {
                res.DomainCheckResult.map(buildProcessResult(domainMap));
            }
            else {
                buildProcessResult(domainMap)(res.DomainCheckResult);
            }
        })
    }

    function getDomainMap(results) {
        var map = {
            domains: [],
            map: {}
        }
        results.fetch().map(function(result) {
            result.domains.filter(domainCheckExpired).map(function(domain) {
                map.domains.push(domain.domain);
                map.map[domain.domain] = result._id;
            });
        });
        return map;
    }

    function checkAndUpdateDomains(domainMap) {
        if (domainMap.domains && domainMap.domains.length) {
            Namecheap.domains.check(domainMap.domains, buildCheckCallback(domainMap.map));
        }
    }

    Meteor.publish('wiktionary-namecheap', function(suffix, definition, limit, hideRegistered, favorites) {
        var results = Wiktionary.find(
            getSelector(suffix, definition, hideRegistered, favorites),
            getOptions(limit));
        var domainMap = getDomainMap(results);
        checkAndUpdateDomains(domainMap);
        return results;
    });
}

Meteor.startup(function() {
    initWiktionaryNamecheapPublication();
});