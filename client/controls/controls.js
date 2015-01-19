Template.controls.events({
    'change #suffix': function(e, t) {
        Session.set('limit', 20);
        Session.set('suffix', e.currentTarget.value);
    },
    'keyup #definition': function(e, t) {
        Session.set('limit', 20);
        Session.set('definition', e.target.value);
        Session.set('showHelp', !e.target.value);
    },
    'change #hide-registered': function(e, t) {
        Session.set('hideRegistered', !Session.get('hideRegistered'));
    }
});

Template.controls.helpers({
    tlds: function() {
        return NamecheapTLDs.find({});
    },
    showRegistered: function() {
        return Session.get('hideRegistered');
    },
    loading: function() {
        return Session.get('loading');
    }
});