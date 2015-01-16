Template.header.events({
    'click .info': function() {
        Session.set('showHelp', !Session.get('showHelp'));
    }
})