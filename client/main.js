Session.set('suffix', '');
Session.set('word', '');
Session.set('definition', '');
Session.set('limit', 20);
Session.set('loading', false);
Session.set('showHelp', true);
Session.set('favorites', []);

Meteor.autorun(function() {
    var regex = Session.get('word')
        ? ('.*?'+Session.get('word')+'.*?'+Session.get('suffix')+'$')
        : (Session.get('suffix')+'$');
    var definitionRegex = Session.get('definition')
        ? ('.*?'+Session.get('definition')+'.*?')
        : '';
    Session.set('loading', true);

    Meteor.subscribe('wiktionary-namecheap',
        Session.get('word'),
        Session.get('suffix'),
        Session.get('definition'),
        Session.get('limit'),
        Session.get('hideRegistered'),
        Session.get('favorites'),
        function() {
            Session.set('loading', false);
        });
});

function processQuery() {
    var hash = window.location.hash.substring(1);
    var ids = hash.split(',').filter(function(id) {
        return !!id;
    });
    Session.set('favorites', ids);
    if (ids.length) {
        Session.set('showHelp', false);

    }
    Meteor.autorun(function() {
        window.location.hash = '#'+Session.get('favorites').join(',');
    });
}

Meteor.autorun(function() {
    Session.set('showHelp', !Session.get('definition') && !Session.get('favorites').length);
});

Meteor.startup(function() {
    GAnalytics.pageview('/');
    processQuery();
});

Meteor.subscribe('tlds');

//TODO: Move to full text seach mongo instance:
//http://www.meteorpedia.com/read/Fulltext_search
