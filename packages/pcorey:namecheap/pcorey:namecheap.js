if (Meteor.isServer) {
    console.log('Instantiating Namecheap with: ', Meteor.settings.namecheap.username,
                                                  Meteor.settings.namecheap.api_key,
                                                  Meteor.settings.namecheap.client_ip,
                                                  Meteor.settings.namecheap.sandbox);

    namecheap = Npm.require('namecheap');
    Namecheap = new namecheap(Meteor.settings.namecheap.username,
                              Meteor.settings.namecheap.api_key,
                              Meteor.settings.namecheap.client_ip,
                              Meteor.settings.namecheap.sandbox);
}