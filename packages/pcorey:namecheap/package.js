Npm.depends({
    'namecheap': 'https://github.com/pcorey/node-namecheap/tarball/1b82106caa15377c872a9fc4d0a3a900a6aa4468'
});

Package.describe({
    name: 'pcorey:namecheap',
    summary: 'Wrapper around a modified version of Chad Smith\'s Namecheap API wrapper',
    version: '1.0.0',
    git: ' /* Fill me in! */ '
});

Package.onUse(function(api) {
    api.versionsFrom('1.0.2.1');
    api.addFiles('pcorey:namecheap.js');
    api.use('mongo', ['client', 'server']);
    api.export('Namecheap', ['server']);
});
