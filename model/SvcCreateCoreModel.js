/**
 * This class holds all server related interactions methods.
 *
 * @class StepTableFormatter Marks the function as a constructor (defining a class).
 * @public
 * @author Siva prasad Paruchuri
 * @since 18 November 2016
 * @extends sap.ui.model.json.JSONModel
 * @name serviceCaseCreation.model.SvcCreateModelObjects
 */
/** ----------------------------------------------------------------------------------  *
* Modifications.                                                                       *
* -------------                                                                        *
* Ver.No    Date        Author  	  PCR No.           Description of change          *
* ------ ---------- ------------ ----------  ----------------------------------------- *
* V00    13/10/2016   Siva Prasad
* 					Prachuri/Alok 		PCR012146				initial version
*                     (X087050)                                                        *
*                                                                                      *
* V01   28/09/2017    X087924           PCR015574    	CR 56 and CR 181 changes. Cross App
* 											        	Navigation; Setting user agent;
* V02   08/11/2017    X087924    		PCRXXXXXX    	Timeout Error Handling
************************************************************************************
 ************************************************************************
 *  Date        Author    PCR No.          Description of change        *
 ************ ********  **********  *************************************
 * 09/22/2020  X0108356  PCR031702   Ibase Implementation               *
 * 05/27/2021  X089025   PCR035464   Upgrade issue resolution           *
 ************************************************************************/
jQuery.sap.declare("serviceCaseCreation.model.SvcCreateCoreModel");
jQuery.sap.require("serviceCaseCreation.util.ServiceConfigConstants");
jQuery.sap.require("serviceCaseCreation.util.EventTriggers");
jQuery.sap.require("serviceCaseCreation.model.ResponseHandler");
jQuery.sap.require("sap.m.MessageBox");

