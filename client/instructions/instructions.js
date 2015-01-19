Template.instructions.events({
    'click .close': function() {
        Session.set('showHelp', false);
    }
});

Template.instructions.helpers({
    showX: function() {
        return Session.get('definition');
    },
    affiliateId: function() {
        return Meteor.settings.public.namecheap.affiliate_id;
    }
})