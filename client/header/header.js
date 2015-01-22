Template.header.events({
    'click .info': function() {
        Session.set('showHelp', true);
        GAnalytics.event('help', 'show');
    }
})