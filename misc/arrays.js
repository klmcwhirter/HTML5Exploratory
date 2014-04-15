var test = function(name, arr) {
    console.log(name);
    console.log('length: ' + arr.length);
    console.log('is_array: ' + Array.isArray(arr));
    console.log('typeof: ' + typeof arr);
    console.log('constructor === Array: ' + (arr.constructor === Array));
    console.log('Object.toString: ' + Object.prototype.toString.apply(arr));
    console.log(arr);
    console.log();
};

var numbers = [ 'zero', 'one', 'two', 'three', 'four', 'five' ];
test('numbers', numbers);

var numbers_object = (function () {
    var set_members = function(that, members) {
        for(var member in members) {
            that.push(members[member]);
            //that[member] = members[member];
        }
    };
    var F = function() {};
    F.prototype = Array.prototype;
    var that = new F();
    set_members(that, {'0': 'zero', '1': 'one', '2': 'two', '3': 'three', '4': 'four', '5': 'five'});
    //console.log('0: ' + that['0']);
    return that;
}());

test('numbers_object', numbers_object);
