Wiktionary = new Meteor.Collection('wiktionary');

if (Meteor.isServer) {
    Meteor.publish('wiktionary', function(selector, options) {
        return Wiktionary.find(selector, options);
    });

    Meteor.startup(function() {
        if (!process.env.RESET_WIKTIONARY &&
            Wiktionary.find().count() > 0) {
            return;
        }

        function getTLDs() {
            return NamecheapTLDs.find().fetch().map(function(tld) {
                return tld.name;
            });
        }

        function preParseWikitext(text) {
            if (text.indexOf('#') == 0) {
                text = text.substr(1).trim();
            }
            text = text.replace(/{{/g, '(');
            text = text.replace(/}}/g, ')');
            return text;
        }

        function parseWikitext(text) {
            try {
                return wikipedia.plaintext(preParseWikitext(text));
            }
            catch (e) {
                return text;
            }
        }

        function getDomains(word, tlds) {
            word = word.toLowerCase().replace(/[^a-zA-Z0-9-]/g, '');
            return tlds.reduce(function(domains, tld) {
                tld = tld.toLowerCase().replace(/[^a-z]/g, '');
                var match = word.match(new RegExp('^(.*?)' + tld + '$'));
                if (match) {
                    domains.push(match[1] + '.' + tld);
                }
                return domains;
            }, []);
        }

        function buildDomains(domains) {
            return domains.map(function(domain) {
                return {
                    domain: domain
                }
            });
        }

        function insertOrUpdateEntry(word, definition, domains) {
            Wiktionary.upsert({word: word}, {
                $set: {
                    word: word,
                    domains: buildDomains(domains)
                },
                $push: {
                    definition: definition
                }
            });
        }

        function processWord(entry, tlds) {
            if (entry.length != 4) {
                return;
            }
            
            var definition = parseWikitext(String(entry[3]));
            var word = String(entry[1]);
            var domains = getDomains(word, tlds);

            if (domains.length <= 0 || definition.length <= 0) {
                return;
            }
            
            insertOrUpdateEntry(word, definition, domains);
        }

        function parseAndBuildWiktionary(asset) {
            var parser = new tsv.Parser('\t', {header: false});
            var wiktionary = parser.parse(Assets.getText(asset));
            for (var i = 0; i < wiktionary.length; i++) {
                processWord(wiktionary[i], tlds);
                if (!(i%10000)) console.log('*');
            }
            console.log('done');
        }

        function buildIndex() {
            try {
                Wiktionary._ensureIndex({definition: 'text'});
            }
            catch (error) {
                console.log('Unable to create index on Wiktionary collection:',error.message);
            }
        }

        var wikipedia = Npm.require('wtf_wikipedia');
        var tsv = Npm.require("tsv");

        var tlds = getTLDs();
        Wiktionary.remove({});

        console.log('Initializing Wiktionary');
        parseAndBuildWiktionary('enwikt-defs-20140609-en.tsv');
        buildIndex();

        console.log(Wiktionary.find().count()+' entries added to Wiktionary collection');
    });
}
