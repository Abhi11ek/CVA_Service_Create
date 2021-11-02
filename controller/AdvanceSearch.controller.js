/**
 * This class holds the functions of Advance Search feature.
 *
 * @class 
 * @public
 * @author Siva Prasad Prachuri
 * @since 13 November 2016
 * @extends serviceCaseCreation.controller.BaseController
 * @name serviceCaseCreation.controller.AdvanceSearch
 * *  
* ------------------------------------------------------------------------------------ *
* Modifications.                                                                       *
* -------------                                                                        *
* Ver.No    Date        Author    PCR No.           Description of change              *
* ------ ---------- ------------ ----------  ----------------------------------------- *
* V00    13/10/2016   Siva Prasad 
* 					 Prachuri/Alok 	PCR012146		initial version
*                     (X087050)                                                        *
*                                                                                      *
* V01   28/06/2017    X087927    PCR014777    		To remove date range for* 
* 													for Advance Search                 *
* 
************************************************************************************/
 

sap.ui.define(['jquery.sap.global', 'sap/m/MessageToast', 'serviceCaseCreation/controller/BaseController',
               'sap/ui/core/Control', 'sap/ui/core/format/DateFormat'], function(jQuery, MessageToast, Controller, Control, DateFormat) {

	var advanceSearchController = Controller.extend("serviceCaseCreation.controller.AdvanceSearch", {

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf view.AdvanceSearch
		 */

		onInit : function() {
			
			this._aAdvSearchFields = [
				serviceCaseCreation.Ids.TOOL_NUMBER_INPUT,
                serviceCaseCreation.Ids.SERIAL_NUMBER_INPUT,
                serviceCaseCreation.Ids.SERVICE_CASE_NUMBER_INPUT,
                serviceCaseCreation.Ids.EMPOLYEE_ID_INPUT,
                serviceCaseCreation.Ids.OPPORTUNITY_NUMER_INPUT,
                serviceCaseCreation.Ids.LEGACY_NUMBER_INPUT ];

			this.resourceBundle=this.getComponent().getModel("i18n").getResourceBundle();
			sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(this._onAttachRouteMatched, this);
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * This method will help to navigate back to master view (Dashboard).
		 * @name onNavBack
		 * @param 
		 * @returns 
		 */

		onNavBack : function() {

			history.go(-1);
		},

		/**
		 * This method is to open dialog fragment to searching assigned person .
		 * @name assignedPerson
		 * @param 
		 * @returns 
		 */

		assignedPerson : function() {

			serviceCaseCreation.fragmentHelper.createDialogFragment(this.getCurrentView().getId(), this, "serviceCaseCreation.view.fragments.AssignedTo").open();
		},

		/**
		 * This method is to close dialog fragment to searching assigned person .
		 * @name onCancelAssignedTo
		 * @param 
		 * @returns 
		 */

		onCancelAssignedTo : function() {

			this.destroyDialog();
		},

		/**
		 * This method is to close dialog fragment to searching assigned person .
		 * @name onAssignedToResultSelectionChange
		 * @param oEvent - Current event parameter
		 * @returns 
		 */

		onAssignedToResultSelectionChange : function(oEvent) { 

			var oSelectedItem = oEvent.getSource();
			var sPath = oSelectedItem.getSelectedItem().getBindingContext().getPath();
			this._oAssignedToSelectedItem = oSelectedItem.getModel().getProperty(sPath);
			var oUserListModel=sap.ui.getCore().getModel("ccUserHelpListModel");
			
		},

		/**
		 * This method is the method triggered when the user clicks 'OK' of the value help fragment 'Assigned To'   .
		 * @name onAssignedTo
		 * @param 
		 * @returns 
		 */

		onAssignedTo : function() {

			var oView = this.getView(),
			sUserId = oView.byId(serviceCaseCreation.Ids.USERID_INPUT).getValue(),
			sFirstName = oView.byId(serviceCaseCreation.Ids.FIRST_NAME_INPUT).getValue().trim().replace(/ /g, "%20"),
			sLastName = oView.byId(serviceCaseCreation.Ids.LAST_NAME_INPUT).getValue().trim().replace(/ /g, "%20");
			var sAsnMessageToast = this.resourceBundle.getText("AdvanceSearch.AsnMessageToast");
			if(sFirstName || sLastName || sUserId ) { 

				this.destroyDialog();
				var sBusyDialogMsg = this.resourceBundle.getText("AdvanceSearch.BusyDialogMsg");
				serviceCaseCreation.fragmentHelper.dialogFragmentContent(this, "", "", "", sBusyDialogMsg);

				this._busyDialog = serviceCaseCreation.fragmentHelper.createDialogFragment(this.getCurrentView().getId(), this, "serviceCaseCreation.view.fragments.BusyDialog");
				this._busyDialog.open(); 

				var aEntitySet = [serviceCaseCreation.util.ServiceConfigConstants.CaseCreationCEUserHelpSet+"?$filter=Firstname%20eq%20%27"+sFirstName+"%27%20and%20Lastname%20eq%20%27"+sLastName+"%27%20and%20Userid%20eq%20%27"+sUserId+"%27"];

				this.finishoDataModelregistartionProcessWithParams(serviceCaseCreation.util.EventTriggers.CASE_CREATION_USER_HELP_SUCCESS, 
						"handleCEinputSuccess",
						serviceCaseCreation.util.EventTriggers.CASE_CREATION_USER_HELP_FAIL,
						"handleCEinputFail",
						aEntitySet,
						serviceCaseCreation.util.ServiceConfigConstants.get,"","","", serviceCaseCreation.util.EventTriggers.TRIGGER_CASE_CREATION_USER_HELP_READ);

			} else 

				MessageToast.show( sAsnMessageToast);

		},

		/**
		 * This method is to select appropriate date range for Customer Tool ID/Serial Number/Created By.
		 * @name handleDateChange
		 * @param {Object} oEvent - Holds current event object
		 * @returns 
		 */
		/* Removing Date Validations 
		 * Start of V01-- */

	/*	handleDateChange : function(oEvent) {

			var sValueState,
			oView = this.getCurrentView(),
			sValue = oEvent.getParameter("value"),
			oDate =	oEvent.getSource().getDateValue();

			var rRegexForDtFormat = /^([012]?\d|3[01])-([Jj][Aa][Nn]|[Ff][Ee][bB]|[Mm][Aa][Rr]|[Aa][Pp][Rr]|[Mm][Aa][Yy]|[Jj][Uu][Nn]|[Jj][u]l|[aA][Uu][gG]|[Ss][eE][pP]|[oO][Cc]|[Nn][oO][Vv]|[Dd][Ee][Cc])-(19|20)\d\d$/;

			if(rRegexForDtFormat.test(sValue)){

				if(oEvent.getSource().data("startDate")) {

					this._fnHandleDateRange(oDate, serviceCaseCreation.Ids.END_DATE_DTPCKR, "startDate");

				} else if(oEvent.getSource().data("endDate")) {

					this._fnHandleDateRange(oDate, serviceCaseCreation.Ids.START_DATE_DTPCKR, "endDate");

				}

				sValueState = sap.ui.core.ValueState.None;

			} else {

				sValueState = sap.ui.core.ValueState.Error;
			}

			if(!sValue) {

				sValueState = sap.ui.core.ValueState.None;

				var aDatePickers = [serviceCaseCreation.Ids.START_DATE_DTPCKR, serviceCaseCreation.Ids.END_DATE_DTPCKR];

				for(var sID in aDatePickers){

					oView.byId(aDatePickers[sID]).setValue("");
					oView.byId(aDatePickers[sID]).setValueState(sValueState);
				}
			}

			oEvent.getSource().setValueState(sValueState);
			this._bValidDate = (oView.byId(serviceCaseCreation.Ids.START_DATE_DTPCKR).getValueState() === "None" && oView.byId(serviceCaseCreation.Ids.END_DATE_DTPCKR).getValueState() === "None") ? true : false;
		},*/

		/**
		 * This helps in choosing appropriate end date when start date is selected or vice versa.
		 * @name _fnHandleDateRange
		 * @param {String} mValue - start date value
		 * @param {String} mId - ID of a datepicker
		 * @returns 
		 */
		
		/*_fnHandleDateRange : function(mValue, mId, mDtPckr) {

			var dStartDate = new Date(mValue),
			dEndDate = new Date(mValue);

			switch(mDtPckr) {

			case "startDate": 

				dEndDate.setDate(dEndDate.getDate() + 15);
				this._dStartDate = serviceCaseCreation.formatter.formatter.dateFormatInPost(dStartDate);
				this._dEndDate = serviceCaseCreation.formatter.formatter.dateFormatInPost(dEndDate);
				break;

			case "endDate": 

				dEndDate.setDate(dEndDate.getDate() - 15);
				this._dStartDate = serviceCaseCreation.formatter.formatter.dateFormatInPost(dEndDate);
				this._dEndDate = serviceCaseCreation.formatter.formatter.dateFormatInPost(dStartDate);
				break;

			default :
				break;
			}

			this.getCurrentView().byId(mId).setDateValue(dEndDate);
			
			
			
		},*/
		
		/*---------------*/
		

		/**
		 * This method is success callback function of the service call when the user clicks 'OK' of the value help fragment 'Assigned To'   .
		 * @name handleCEinputSuccess
		 * @param 
		 * @returns 
		 */		

		handleCEinputSuccess: function() {

			this._busyDialog.destroy();

			var ceHelpModel=sap.ui.getCore().getModel("ccUserHelpListModel");

			if(ceHelpModel.getData().d.results.length) {

				this.assignedSearchResultdialog=serviceCaseCreation.fragmentHelper.createDialogFragment(this.getCurrentView().getId(), this, "serviceCaseCreation.view.fragments.AssignedSearchResult");
				this.assignedSearchResultdialog.setModel(ceHelpModel);
				this.assignedSearchResultdialog.open();
				if(ceHelpModel.getData().d.results.length===1){
					var oTable=this.getView().byId("assignedSearchResult")
					oTable.setSelectedItem(oTable.getItems()[0], true);
				}
			} else {

				var sMessageToast = this.resourceBundle.getText("AdvanceSearch.MessageToast");
				MessageToast.show(sMessageToast);
			}
		},

		/**
		 * This method is error callback function of the service call when the user clicks 'OK' of the value help fragment 'Assigned To'   .
		 * @name handleCEinputFail
		 * @param 
		 * @returns 
		 */

		handleCEinputFail: function(oData){

			this._busyDialog.destroy();
			var sFailureDialogMsg = this.resourceBundle.getText("AdvanceSearch.FailureDialogMsg");
			serviceCaseCreation.fragmentHelper.dialogFragmentContent(this, sFailureDialogMsg , serviceCaseCreation.StandardSAPIcons.ICON_SAP_MSG_ERROR, "#cc1919",
					oData.getParameter("d").ErrorMessage);
			serviceCaseCreation.fragmentHelper.createDialogFragment(this.getCurrentView().getId(), this, "serviceCaseCreation.view.fragments.InfoDialog").open();
		},

		/**
		 * This method is to select line item for assigning service case .
		 * @name onSelectAssignedName
		 * @param oEvent - Current Event Parameter
		 * @returns 
		 */

		onSelectAssignedName : function(oEvent){

			var oEmployeeId = this.getCurrentView().byId(serviceCaseCreation.Ids.EMPOLYEE_ID_INPUT);
			var oTable=this.getView().byId("assignedSearchResult");
			if(oTable.getSelectedItem()){
				var sFirstName=oTable.getSelectedItem().getBindingContext().getProperty("Firstname");
				var sLastName=oTable.getSelectedItem().getBindingContext().getProperty("Lastname");
				this._sUserID=oTable.getSelectedItem().getBindingContext().getProperty("Userid");

				oEmployeeId.setValue(sFirstName+" "+sLastName);
			}

			var sValueState = (oEmployeeId.getValue()) ? sap.ui.core.ValueState.None : sap.ui.core.ValueState.Error;
			oEmployeeId.setValueState(sValueState);

			this.assignedSearchResultdialog.destroy();	
		},

		/**
		 * This method is to close dialog fragment of searched result for assigned person .
		 * @name cancelAssignedResult
		 * @param 
		 * @returns 
		 */

		cancelAssignedResult:function(){

			this.assignedSearchResultdialog.destroy();
		},

		/**
		 * This method is to validate the enter Serive Case number is of typer number.
		 * @name handleNumberInputValue
		 * @param {Object} oEvent - event handler object
		 * @returns 
		 */
		handleNumberInputValue :  function(oEvent) {
			
			var rAlphabetRegex = /^[0-9*]*$/,
			oAdvanceSearchNumberElement = oEvent.oSource,
		    sNumber = oAdvanceSearchNumberElement.getValue();

			if(!rAlphabetRegex.test(sNumber.substr(-1)))
				oAdvanceSearchNumberElement.setValue(sNumber.replace(sNumber.substr(-1), ""));
			
			/*PCR012146. Opportunity No.
			Validations. V01--*/

			/*this.bSVCFlag = false;
			var oAdvanceSearchServiceCaseNumber = this.getCurrentView().byId(serviceCaseCreation.Ids.SERVICE_CASE_NUMBER_INPUT),
			sServiceCaseNumber = oAdvanceSearchServiceCaseNumber.getValue();
			var regularExpression= /^[0-9*]*$/;
			var valueState;

			if(!(regularExpression.test(sServiceCaseNumber))){

				valueState = (sServiceCaseNumber == "") ? sap.ui.core.ValueState.None : sap.ui.core.ValueState.Error;

			} else {

				valueState = sap.ui.core.ValueState.None;
				this.bSVCFlag = true;
			}

			oAdvanceSearchServiceCaseNumber.setValueState(valueState);*/
		},
		
		/**
		 * This method if for handling advance search in master view.
		 * @name onAdvanceSearch
		 * @param {Object} oEvent - Current event Parameter 
		 * @returns 
		 */

		onAdvanceSearch : function(oEvent) {
			
			var oInputs = new Object(),
			aInputData = [];
		
			for(var i=0; i<this._aAdvSearchFields.length; i++) {
				oInputs[this._aAdvSearchFields[i]] = this.getCurrentView().byId(this._aAdvSearchFields[i]).getValue().toUpperCase().trim().replace(/ /g, "");
				if(oInputs[this._aAdvSearchFields[i]])
					aInputData.push(oInputs[this._aAdvSearchFields[i]]);
			}
           
			if(aInputData.length) {
				var sAdvanceSearchQuery = serviceCaseCreation.util.ServiceConfigConstants.SserviceCaseEntitySet+"&$filter=CreatedBy%20eq%20%27"+this._sUserID+"%27%20and%20Servicecasenumber%20eq%20"+"%27"+oInputs[serviceCaseCreation.Ids.SERVICE_CASE_NUMBER_INPUT]+"%27"+"%20and%20Serialnumber%20eq%20"+"%27"+oInputs[serviceCaseCreation.Ids.SERIAL_NUMBER_INPUT]+"%27"+"%20and%20Customertoolid%20eq%20"+"%27"+oInputs[serviceCaseCreation.Ids.TOOL_NUMBER_INPUT]+"%27"+"%20and%20LegacyOrdNo%20eq%20"+"%27"+oInputs[serviceCaseCreation.Ids.LEGACY_NUMBER_INPUT]+"%27"+"%20and%20OpportunityNo%20eq%20"+"%27"+oInputs[serviceCaseCreation.Ids.OPPORTUNITY_NUMER_INPUT]+"%27"; //V01++
				this._AdvanceSearch(sAdvanceSearchQuery);
			} else {
				MessageToast.show(this.resourceBundle.getText("AdvanceSearch.AsnMessageToast"));
			}
			
			/*PCR012146 to remove date range and add 
			Opportunity Number and Legacy Order Number
			advance search*/
			
			/*var oView = this.getCurrentView(), 
			sAdvanceSearchQuery,
			sToolNumber = oView.byId(serviceCaseCreation.Ids.TOOL_NUMBER_INPUT).getValue().toUpperCase(),
			sSerialNumber = oView.byId(serviceCaseCreation.Ids.SERIAL_NUMBER_INPUT).getValue().toUpperCase(),
			sServiceCaseNumber = oView.byId(serviceCaseCreation.Ids.SERVICE_CASE_NUMBER_INPUT).getValue(),
			sEmployeeId = oView.byId(serviceCaseCreation.Ids.EMPOLYEE_ID_INPUT).getValue().toUpperCase(),
			sStartDate = oView.byId(serviceCaseCreation.Ids.START_DATE_DTPCKR).getValue().trim(),
			sEndDate = oView.byId(serviceCaseCreation.Ids.END_DATE_DTPCKR).getValue().trim();
			var sDateMessageToast = this.resourceBundle.getText("AdvanceSearch.DateMessageToast");
			var sAdvMessageToast = this.resourceBundle.getText("AdvanceSearch.AdvMessageToast");

			if(sServiceCaseNumber || sToolNumber || sSerialNumber || sEmployeeId) {

				if(sServiceCaseNumber && this.bSVCFlag) {
					sAdvanceSearchQuery = serviceCaseCreation.util.ServiceConfigConstants.SserviceCaseEntitySet+"&$filter=Servicecasenumber%20eq%20"+"%27"+sServiceCaseNumber+"%27"+"%20and%20Serialnumber%20eq%20"+"%27"+sSerialNumber+"%27"+"%20and%20Customertoolid%20eq%20"+"%27"+sToolNumber+"%27";

					this._AdvanceSearch(sAdvanceSearchQuery);
				} else if(sToolNumber || sSerialNumber || sEmployeeId) {

					if(!sStartDate && !sEndDate && this._bValidDate) {

						this._dEndDate = serviceCaseCreation.formatter.formatter.dateFormatInPost(new Date());
						this._dStartDate = new Date();
						this._dStartDate.setDate(this._dStartDate.getDate() - 15);
						this._dStartDate = serviceCaseCreation.formatter.formatter.dateFormatInPost(this._dStartDate);
						sAdvanceSearchQuery = serviceCaseCreation.util.ServiceConfigConstants.SserviceCaseEntitySet+"&$filter=CreatedBy%20eq%20%27"+this._sUserID+"%27%20and%20Servicecasenumber%20eq%20"+"%27"+sServiceCaseNumber+"%27"+"%20and%20Serialnumber%20eq%20"+"%27"+sSerialNumber+"%27"+"%20and%20Customertoolid%20eq%20"+"%27"+sToolNumber+"%27%20and%20ToDate%20eq%20%27"+this._dEndDate+"%27%20and%20FromDate%20eq%20%27"+this._dStartDate+"%27";

						this._AdvanceSearch(sAdvanceSearchQuery);
					} else if(sStartDate && sEndDate && this._bValidDate) {
						sAdvanceSearchQuery = serviceCaseCreation.util.ServiceConfigConstants.SserviceCaseEntitySet+"&$filter=CreatedBy%20eq%20%27"+this._sUserID+"%27%20and%20Servicecasenumber%20eq%20"+"%27"+sServiceCaseNumber+"%27"+"%20and%20Serialnumber%20eq%20"+"%27"+sSerialNumber+"%27"+"%20and%20Customertoolid%20eq%20"+"%27"+sToolNumber+"%27%20and%20ToDate%20eq%20%27"+this._dEndDate+"%27%20and%20FromDate%20eq%20%27"+this._dStartDate+"%27";

						this._AdvanceSearch(sAdvanceSearchQuery);
					} else if(!this._bValidDate) {

						MessageToast.show(sDateMessageToast);   
					}
				}
			} else 

				MessageToast.show(sAdvMessageToast);*/

		},

		/**
		 * This method is a success call back function for advance search service call.
		 * @name handleAdvanceSearchSuccess
		 * @param {Object} oData - success response
		 * @returns 
		 */

		handleAdvanceSearchSuccess : function(oData) {

			this.destroyDialog();
			(sap.ui.getCore().getModel("ccServiceCaseModel").getData().d.results.length) ? 
					this.getRouter().navTo("advanceSearchtoMain") : this.getRouter().navTo("noServiceCaseAvailable");
		},

		/**
		 * This method is a error call back function of Labor and Part details confirmation.
		 * @name handleCaseConfirmationError
		 * @param oData - Current event Parameter
		 * @returns 
		 */

		handleAdvanceSearchError : function(oData) {

			this.destroyDialog();
			var sFailureDialogMsg = this.resourceBundle.getText("AdvanceSearch.FailureDialogMsg");
			serviceCaseCreation.fragmentHelper.dialogFragmentContent(this, sFailureDialogMsg , serviceCaseCreation.StandardSAPIcons.ICON_SAP_MSG_ERROR, "#cc1919",
					oData.getParameter("d").ErrorMessage);
			serviceCaseCreation.fragmentHelper.createDialogFragment(this.getCurrentView().getId(), this, "serviceCaseCreation.view.fragments.InfoDialog").open();
		},

		/**
		 * This method will close the infoDialog and will help to navigate to ServiceOrder view.
		 * @name onInfoDialog
		 * @param 
		 * @returns 
		 */

		onInfoDialog : function() {

			this.destroyDialog();
		},

		/**
		 * This method will help to navigate back to master view (Dashboard).
		 * @name cancelSearch
		 * @param 
		 * @returns 
		 */

		onCancelSearch : function() {

			(sap.ui.getCore().getModel("ccServiceCaseModel").getData().d.results.length) ? 
					this.getRouter().navTo("serviceCaseMaster") : this.getRouter().navTo("noServiceCaseAvailable");
		},

		/* =========================================================== */
		/* begin: internal methods                                     */
		/* =========================================================== */

		/**
		 * This method helps to identify the route when navigated back from master (Dashboard) view to advance search.
		 * @name _onAttachRouteMatched
		 * @param {Object} oEvent - routeMatched event
		 * @returns 
		 */

		_onAttachRouteMatched : function(oEvent) {

//			added employee id
			this.Userid="";
			this._sUserID="";
			/*this.bSVCFlag = true; //V01--
			this._bValidDate = true; //V01--
			this._dStartDate = this._dEndDate = "";*/ //V01--

			if ( oEvent.getParameter("name") === "advanceSearch" ){
				this.clearElementsWithIDs(this._aAdvSearchFields); //V01++
			}

			/* Removing Date Id and display format 
			 * Start of V01-- */

			/*var aDatePickers = [serviceCaseCreation.Ids.START_DATE_DTPCKR,
			                    serviceCaseCreation.Ids.END_DATE_DTPCKR],
			                    oView = this.getView();

			this.setDisplayFormatForDatePickers(aDatePickers);
			this.setErrorStateNoneForElementsWithIDs(aDatePickers);*/
		},

		/**
		 * This method is called for advance search service call.
		 * @name _AdvanceSearch
		 * @param sAdvanceSearchQuery - Current event  Parameter
		 * @returns 
		 */

		_AdvanceSearch : function(sAdvanceSearchQuery) {

			var sBusyDialogMsg = this.resourceBundle.getText("AdvanceSearch.BusyDialogMsg");
			serviceCaseCreation.fragmentHelper.dialogFragmentContent(this, "", "", "", sBusyDialogMsg);
			serviceCaseCreation.fragmentHelper.createDialogFragment(this.getCurrentView().getId(), this, "serviceCaseCreation.view.fragments.BusyDialog").open();

			this.finishoDataModelregistartionProcessWithParams(serviceCaseCreation.util.EventTriggers.SERVICE_CASES_SEARCH_SUCCESS, 
					"handleAdvanceSearchSuccess", serviceCaseCreation.util.EventTriggers.SERVICE_CASES_SEARCH_FAIL,
					"handleAdvanceSearchError", sAdvanceSearchQuery, 
					serviceCaseCreation.util.ServiceConfigConstants.get,"","","", 
					serviceCaseCreation.util.EventTriggers.TRIGGER_SERVICE_CASES_SEARCH_READ);
		},
		
	});	

	return advanceSearchController;
});