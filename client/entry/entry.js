Template.entry.helpers({
    checking: function() {
        console.log(this.status);
        return this.status;
    },
    buildURL: function(word) {
        return buildDomain(this.word, Session.get('suffix'));
    }
});