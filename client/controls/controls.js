Template.controls.events({
    'change #suffix': function(e, t) {
        Session.set('limit', 20);
        Session.set('suffix', e.currentTarget.value);
        GAnalytics.event('controls', 'suffix', e.currentTarget.value);
    },
    'keyup #definition': _.debounce(function(e, t) {
        Session.set('limit', 20);
        Session.set('definition', e.target.value);
        GAnalytics.event('controls', 'definition', e.target.value);
    }, 300),
    'change #hide-registered': function(e, t) {
        Session.set('hideRegistered', !Session.get('hideRegistered'));
        GAnalytics.event('controls', 'hide-registered', Session.get('hideRegistered'));
    }
});

Template.controls.helpers({
    tlds: function() {
        return NamecheapTLDs.find({}, {sort: {name: 1}});
    },
    showRegistered: function() {
        return Session.get('hideRegistered');
    },
    loading: function() {
        return Session.get('loading');
    }
});