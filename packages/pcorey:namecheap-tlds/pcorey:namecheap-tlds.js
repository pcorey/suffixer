NamecheapTLDs = new Meteor.Collection('namecheap_tlds');

if (Meteor.isServer) {
    Meteor.publish('namecheap_tlds', function() {
        return NamecheapTLDs.find();
    });

    Meteor.startup(function() {

        if (!process.env.RESET_NAMECHEAP_TLDS &&
            NamecheapTLDs.find().count() > 0 &&
            Namecheap) {
            return;
        }

        NamecheapTLDs.remove({});

        console.log('Fetching TLDs from Namecheap...');
        var list = Async.wrap(Namecheap.domains.getTldList)();

        console.log('Building TLD collection...');
        _.each(list.Tlds.Tld, function(tld) {
            NamecheapTLDs.insert({
                name: tld.Name
            });
        });

    });
}

if (Meteor.isClient) {
    Meteor.subscribe('namecheap_tlds');
}