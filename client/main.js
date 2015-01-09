Session.set('suffix', '');
Session.set('word', '');
Session.set('definition', '');

Template.body.helpers({
    entries: function() {
        return Wiktionary.find({}, {
            transform: function(entry) {
                return new Domain(entry, Session.get('suffix'));
            }
        });
    }
});

Template.body.events({
    'keyup #word': function(e, t) {
        Session.set('word', e.target.value);
    },
    'core-select #suffix': function(e, t) {
        Session.set('suffix', e.originalEvent.detail.item.label);
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
    
    Meteor.subscribe('wiktionary-namecheap',
        Session.get('word'),
        Session.get('suffix'),
        Session.get('definition'),
        20);
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
