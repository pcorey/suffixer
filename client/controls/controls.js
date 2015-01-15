Template.controls.events({
    'change #suffix': function(e, t) {
        Session.set('limit', 20);
        Session.set('suffix', e.currentTarget.value);
    },
    'keyup #definition': function(e, t) {
        Session.set('limit', 20);
        Session.set('definition', e.target.value);
    }
});

Template.controls.helpers({
    tlds: function() {
        return NamecheapTLDs.find({});
    }
});