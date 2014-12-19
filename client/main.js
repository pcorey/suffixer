Session.set('suffix', 'io');
Session.set('word', '');
Session.set('definition', '');

Template.body.helpers({
    entries: function() {
        return Dictionary.find({});
    }
});

Template.body.events({
    'keyup input[name=word]': function(e, t) {
        console.log('word change');
        Session.set('word', t.find('input[name=word]').value);
    },
    'keyup input[name=suffix]': function(e, t) {
        Session.set('suffix', t.find('input[name=suffix]').value);
    },
    'keyup input[name=definition]': function(e, t) {
        Session.set('definition', t.find('input[name=definition]').value);
    },
    'click button': function(e, t) {
        console.log('Testy: ',Meteor.call('testy'));
    }
})

Meteor.autorun(function() {
    var regex = Session.get('word')
        ? ('.*?'+Session.get('word')+'.*?'+Session.get('suffix')+'$')
        : (Session.get('suffix')+'$');
    var definitionRegex = Session.get('definition')
        ? ('.*?'+Session.get('definition')+'.*?')
        : '';
    console.log('regex:',regex);
    
    Meteor.subscribe('dictionary', {
        word: {$regex: regex, $options: 'i'},
        definition: {$regex: definitionRegex, $options: 'i'}
    }, {
        limit: 20,
        sort: {word: 1}
    });
});

Meteor.autorun(function() {
    var results = Dictionary.find({}).fetch();
    console.log('rerunning...', results);
});

//TODO: Move to full text seach mongo instance:
//http://www.meteorpedia.com/read/Fulltext_search

//TODO: Hook up namecheap API:
//https://www.namecheap.com/support/api/methods/domains/check.aspx
