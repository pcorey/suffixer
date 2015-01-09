Domain = function(entry, suffix) {
    this.word = entry.word;
    this.definition = entry.definition;
    this.tld = suffix;
    this.test = '1337test!';
};

Domain.prototype.formatDomain = function() {
    console.log('in formatDomain');
    var lower = this.word.toLowerCase();
    var tld = this.tld.toLowerCase();
    var tldIdx = lower.lastIndexOf(tld);
    var stripped = lower.substring(0, tldIdx).replace(/[^a-zA-Z0-9-]|^-+|-+$/g, '');
    var domain = stripped + '.' + tld;
    return domain;
};