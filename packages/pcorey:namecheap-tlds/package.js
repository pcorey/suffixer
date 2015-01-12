Package.describe({
    name: 'pcorey:namecheap-tlds',
    summary: 'Builds a Mongo collection of all Namecheap TLDs',
    version: '1.0.0',
    git: ' /* Fill me in! */ '
});

Package.onUse(function(api) {
    api.versionsFrom('1.0.2.1');
    api.use('pcorey:namecheap');
    api.use('mongo', ['client', 'server']);
    api.addFiles('pcorey:namecheap-tlds.js');
    api.export('NamecheapTLDs', ['client', 'server']);
});