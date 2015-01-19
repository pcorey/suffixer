Template.entry.helpers({
    checking: function() {
        console.log(this.status);
        return this.status;
    },
    buildURL: function(word) {
        return buildDomain(this.word, Session.get('suffix'));
    },
    showSpinner: function() {
        return !this.last_checked || this.available === undefined;
    },
    showAvailable: function() {
        return this.available === true;
    },
    showUnavailable: function() {
        return this.available === false;
    },
    highlight: function (definition, word) {
        return Spacebars.SafeString(definition.replace(new RegExp('('+Session.get('definition')+')', 'gi'), '<em>$1</em>'));
    },
    affiliateId: function() {
        return Meteor.settings.public.namecheap.affiliate_id;
    }
});