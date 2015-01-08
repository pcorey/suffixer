Session.set('suffix', 'io');
Session.set('word', '');
Session.set('definition', '');

Template.body.helpers({
    entries: function() {
        return Wiktionary.find({});
    }
});

Template.body.events({
    'keyup #word': function(e, t) {
        Session.set('word', e.target.value);
    },
    'keyup #suffix': function(e, t) {
        Session.set('suffix', e.target.value);
    },
    'keyup #definition': function(e, t) {
        Session.set('definition', e.target.value);
    },
    'click button': function(e, t) {
        console.log('Testy: ',Meteor.call('testy'));
    }
});

Meteor.autorun(function() {
    var regex = Session.get('word')
        ? ('.*?'+Session.get('word')+'.*?'+Session.get('suffix')+'$')
        : (Session.get('suffix')+'$');
    var definitionRegex = Session.get('definition')
        ? ('.*?'+Session.get('definition')+'.*?')
        : '';
    console.log('regex:',regex);
    
    Meteor.subscribe('dictionary-namecheap', {
        word: {$regex: regex, $options: 'i'},
        definition: {$regex: definitionRegex, $options: 'i'}
    }, {
        limit: 20,
        sort: {word: 1}
    });
});

Meteor.subscribe('tlds');

Meteor.autorun(function() {
    var results = Wiktionary.find({}).fetch();
    console.log('rerunning...', results);
});

//TODO: Move to full text seach mongo instance:
//http://www.meteorpedia.com/read/Fulltext_search

//TODO: Hook up namecheap API:
//https://www.namecheap.com/support/api/methods/domains/check.aspx
