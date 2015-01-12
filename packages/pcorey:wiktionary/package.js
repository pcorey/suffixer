Npm.depends({
    'tsv': '0.2.0',
    'wtf_wikipedia': '0.1.1'
});

Package.describe({
  name: 'pcorey:wiktionary',
  summary: ' /* Fill me in! */ ',
  version: '1.0.0',
  git: ' /* Fill me in! */ '
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.2.1');
  api.use('mongo', ['client', 'server']);
  api.use('pcorey:namecheap-tlds');
  api.addFiles('pcorey:wiktionary.js');
  api.addFiles('enwikt-defs-20140609-en.tsv', 'server', {isAsset: true});
  api.export('Wiktionary', ['client', 'server']);
});