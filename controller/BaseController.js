/**
 * This class is base controller for defining other controllers.
 *
 * @class 
 * @public
 * @author Siva Prasad Paruchuri
 * @since 13 November 2016
 * @extends sap.ui.core.mvc.Controller
 * @name serviceCaseCreation.controller.BaseController
 *
 ** -------------------------------------------------------------------------------------*
 * Modifications.                                                                        *
 * -------------                                                                         *
 * Ver.No    Date        Author  	  PCR No.           Description of change            *
 * ------ ---------- ------------ ----------  -------------------------------------------*
 * V00    13/10/2016   Siva Prasad														 *
 * 					Prachuri/Alok 		PCR012146		 initial version				 *
 *                     (X087050)                                                         *
 *                                                                                       *
 * V01    14/07/2017  Vimal Pandu       PCR015574        Cross App Navigation Changes    *
 * 					   (X087924)														 *
 * V02	  26/12/2017	X087924	        PCR016664		 Removing busy dialog for initial*
 * 														 Service Call					 *
 *****************************************************************************************
 ************************************************************************
 *  Date        Author    PCR No.          Description of change        *
 ************ ********  **********   ************************************
 * 02/13/2018  X087924	 PCR017437  Category fields data bindings       *
 * 07/31/2018  X087924   PCR018422	Pass Down Log and Attachment changes*
 * 09/22/2020  X0108356  PCR031702   IBase Implementation			    *
 ************************************************************************/

jQuery.sap.require("serviceCaseCreation.model.SvcCreateCoreModel");

