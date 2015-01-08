Wiktionary = new Meteor.Collection('wiktionary');

if (Meteor.isServer) {
    Meteor.publish('wiktionary', function(selector, options) {
        return Wiktionary.find(selector, options);
    });

    Meteor.startup(function() {
        if (Wiktionary.find().count() > 0) {
            return;
        }

        var wikipedia = Npm.require('wtf_wikipedia');
        var tsv = Npm.require("tsv");

        // var replaceTemplate = function(template, args) {
        //     switch (template) {
        //         case 'abbreviation of':
        //         case 'abbreviation of ':
        //         return 'Abbreviation of ' + wikipedia.plaintext(args[0]) + '.';
        //         case 'alternative form of':
        //         case 'alternate form of ':
        //         return 'Alternative form of ' + wikipedia.plaintext(args[0]) + '.';
        //         case 'form of':
        //         return wikipedia.plaintext(args[0]) + ': ' + wikipedia.plaintext(args[1]) + '.';
        //         case 'initialism of':
        //         case 'initialism of ':
        //         return 'Initialism of ' + wikipedia.plaintext(args[0]) + '.';
        //         case 'plural of':
        //         return 'Plural of ' + wikipedia.plaintext(args[0]) + '.';
        //         case 'standard spelling of':
        //         return 'Standard ' + args[0].split('=')[1] + ' of ' + wikipedia.plaintext(args[2]) + '.';
        //         case 'alternative spelling of':
        //         return 'Alternative spelling of ' + wikipedia.plaintext(args[0]) + '.';
        //         case 'alternative name of':
        //         return 'Alternative name of ' + wikipedia.plaintext(args[0]) + '.';
        //         case 'context':
        //         case 'label':
        //         return 'Context: ' + wikipedia.plaintext(args.filter(function(arg) {
        //             return arg != 'lang=en' && arg != '_';
        //         }).join('/')) + '.';
        //         case 'defdate':
        //         return wikipedia.plaintext(args[0]);
        //         case 'non-gloss definition':
        //         return wikipedia.plaintext(args[0]);
        //         case 'en-past of':
        //         return 'Simple past and past participle of ' + wikipedia.plaintext(args[0]);
        //         case 'w':
        //         return wikipedia.plaintext(args[0]);
        //         case 'present participle of':
        //         return 'Present participle of '+wikipedia.plaintext(args[0]);
        //         case 'en-third-person singular of':
        //         return 'Third person singular of '+wikipedia.plaintext(args[0]);
        //         case 'l/en':
        //         return wikipedia.plaintext(args[0]);
        //         default:
        //         console.log('Unmatched template! ', '\''+template+'\'', args);
        //         return '';
        //     }
        // };

        console.log('Initializing Wiktionary');
        var parser = new tsv.Parser('\t', {header: false});
        var wiktionary = parser.parse(Assets.getText('enwikt-defs-20140609-en.tsv'));
        for (var i = 0; i < wiktionary.length; i++) {
            var word = wiktionary[i];
            if (word.length != 4) {
                continue;
            }
            if (word[3].indexOf('#') == 0) {
                word[3] = word[3].substr(1).trim();
            }
            // var m = word[3].match(/^(.*?){{(.*?)\|(.*?)\|(.*?)}}(.*?)$/);
            // if (m && m[2] != 'context') {
            //     //console.log(m[2]);
            //     word[3] = [m[1],m[2],m[3],m[5]].join(' ').trim();
            //     console.log(word[3]);
            // }

            // var m = word[3].match(/^(.*?){{(.*?)}}(.*?)$/);
            // if (m && m[1].length == 0 && m[3].length == 0) {
            //     var args = m[2].split('|');
            //     var template = replaceTemplate(args.shift(), args);
            //     console.log('template', template);
            //     word[3] = [m[1], template, m[3]].join(' ').trim();
            // }

            //word[3] = word[3].replace(/{{(.*?)}}/g, '($1)');

            try {
            var text = wikipedia.plaintext(word[3]);
            }
            catch (e) {
                console.log('\''+word[3]+'\'');
                text = word[3];
            }
            if (text.length <= 0) {
                //console.log('Skipping '+word[1]+' => '+word[3]);
                continue;
            }
            Wiktionary.insert({
                word: word[1],
                part_of_speech: word[2],
                definition: text
            });
            // Wiktionary.upsert({
            //     word: String(word[1]).trim()
            // }, {
            //     $push: {definition: text}
            // });
        }

        try {
            Wiktionary._ensureIndex({definition: 'text'});
        }
        catch (error) {
            console.log('Unable to create index on Wiktionary collection:',error.message);
        }

        console.log(Wiktionary.find().count()+' entries added to Wiktionary collection');
    });
}
