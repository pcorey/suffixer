Template.controls.rendered = function() {
    console.log('in rendered');
    $('#show-registered').bootstrapSwitch();
    $('#suffix').select2();
};

Template.controls.helpers({
    tlds: function() {
        return NamecheapTLDs.find({});
    }
})