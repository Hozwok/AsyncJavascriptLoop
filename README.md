AsyncJavascriptLoop
===================

A simple solution to perform recursive asynchronous calls and loops javascript turned into a simple to use jquery plugin.

This can be used with everything, because will be the user to supply a valid function to execute, so there is no limit in how many asynchronous situation this can be used.


###Usage

When you use this plugin, the first parameter (for both the recursive call and the async loop) is a function (or a reference of it) that use the `Deferred` jQuery object.
So you will need to instance a new deferred object `var myDeferred = new $.Deferred()`, return its promise `return myDeferred.promise()` and, when your function has ended, resolve it or reject it with `myDeferred.resolve()` or `myDeferred.reject()`

As second parameter, in the `RecursiveCall` method, you can pass the parameter with which your function will be called, as an array of array.

###Example

```javascript
//A recursive async call to sum number
$.RecursiveCall(function(_firstNumber, _secondNumber) {
		var def = new $.Deferred(); // (1) Instance new Deferred object-

		//Simulate the async with a timeout.
		setTimeout(function() {

			var res = _firstNumber + _secondNumber;
			def.resolve(res); // (3) Resolve it when your function ended. Here you can return a result.

		}, 500);

		return def.promise(); // (2) Return its promise 
		}, 

		[[5,10],[3,7],[12,2]]) //You here can pass many parameter as you need
	.always(function (results) { //The callback function (to call when your function ended and you have all results)
		console.log("The sum results is (in order): ", results)
	});

```

###Note

I've not tried, owever, if it goes in a Stack Overflow Exception with too many data (not with Chrome, I hope)..

Feel free to modify as you need ;)