sap.ui.core.mvc.Controller.extend("serviceCaseCreation.controller.BaseController", {

	/**
	 * this method returns the current application Component 
	 * @param 
	 * @returns {Object} Component object
	 */
	getComponent: function() {
		return this.getOwnerComponent();
	},

	/**
	 * This method return the current view.
	 * @name getCurrentView
	 * @param 
	 * @returns {Object} View object
	 */
	getCurrentView: function() {
		return this.getView();
	},

	/**
	 * this method returns the model with name from component
	 * @param {String} sModelName - model name
	 * @returns {Object} Model object
	 */
	getModelFromComponent: function(sModelName) {
		return this.getOwnerComponent().getModel(sModelName);
	},

	/**
	 * This method is for registration of oData Model .
	 * @name finishoDataModelregistartionProcessWithParams
	 * @param attachedEventName - Holds current event name needs to be attached
	 * @param SuccessHandler- Handle the successfully registration of model
	 * @param errorHandler - Holds the error in service call
	 * @param fireEventRef - Holds the reference of current event 
	 * @param entitySetName - Name of entity for which oData service call will happen
	 * @param requestType - Type of oData request
	 * @param requestBody - Body of the request
	 * @param successHandler - Holds the successfully call of service
	 * @returns 
	 */
	finishoDataModelregistartionProcessWithParams: function(attachedEventName, SuccessHandler, attachedErrorEvent, ErrorHandler,
		entitySetName, requestType, requestBody, successHandler, errorHandler, fireEventRef) {

		this.oServiceCaseModel = new serviceCaseCreation.model.SvcCreateCoreModel(this);
		this.oServiceCaseModel.attachserviceCaseCreationEventWithEventName(attachedEventName, jQuery.proxy(this[SuccessHandler]), this);
		this.oServiceCaseModel.attachserviceCaseCreationEventWithEventName(attachedErrorEvent, jQuery.proxy(this[ErrorHandler]), this);
		this.oServiceCaseModel.addBatchOperation(entitySetName, requestType, requestBody, successHandler, errorHandler);
		this.oServiceCaseModel.fireserviceCaseCreationEventWithEventName(fireEventRef);
	},

	/**
	 * This method will set the model to the component.
	 * @name setGlobalComponentModel
	 * @param oModelRef - Holds the reference of model
	 * @returns 
	 */
	setGlobalComponentModel: function(oModelRef) {
		this.getOwnerComponent().setModel(sap.ui.getCore().getModel(oModelRef));
	},

	/**
	 * This method is to get global model from Component.
	 * @name getGlobalComponentModel
	 * @param 
	 * @returns {Object} model object
	 */
	getGlobalComponentModel: function() {
		return this.getOwnerComponent().getModel();
	},

	/**
	 * This method will fetch the model from the component and set to the current view.
	 * @name setComponentModelToCurrentViewModel
	 * @param 
	 * @returns 
	 */
	setComponentModelToCurrentViewModel: function() {
		this.getView().setModel(this.getOwnerComponent().getModel());
	},

	/**
	 * This method is to get model of current view.
	 * @name getCurrentViewModel
	 * @param 
	 * @returns {Object} current view model object
	 */
	getCurrentViewModel: function() {
		return this.getView().getModel();
	},

	/**
	 * This method will hide the visibility elements.
	 * @name hideElementsWithIDs
	 * @param [elements] array - aElementIDs
	 * @returns 
	 */
	hideElementsWithIDs: function(aElementIDs) {
		this.setElementsVisibility(aElementIDs, false);
	},

	/**
	 * This method will display the elements.
	 * @name showElementsWithIDs
	 * @param [elements] array - aElementIDs
	 * @returns 
	 */
	showElementsWithIDs: function(aElementIDs) {
		this.setElementsVisibility(aElementIDs, true);
	},

	/**
	 * This method will toggle the visibility of the elements.
	 * @name setElementsVisibility
	 * @param [elements] array - aElementIDs
	 * @param boolean - visibilityFlag
	 * @returns 
	 */
	setElementsVisibility: function(aElementIDs, visibilityFlag) {
		for (var elementID in aElementIDs)
			this.getView().byId(aElementIDs[elementID]).setVisible(visibilityFlag);
	},

	/**
	 * This method will toggle the availability (disabling) of the elements.
	 * @name disableElementsWithIDs
	 * @param [elements] array - aElementIDs
	 * @returns 
	 */
	disableElementsWithIDs: function(aElementIDs) {
		this.toggleAvailability(aElementIDs, false);
	},

	/**
	 * This method will toggle the availability (enabling) of the elements.
	 * @name enableElementsWithIDs
	 * @param [elements] array - aElementIDs
	 * @returns 
	 */
	enableElementsWithIDs: function(aElementIDs) {
		this.toggleAvailability(aElementIDs, true);
	},

	/**
	 * This method will toggle the availability of the elements.
	 * @name toggleAvailability
	 * @param [elements] array - aElementIDs
	 * @param boolean - availabilityFlag
	 * @returns 
	 */
	toggleAvailability: function(aElementIDs, availabilityFlag) {
		for (var elementID in aElementIDs)
			this.getView().byId(aElementIDs[elementID]).setEnabled(availabilityFlag);
	},

	/**
	 * This method will clear the input of the fields.
	 * @name clearElementsWithIDs
	 * @param [elements] array - aElementIDs
	 * @returns 
	 */
	clearElementsWithIDs: function(aElementIDs) {
		for (var elementID in aElementIDs)
			this.getView().byId(aElementIDs[elementID]).setValue("");
	},

	/**
	 * This method will clear the input of the fields.
	 * @name clearElementsWithIDs
	 * @param [elements] array - aElementIDs
	 * @returns 
	 */
	setErrorStateNoneForElementsWithIDs: function(aElementIDs) {
		for (var elementID in aElementIDs)
			this.getView().byId(aElementIDs[elementID]).setValueState(sap.ui.core.ValueState.None);
	},

	/**
	 * This method will set the display format of the datePicker field
	 * @name setDisplayFormatForDatePickers
	 * @param aElementIDs - Holds the Ids of the elements
	 * @returns 
	 */
	setDisplayFormatForDatePickers: function(aElementIDs) {
		for (var elementID in aElementIDs)
			this.getView().byId(aElementIDs[elementID]).setDisplayFormat("dd-MMM-yyyy");
	},

	/**
	 * this method returns the resource bundle path
	 * @param 
	 * @returns {Object} Resource Bundle path object
	 */
	getResourceBundle: function() {
		return this.getModel("i18n").getResourceBundle();
	},

	/**
	 * this method returns the model with name
	 * @param {String} sModelName - model name
	 * @returns {Object} Model object
	 */
	getModel: function(sModelName) {
		return this.getView().getModel(sModelName);
	},

	//start of PCR017437++

	/**
	 * this method returns the model with name
	 * @param {String} sModelName - model name
	 * @returns {Object} Model object
	 */
	getModelFromCore: function(sModelName) {
		return sap.ui.getCore().getModel(sModelName);

	},

	//end of PCR017437++

	/**
	 * this method returns the new model created with name
	 * @param {Object} oModel - model object
	 * @param {String} sName - model name
	 * @returns {Object} Model object
	 */
	setModel: function(oModel, sName) {
		return this.getView().setModel(oModel, sName);
	},

	/**
	 * Convenience method for accessing the router in every controller of the application.
	 * @returns {sap.ui.core.routing.Router} the router for this component
	 */
	getRouter: function() {
		return this.getOwnerComponent().getRouter();
	},

	/**
	 * This method creates the dialog for the controller instance.
	 * @param {Object} oModel - model object
	 * @param {Object} oController - controller object
	 * @param {Object} oFragment - Fragment object
	 * @param {Object} oIndex - Index object
	 */
	createDialog: function(oController, oFragment, oModelID, oIndex) {
		// changed oController._oDialog to _oDialog PCR016664
		/*if(!oController._oDialog) {*/ //PCR016664--

		var _oDialog = sap.ui.xmlfragment(oFragment, oController);
		oController.getView().addDependent(_oDialog);
		if (oModelID)
			_oDialog.setModel(sap.ui.getCore().getModel(oModelID));
		_oDialog.index = oIndex;

		/* }*/ //PCR016664--
		jQuery.sap.syncStyleClass("sapUiSizeCompact", oController.getView(), _oDialog);

		return _oDialog;
	},

	/**
	 * This method destroys the popups created for the controller instance.
	 */
	destoryPopups: function() {
		this.destroyDialog();
		this.destroyPopover();
	},

	/**
	 * This method destroys the dialog created for the controller instance.
	 */
	destroyDialog: function() {
		if (this._oDialog) {
			this.getView() && this.getView().removeDependent(this._oDialog);
			this._oDialog.destroy(true);
		}
		this._oDialog = null;
	},

	/**
	 * This method destroys the popover created for the controller instance.
	 */
	destroyPopover: function() {
		if (this._oPopover) {
			this.getView() && this.getView().removeDependent(this._oPopover);
			this._oPopover.destroy(true);
		}
		this._oPopover = null;
	},

	/**
	 * This method displays unauthorized message when tried to access view directly.
	 * @param {Object} fnCallBack - Call back function
	 */
	showUnAuthorizedMessage: function(fnCallBack) {

	},

	/*Cross App Navigation
	 * PCR
	 * V01++*/

	/**
	 * This method navigates screen to start page.
	 *//*
	navigateToStartPage : function() {
    	this.getRouter().navTo("");
    },*/
    
	/**
	 * Event handler for navigating back.
	 * It there is a history entry or an previous app-to-app navigation we go one step back in the browser history
	 * If not, it will replace the current entry of the browser history with the master route.
	 * @public
	 */
	onNavBack: function() {
		var sPreviousHash = sap.ui.core.routing.History.getInstance().getPreviousHash(),
			oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");

		if (sPreviousHash !== undefined || !oCrossAppNavigator.isInitialNavigation()) {
			history.go(-1);
		} else {
			this.getRouter().navTo("dashboard", {}, true);
		}
	},

	/*--------*/

	//PCR017437++ changes start

	/**
	 * This method is to clear the selected key for the elements.
	 * @name clearKeyValueswithIds
	 * @param 
	 * @returns 
	 */
	clearKeyValueswithIds: function(aElementIDs) {
		for (var elementID in aElementIDs)
			this.getView().byId(aElementIDs[elementID]).setSelectedKey("");
	},

	//PCR017437++ changes end

	/*Start of PCR018422++ changes
	Pass Down Log Read and Attachment changes*/

	/**
	 * Creates a model for the current view with the given properties.
	 * @name createViewModel
	 * @param {Object} oViewData - current view properties
	 * @public
	 */
	createViewModel: function(oViewData) {
		// Model used to manipulate control states. The chosen values make sure,
		// detail page is busy indication immediately so there is no break in
		// between the busy indication for loading the view's meta data
		var oViewModel = new sap.ui.model.json.JSONModel(oViewData);
		this.setModel(oViewModel, oViewData.sModelName);
	},

	/**
	 * Sets the item count on the master list header.
	 * @name updateListItemCount
	 * @param {Object} oProperties properties of the list
	 * @private
	 */
	updateListItemCount: function(oProperties) {
		var sTitle,
			oModel = this.getModel(oProperties.sModelName),
			oList = this.getView().byId(oProperties.sListId);
		
		// only update the counter if the length is final
		if (oList.getBinding("items").isLengthFinal()) {
			sTitle = this.getComponent().getModel("i18n").getResourceBundle().getText(oProperties.sStringRef, [oProperties.iTotalItems]);
			oModel.setProperty("/title", sTitle);
		}
	},

	/*End of PCR018422++ changes*/
	
	/*Start of IBase PCR031702++ changes*/
	/**
	 * This method will set Value State of the input fields.
	 * @name setValueStateForInputElementsWithIDs
	 * @param [elements] array - aElementIDs
	 * @returns isEmpty
	 */
	setValueStateForInputElementsWithIDs: function(aElementIDs) {
		var isEmpty = false;
		for (var elementID in aElementIDs){
			var sInput = sap.ui.getCore().byId(aElementIDs[elementID]).getValue();
			if(sInput){
				sap.ui.getCore().byId(aElementIDs[elementID]).setValueState(sap.ui.core.ValueState.None);
			} else{
				sap.ui.getCore().byId(aElementIDs[elementID]).setValueState(sap.ui.core.ValueState.Error);	
				isEmpty = true;
			}
		}
		return isEmpty;
	},
	
	/**
	 * This method will set Value State of the Combo/Select fields.
	 * @name setValueStateForKeyElementsWithIDs
	 * @param [elements] array - aElementIDs
	 * @returns isEmpty
	 */
	setValueStateForKeyElementsWithIDs: function(aElementIDs) {
		var isEmpty = false;
		for (var elementID in aElementIDs){
			var sInput = sap.ui.getCore().byId(aElementIDs[elementID]).getSelectedKey();
			if(sInput){
				sap.ui.getCore().byId(aElementIDs[elementID]).setValueState(sap.ui.core.ValueState.None);
			}else {
				sap.ui.getCore().byId(aElementIDs[elementID]).setValueState(sap.ui.core.ValueState.Error);	
				isEmpty = true;
			}
		}
		return isEmpty;
	},
	
	/*End of IBase PCR031702++ changes*/
	
});
