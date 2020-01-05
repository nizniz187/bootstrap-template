/*============================== ajax.js ===============================*\
    This file is used to send ajax request with jquery ajax method, and control the display of loading spinner.
    To run the code correctly, the following js libraries are required:
        1. jQuery 2.x
        2. spin.js
	---
	Version: 2.0.0
	---
	^TOC
	1. Ajax Object & Default Static Functions
	2. LoadingHandler
\*==================================================================*/

/* ============================================================
    ^Ajax: (Object) wrap jquery ajax function and customize handlers
 ============================================================ */
Ajax = {
	/* --------------------------------------------------------------------------------------------------
		^ajaxRequest: (function) invoke jquery ajax by settings
		---
		url*: [String] url
		data: [Object|String|Array] Data to be sent to the server
		successHandler: [Function] A function to be called if the request succeeds
		errorHandler: [Function] A function to be called if the request fails
			- (default: Ajax.errorHandler)
		method: [String] The HTTP method to use for the request
			- (default: "post")
		loadingOptions: [Object] options for creating LoadingHandler
			- spinnerCtnId: [String] id of spinner container
			- autoHide: [Boolean/String]
				- true: hide spinner on success & error
				- "success": hide spinner only on success
				- "error": hide spinner only on error
				- false: no auto hiding
	-------------------------------------------------------------------------------------------------- */
	sendRequest: function(url, data, successHandler, errorHandler, method, loadingOptions) {
		var loadingHandler = (loadingOptions && loadingOptions.spinnerCtnId) ? new this.LoadingHandler(loadingOptions) : null;
		$.ajax({
			cache: false, url: url, data: data, dataType: "json", method: method ? method : "post",
			beforeSend: function () { if (loadingHandler) { loadingHandler.showSpinner(); } },
			success: successHandler,
			error: errorHandler ? errorHandler : this.errorHandler,
			complete: function (jqXHR, textStatus) {
				if (!loadingHandler) { return; }

				/* auto hide spinner */
				if(loadingHandler.autoHide == true || loadingHandler.autoHide == textStatus || textStatus != "success") {
					loadingHandler.hideSpinner();
				}
			}
		});
	},
	/* --------------------------------------------------------------------------------------------------
		^errorHandler: (function) default error handler
		---
		jqXHR*: [Object] jquery ajax jqXHR object
	-------------------------------------------------------------------------------------------------- */
	errorHandler: function (jqXHR) { console.log(jqXHR); }
};

/* ============================================================
    ^LoadingHandler: (constructor) Manage loading spinner and its actions
    --
    options: [Object] see detail above on Ajax.sendRequest
 ============================================================ */
Ajax.LoadingHandler = function (options) {
    this.$spinnerCtn = $("#" + options.spinnerCtnId);
    this.hasMask = options.spinnerCtnId == "mask";
    this.autoHide = options.autoHide == undefined ? true : options.autoHide;
}
Ajax.LoadingHandler.prototype = {
	constructor: Ajax.LoadingHandler,
	/* --------------------------------------------------------------------------------------------------
		^showSpinner: (function) show spinner
	-------------------------------------------------------------------------------------------------- */
    showSpinner: function () {
        if (this.hasMask) { this.$spinnerCtn.show(); }

        if (this.spinner) {
            this.spinner.spin(this.$spinnerCtn);
        } else {
            this.spinner = new Spinner( { lines: 12, width: 4, color: "#009e96", scale: 3 } ).spin(this.$spinnerCtn[0]);
        }
    },
	/* --------------------------------------------------------------------------------------------------
		^hideSpinner: (function) hide spinner
	-------------------------------------------------------------------------------------------------- */
    hideSpinner: function () {
        if (this.hasMask) { this.$spinnerCtn.hide(); }
        this.spinner.stop();
    }
};