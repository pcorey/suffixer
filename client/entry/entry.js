Template.entry.helpers({
    checking: function() {
        console.log(this.status);
        return this.status;
    },
    buildURL: function(word) {
        return buildDomain(this.word, Session.get('suffix'));
    },
    showSpinner: function() {
        console.log('in showSpinner ',this, !this.last_checked || this.available === undefined);
        return !this.last_checked || this.available === undefined;
    },
    showAvailable: function() {
        return this.available === true;
    },
    showUnavailable: function() {
        return this.available === false;
    }

});