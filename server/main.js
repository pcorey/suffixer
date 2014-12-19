Meteor.methods({
    testy: function() {
        console.log('In testy');
        //return Dictionary.find({word: {$regex: 'io$', $options: 'i'}});
        return 1337;
    }
});