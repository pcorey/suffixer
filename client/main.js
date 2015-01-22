Session.set('suffix', '');
Session.set('word', '');
Session.set('definition', '');
Session.set('limit', 20);
Session.set('loading', false);
Session.set('showHelp', true);

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
        function() {
            Session.set('loading', false);
        });
});

Meteor.startup(function() {
    GAnalytics.pageview('/');
});

Meteor.subscribe('tlds');

//TODO: Move to full text seach mongo instance:
//http://www.meteorpedia.com/read/Fulltext_search
