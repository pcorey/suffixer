TLDs = new Meteor.Collection('tlds');

Meteor.methods({
    getTLDs: function() {
        console.log('in getTLDs', namecheap);
        return Async.wrap(namecheap.domains.getTldList)();
    }
});