Session.set('suffix', '');
Session.set('word', '');
Session.set('definition', '');
Session.set('limit', 20);
Session.set('loading', false);

Template.body.helpers({
    entries: function() {
        return Wiktionary.find();
    },
    showMoreSpinner: function() {
        return Session.get('loading');
    },
    showResults: function() {
        return Session.get('definition') || Session.get('suffix');
    }
});

Template.body.events({
    'keyup #word': function(e, t) {
        Session.set('word', e.target.value);
    },
    'core-select #suffix': function(e, t) {
        Session.set('limit', 20);
        Session.set('suffix', e.originalEvent.detail.item.innerText);
    },
    'keyup #definition': function(e, t) {
        Session.set('limit', 20);
        Session.set('definition', e.target.value);
    },
    'click .more': function(e, t) {
        console.log('more!');
        Session.set('limit', Session.get('limit') + 20);
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
    
    Session.set('loading', true);
    Meteor.subscribe('wiktionary-namecheap',
        Session.get('word'),
        Session.get('suffix'),
        Session.get('definition'),
        Session.get('limit'), function() {
            Session.set('loading', false);
        });
});

Meteor.subscribe('tlds');

// Meteor.autorun(function() {
//     var results = Wiktionary.find({}, {
//         transform: function(entry) {
//             return new Domain(entry, Session.get('suffix'));
//         }
//     }).fetch();
//     console.log('rerunning...', results);
// });

//TODO: Move to full text seach mongo instance:
//http://www.meteorpedia.com/read/Fulltext_search

//TODO: Hook up namecheap API:
//https://www.namecheap.com/support/api/methods/domains/check.aspx
