Template.entriesWrapper.helpers({
    entries: function() {
        var favorites = Session.get('favorites');
        return Wiktionary.find({}, {
            transform: function(doc) {
                var idx = favorites.indexOf(doc._id);
                doc.favorite = idx == -1 ? Number.MAX_SAFE_INTEGER  : idx;
                return doc;
            }
        }).fetch().sort(function(a, b) {
            return a.favorite - b.favorite;
        });
    },
    showMoreSpinner: function() {
        return Session.get('loading');
    },
    loading: function() {
        return Session.get('loading');
    },
    showResults: function() {
        return Session.get('definition') || Session.get('favorites').length;
    },
    showHelp: function() {
        return Session.get('showHelp');
    },
    resultsExist: function(entries) {
        return entries.length;
    },
    showNoResults: function(entries) {
        return !entries.length && !Session.get('showHelp') && !Session.get('loading');
    }
});

Template.entriesWrapper.events({
    'click .more-buttom': function(e, t) {
        Session.set('limit', Session.get('limit') + 20);
    }
});