sap.ui.model.json.JSONModel.extend("serviceCaseCreation.model.SvcCreateCoreModel", {

	oServiceCasesModel : null,
	isBusyActivityIndicator : false,

	/**
	 * This method is the base constructor for the model class.
	 * @name constructor
	 * @param oController - Current event parameter
	 * @returns
	 */

	constructor : function(oController) {

		sap.ui.model.json.JSONModel.prototype.constructor.apply(this, arguments);
		this.iBaseUrl = oController.getComponent().getModel("IBaseModel").getData().iBaseUrl; //IBase PCR031702++ changes

		this.initserviceCaseCreationGlobalModel();
		this.aAttachedEvents = [];
		that = this;
		
	},

	/**
	 * This method is the base constructor for the model class.
	 * @name initSvcCreateModelObjectsGlobalModel
	 * @param
	 * @returns
	 */

	initserviceCaseCreationGlobalModel : function() {
		//Begin of IBase PCR031702++	
        if(this.iBaseUrl){
        	this.oGetServiceCaseInfoURL = serviceCaseCreation.util.ServiceConfigConstants.getIBaseInfoURL;
        } else{
        //End of IBase PCR031702++	

        	this.oGetServiceCaseInfoURL = serviceCaseCreation.util.ServiceConfigConstants.getServiceCasesInfoURL;
        }//PCR031702++
        //V01++
		var oConfig = {
		        json: true,
		        loadMetadataAsync : true,
		        defaultCountMode: "None",
		        useBatch: true,
		        headers: {
			        'User-Agent': navigator.userAgent,
			        "X-Requested-With" : "XMLHttpRequest",
					"Content-Type" : "application/json",
			    }
		    };
		this.oDataModel = new sap.ui.model.odata.ODataModel(this.oGetServiceCaseInfoURL, oConfig);//V01++
		/* V01--
		this.oDataModel = new sap.ui.model.odata.ODataModel(this.oGetServiceCaseInfoURL, true);
		this.oDataModel.setDefaultCountMode(sap.ui.model.odata.CountMode.None);
		this.oDataModel.setUseBatch(true);*/
		this.oBatchOperations=[];
		this.oBatchResultHandlers=[];
		that = this;

	},

	/**
	 * This method is the base constructor for the model class.
	 * @name attachserviceCaseCreationEventWithEventName
	 * @param eventName - Holds current event name needs to be attached
	 * @param fnCallback - Function to be called on
	 * @param oListener - Listener to be notified/ triggered on successful completion of the specified event
	 * @returns
	 */

	attachserviceCaseCreationEventWithEventName : function(eventName, fnCallback, oListener) {

		this.aAttachedEvents.push(eventName);
		this.attachEvent(eventName,fnCallback,oListener);
		that.oListener = oListener;

	},

	/**
	 * This method is the base constructor for the model class.
	 * @name fireserviceCaseCreationEventWithEventName
	 * @param eventName {string} - Holds current event name needs to be attached
	 * @returns
	 */

	fireserviceCaseCreationEventWithEventName : function(eventName) {

		var fireEventSuccesCallBackFn ;
		if(this.oBatchOperations.length > 0) {

			if(eventName.split("_").indexOf("READ") < 0) {
				this.oDataModel.addBatchChangeOperations(this.oBatchOperations);
				fireEventSuccesCallBackFn = this.handleChangeBatchResponseSuccess;
			
			}
			else {
				this.oDataModel.addBatchReadOperations(this.oBatchOperations);
				fireEventSuccesCallBackFn = this.handleReadBatchResponseSuccess;
				
			}

			this.oDataModel.submitBatch(fireEventSuccesCallBackFn, this.handleBatchResponseError, true);

		}

	},

	/**
	 * This method purpose is to add each service case related operation(read/change) to Batch requests for mass processing
	 * @name addBatchOperation
	 * @param sPath - Entity set path for the specified request
	 * @param requestType - Type of the request
	 * @param postRequestBody - POST Body for post request and will be empty for a GET request
	 * @param successHandler - Success handler to be called on Successful completion of the request
	 * @param errorHandler - Error handler to be called on failure of the request
	 * @returns
	 */

	addBatchOperation:function(sPath, requestType, postRequestBody, successHandler, errorHandler){

		var oBatchOperation;
		var globalModel;
		var batchResponseHandler = {
				fnHandler:successHandler,
				erHandler:errorHandler,
				path:sPath
		};

		if(requestType=="GET") {//For read operations

			//oBatchOperation = this.oDataModel.createBatchOperation(sPath, requestType);                                                                                             //PCR035464--
			oBatchOperation = this.oDataModel.createBatchOperation(Array.isArray(sPath) ? sPath[0] : sPath, requestType);                                                             //PCR035464++; Defect# 67 condition modified.
		} else if(requestType=="POST") { //For change sets

			oBatchOperation = this.oDataModel.createBatchOperation(sPath, requestType, postRequestBody);
		}

		this.oBatchOperations.push(oBatchOperation);
		this.oBatchResultHandlers.push(batchResponseHandler);

	},

	/**
	 * This method purpose is to handle success response for batch read request
	 * @name handleReadBatchResponseSuccess
	 * @param batchResponseData - batch response data object
	 * @returns
	 */

	handleReadBatchResponseSuccess : function(batchResponseData) {

		var aBatchResponses = batchResponseData.__batchResponses;
		sEvent = that.aAttachedEvents[0];
		this.oBatchOperations=[];
		this.oBatchResultHandlers=[];

		for (var i = 0; i < aBatchResponses.length; i++) {

			var oBatchResponse = aBatchResponses[i];					
			this.oBatchOperations=[];
			this.oBatchResultHandlers=[];
			if(oBatchResponse.statusCode == "200")  {

				var responseStr = batchResponseData.__batchResponses[i].body;
				var responseObj = JSON.parse(responseStr);

				serviceCaseCreation.model.ResponseHandler.handleSuccessResponse(responseObj, sEvent, i);

				that.fireEvent(sEvent);

			}
			//else if(oBatchResponse.response.statusCode >= "400" ){ //v02--
			else if(oBatchResponse.response.statusCode >= "400" && oBatchResponse.response.statusCode <= "500") { //v02++
		     	var oErrorBody = JSON.parse(oBatchResponse.response.body); //v02++
		     	var sErrorMessageValue = oErrorBody.error.message.value; //v02++
			    var sErrorMessage = oBatchResponse.message+"\n"+sErrorMessageValue; //v02++
				responseObj = {d:{ErrorMessage:sErrorMessage}}; //v02++
				//responseObj={ d: {ErrorMessage : oBatchResponse.message}}; //v02--
				that.fireEvent(that.aAttachedEvents[1], responseObj);
			}

		}

	},
	
	/******************Success handler for Service Case batch response success*********************************/
	/**
	 * This method purpose is to handle success response for batch change request
	 * @name handleReadBatchResponseSuccess
	 * @param batchResponseData - batch response data object
	 * @returns
	 */

	handleChangeBatchResponseSuccess:function(batchResponseData) {

		var aBatchResponses = batchResponseData.__batchResponses;
		this.oBatchOperations=[];
		this.oBatchResultHandlers=[];

		for (var i = 0; i < aBatchResponses.length; i++) {

			var oBatchResponse = aBatchResponses[i];
			var bSuccess = false;
			var oServiceCaseStatus = {};
			if (oBatchResponse.hasOwnProperty("__changeResponses")) {
				var oChangeResponse = oBatchResponse.__changeResponses[0];
				if (oChangeResponse.statusCode >= "200" && oChangeResponse.statusCode < "300")
					bSuccess = true;

				if (bSuccess) {

					var oBatchResponse = aBatchResponses[i];					
					this.oBatchOperations=[];
					this.oBatchResultHandlers=[];
					if(oChangeResponse.statusCode == "201"){

						var responseStr = oChangeResponse.body,
						responseObj = JSON.parse(responseStr);

						(responseObj.d.ErrorMessage) ? that.fireEvent(that.aAttachedEvents[1], responseObj)
								: that.fireEvent(that.aAttachedEvents[0], responseObj);

					}
				}
			}
			//else if(oBatchResponse.response.statusCode >= "400" ) { //v02--
			else if(oBatchResponse.response.statusCode >= "400" && oBatchResponse.response.statusCode <= "500") {
					var oErrorBody=JSON.parse(oBatchResponse.response.body);
					var sErrorMessageValue=oErrorBody.error.message.value;
					var sErrorMessage=oBatchResponse.message+"\n"+sErrorMessageValue;
					responseObj={d:{ErrorMessage:sErrorMessage}};
					that.fireEvent(that.aAttachedEvents[1], responseObj)
			}

		}
	},
	
	/**
 	 * This method purpose is to handle error response for batch read request
 	 * @name handleBatchResponseError
 	 * @param error response data object
 	 * @returns
 	 */

	handleBatchResponseError:function(error) {

		var sErrorMessage,oErrorBody,sErrorMessageValue;
        if(error.response) {
              if(error.response.body) {
                     if(error.response.body.substring(0,1) == "<" || error.response.statusCode == "500"){
                            oErrorBody= error.response.body;
                            if(typeof(oErrorBody) === "string") { //V02++
    							sErrorMessage = oErrorBody; //V02++
    						} else { //V02++
    							if($(oErrorBody).find("message").text())
    								sErrorMessage = error.message+"\n"+error.response.statusText;
    							else  //V02++
    								sErrorMessage = error.message;
    						} //V02++
                     } else {
                            oErrorBody=JSON.parse(error.response.body);
                            sErrorMessageValue=oErrorBody.error.message.value;
                            sErrorMessage=error.message+"\n"+sErrorMessageValue;
                     }
              } else
                   sErrorMessage=error.message+"\n"+"A technical error has occurred. Please try again";
        } else
              sErrorMessage=error.name+"\n"+error.message;

        var responseObj={ d: {ErrorMessage : sErrorMessage}};
        that.fireEvent(that.aAttachedEvents[1], responseObj);
        /*setTimeout(function(){
        	that.fireEvent(that.aAttachedEvents[1], responseObj); }, 3000);*/ //V02--
        		
	},

});