
(function ( $ ) {

	var recursiveCallResults	= [];
	var asyncLoopResults		= [];

	$.RecursiveCall = function ( functionName, Data) {
		var def = new $.Deferred();

		//Reset the global results var.
		recursiveCallResults = [];

		//Start calling the recursive function
		_recursive(functionName, Data)
			.always(function (recursiveResults) { //here recursiveResults === recursiveCallResults ...
				def.resolve(recursiveResults); //Recursive call ended. Return the result to the user.
			});

		return def.promise();
	};
	

	$.AsyncLoop = function ( functionName ) {
		var def = new $.Deferred();

		asyncLoopResults = [];

		_loop(functionName)
			.always(function (loopResults) { //here loopResults === results
				def.resolve(loopResults); //Something went wrong. The Loop is ended. Return the result to the user.
			});

		return def.promise(); 
	};

	// -- -- -- -- -- -- -- -- -- Inner functions. This two function do all the "dirty" work. -- -- -- -- -- -- -- -- --

	//Used by the RecursiveCall method.
	function _recursive(_function, _dataList) {

		var def = new $.Deferred();

		if (_dataList.length > 0) { //If the are still data. (This function call everytime itself. So, for the last call there will be no available data.)
			var parameter = _dataList.splice(0,1);

			_function.apply(this, parameter[0])
				.done(function(_callRes) {
					//Called the function. Store the result..
					recursiveCallResults.push(_callRes);
					//.. and call itself again.
					_recursive(_function, _dataList)
						.done(function(_callRes) { // _callRes here is never used.
							// now we are in the inner cycle. this "resolve" will call again the "done" callback.
							def.resolve(recursiveCallResults);
					
						})
						.fail(function(recursiveCallResults) {
							//Failed. Reject the promise.
							def.reject(recursiveCallResults);
					
						});
				})
				.fail(function (_callRes) {
					
					recursiveCallResults.push(_callRes);
					
					def.reject(recursiveCallResults);
				});

		} else { // If there is no available data, resolve and end the recusion.
			setTimeout(function() { //give the time to "promise" and after 1 millisend resolve. (This is the correct way..)
				def.resolve(recursiveCallResults);
			}, 1);
		}

		return def.promise();
 

	};


	
	//This is almost the same of "_recursive", the only differences are that this
	//cycle will continue until the custom function provided by the user will return 
	//a "reject", so until here the "fail" callback is not fired.

	function _loop(_function) {

		var def = new $.Deferred();

		_function.apply(this, [])
			.done(function(result) {

				asyncLoopResults.push(result);

				_loop(_function)
					.done(function(result) {
						def.resolve(asyncLoopResults);
					})
					.fail(function(result) {
						def.reject(asyncLoopResults);
					});
			})
			.fail(function (result) {

				asyncLoopResults.push(result);
				
				def.reject(asyncLoopResults);
			});

		return def.promise();
	};



}( jQuery ));