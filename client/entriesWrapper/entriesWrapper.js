Template.entriesWrapper.helpers({
    entries: function() {
        return Wiktionary.find();
    },
    showMoreSpinner: function() {
        return Session.get('loading');
    },
    loading: function() {
        return Session.get('loading');
    },
    showResults: function() {
        return Session.get('definition');
    },
    showHelp: function() {
        return Session.get('showHelp');
    },
    resultsExist: function(entries) {
        return entries.count();
    },
    showNoResults: function(entries) {
        return !entries.count() && !Session.get('showHelp');
    }
});

Template.entriesWrapper.events({
    'click .more-buttom': function(e, t) {
        Session.set('limit', Session.get('limit') + 20);
    }
});