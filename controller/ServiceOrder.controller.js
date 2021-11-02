/**
 * This class holds methods for Service Order.
 *
 * @class
 * @public
 * @author Siva Prasad Paruchuri
 * @since 13 November 2016
 * @extends serviceCaseCreation.controller.BaseController
 * @name serviceCaseCreation.controller.ServiceOrder
 ** ------------------------------------------------------------------------------------*
 * Modifications.                                                                       *
 * -------------                                                                        *
 * Ver.No    Date        Author  	  PCR No.           Description of change           *
 * ------ ---------- ------------ ----------  ------------------------------------------*
 * V00    13/10/2016   Siva Prasad 														*
 * 					  Prachuri/Alok 	PCR012146		 initial version                *
 *                     (X087050)                                                        *
 *                                                                                      *
 * V01    14/07/2017  Vimal Pandu       PCR015574        Cross App Navigation Changes   *
 * 					   (X087924)														*
 * V02    04/10/2017  Neeraj Pradhan    PCR015574        Label change for start date and*
 * 					   (X087925)						 time.							*
 * V03    09/01/2018   X087924		    PCR016664		 Initial query set busy changes *
 ****************************************************************************************
 ********************************************************************************
 *  Date        Author    	PCR No.     Description of change       			*
 ************ 	********  	**********  *****************************************
 * 02/13/2018  	X087924	 	PCR017437   Technology and PBG changes	and     	*
 * 									 	Category fields data bindings      		*
 * 05/28/2018  	X087924   	PCR018233   Cross App Navigation Buttons       		*
 * 11/06/2018  	X087924   	PCR018233   Exe. Service Employee Addition changes	*
 * 07/31/2018  	X087924   	PCR018422	Pass Down Log and Attachment changes	*
 * 09/27/2018  	X087924   	PCR020194   Cross App Navigation Button changes		*	
 * 10/03/2018  	X087924   	PCR020161   Indirect Labor changes 					*
 * 11/19/2019  	Vimal Pandu PCR020942	KA Project changes 						*
 * 04/04/2019  	Balaji 	 	PCR023277	KA Project Changes                 		*	
 * 03/02/2020  	X0108534  	PCR027291   Add the category 3 & Category4     		*
 * 03/30/2020  	X0108534  	PCR027779   Shift pass down fields    				*
 * 07/13/2020  	X0108534  	PCR030427   internal external notes issue      		*
 * 08/31/2020  	X0108534  	PCR030996   ARK URL						    		*
 * 12/18/2020   Vimal Pandu PCR032539   PSE Sprint 10 changes 					*
 * 03/01/2021   X0108534  	PCR034663   NSO and Labor cancellation              *
 * 02/18/2021   X0108534  	PCR033903	FSO Q2                                  *
 * 05/27/2021   X089025     PCR035464   Upgrade issue resolution                *
 ********************************************************************************/

sap.ui.define([
	'jquery.sap.global',
	'sap/m/MessageToast',
	'serviceCaseCreation/controller/BaseController',
	'sap/ui/core/Control',
	"sap/ui/core/HTML",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageBox" //PCR034663++
], function(jQuery, MessageToast, Controller, Control, HTML, Filter, FilterOperator, MessageBox) { //PCR034663++ added MessageBox

	var serviceOrderController = Controller.extend("serviceCaseCreation.controller.ServiceOrder", {

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf serviceCaseCreation.controller.Login
		 */
		onInit: function() {
			this.resourceBundle = this.getComponent().getModel("i18n").getResourceBundle();
			this.aInputElements = [
				serviceCaseCreation.Ids.MAL_FCTN_START_DATEPICKER,
				serviceCaseCreation.Ids.MAL_FCTN_START_TIMEPICKER,
				serviceCaseCreation.Ids.DELAY_STATUS_COMBOBOX,
				serviceCaseCreation.Ids.UPDATE_BUTTON,
				serviceCaseCreation.Ids.CANCEL_BUTTON,
				serviceCaseCreation.Ids.ASSIGNED_TO,
				serviceCaseCreation.Ids.COMBOBOX_IDTIER,
				serviceCaseCreation.Ids.COMBOBOX_IDFAULT,
				serviceCaseCreation.Ids.COMBOBOX_IDSYMPTOM,
				serviceCaseCreation.Ids.INPUT_FIXBILLING,
				serviceCaseCreation.Ids.COMBOBOX_SERVICECLASSIFICATION,
				serviceCaseCreation.Ids.CUSTPO_INPUT,
				serviceCaseCreation.Ids.PROBLEM_DESC_TEXT_AREA,
				serviceCaseCreation.Ids.COMBOBOX_CIDPMTYPE,
				serviceCaseCreation.Ids.INPUT_ACCASSIGNMENT_DISPLAY,
				serviceCaseCreation.Ids.INPUT_OPPNUM1,
				serviceCaseCreation.Ids.COMBOBOX_NONCONFIRM,
				serviceCaseCreation.Ids.INPUT_WAFERSCRAP,
				serviceCaseCreation.Ids.COMBOBOX_CATEGORY2,
				serviceCaseCreation.Ids.COMBOBOX_CATEGORY3, //PCR027291++
				serviceCaseCreation.Ids.COMBOBOX_CATEGORY4, //PCR027291++
				serviceCaseCreation.Ids.MALFUNCDTPKR, //PCR018422++
				serviceCaseCreation.Ids.MALFUNCTMPKR, //PCR018422++
				serviceCaseCreation.Ids.ASSEM_CMBX, //PCR020942++
				serviceCaseCreation.Ids.TOOLSTAT_CMBX, //PCR020942++
				/*Begin of PCR027779++*/
				serviceCaseCreation.Ids.ASSEMBLY_STAT,
				serviceCaseCreation.Ids.CUSTOMER_STAT,
				serviceCaseCreation.Ids.EXPECTED_DEL,
				//serviceCaseCreation.Ids.INTERNAL_NOTES,//PCR030427--
				//serviceCaseCreation.Ids.EXTERNAL_NOTES,//PCR030427--
				serviceCaseCreation.Ids.CUST_CONT_PERS,
				/*End of PCR027779++*/
			];
			this.aTextElements = [
				serviceCaseCreation.Ids.DELAY_STATUS_TEXT,
				serviceCaseCreation.Ids.MAL_FCTN_STARTDATE_TEXT,
				serviceCaseCreation.Ids.MAL_FCTN_STARTTIME_TEXT,
				serviceCaseCreation.Ids.TIMEZONE_TEXT, //V02++
				serviceCaseCreation.Ids.ASSIGNED_TO_TEXT,
				serviceCaseCreation.Ids.COMBOBOX_IDSYMPTOM_TEXT,
				serviceCaseCreation.Ids.COMBOBOX_FAULT_TEXT,
				serviceCaseCreation.Ids.COMBOBOX_IDTIER_TEXT,
				serviceCaseCreation.Ids.FIXBILLING_TEXT,
				serviceCaseCreation.Ids.SERVICECLASSIFICATION_TEXT,
				serviceCaseCreation.Ids.CUSTPO_TEXT,
				serviceCaseCreation.Ids.PROBLEM_DESC_TEXT,
				serviceCaseCreation.Ids.DESC_ICON,
				serviceCaseCreation.Ids.LINK_TEXT,
				serviceCaseCreation.Ids.COMBOBOX_IDPMTPE_TEXT,
				serviceCaseCreation.Ids.ACCOUNT_ASSIGN_TEXT,
				serviceCaseCreation.Ids.CUST_PO1,
				serviceCaseCreation.Ids.NONCONFORM_TXT,
				serviceCaseCreation.Ids.WAFERSCRAP_TXT,
				serviceCaseCreation.Ids.CATEGORY2_TXT,
				serviceCaseCreation.Ids.CATEGORY3_TXT, //PCR027291++
				serviceCaseCreation.Ids.CATEGORY4_TXT, //PCR027291++
				serviceCaseCreation.Ids.MALFUNCTMLBL, //PCR018422++
				serviceCaseCreation.Ids.MALFUNCDTLBL, //PCR018422++
				serviceCaseCreation.Ids.TOOLSTAT_TEXT, //PCR020942++
				serviceCaseCreation.Ids.ASSEM_TEXT, //PCR020942++
				/*Begin of PCR027779++*/
				serviceCaseCreation.Ids.CUST_CONT_TXT,
				serviceCaseCreation.Ids.ASSEMBLY_STAT_TXT,
				serviceCaseCreation.Ids.CUSTOMER_STAT_TXT,
				serviceCaseCreation.Ids.EXPECTED_DEL_TXT,
				//serviceCaseCreation.Ids.INTERNAL_NOTES_TXT,//PCR030427--
				//serviceCaseCreation.Ids.EXTERNAL_NOTES_TXT,//PCR030427--
				/*End of PCR027779++*/
			];
			this.aLabels = [
				serviceCaseCreation.Ids.STARTDATE_LBL,
				//serviceCaseCreation.Ids.STARTTIME_LBL,		 V02--
				serviceCaseCreation.Ids.ASSIGNTO_LBL,
				serviceCaseCreation.Ids.NONCONFIRM_LBL,
				serviceCaseCreation.Ids.PROBLEMDESCRIPTION_LBL,
				serviceCaseCreation.Ids.SYMPTOM_LBL,
				serviceCaseCreation.Ids.FAULT_LBL,
				serviceCaseCreation.Ids.TIER_LBL,
				serviceCaseCreation.Ids.CATEGORY_LBL,
				serviceCaseCreation.Ids.PMTYPE_LBL,
				serviceCaseCreation.Ids.MALFUNCDATELBL, //PCR018422++
				serviceCaseCreation.Ids.MALFUNCTIMELBL, //PCR018422++
				serviceCaseCreation.Ids.ASSEM_LABEL, //PCR020942++
				serviceCaseCreation.Ids.TOOLSTAT_LABEL, //PCR020942++
			];
			var oView = this.getCurrentView(); //PCR016664++
			oView.setBusyIndicatorDelay(0); //PCR016664++
			oView.setBusy(true); //PCR016664

			serviceCaseCreation.controller.BaseController.prototype.setComponentModelToCurrentViewModel.call(this, "ccServiceCaseModel");
			sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(this._onAttachRouteMatched, this);
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * This method is to go back to previous screen (Dashboard) .
		 * @name onNavBack
		 * @param
		 * @returns
		 */
		onNavBack: function() {
			var that = this;

			jQuery.each(this.aLabels, function(i, oItem) {
				that.getView().byId(oItem).removeStyleClass("asteriskCC");
			});
			this.getRouter().navTo("serviceCaseMaster");
		},

		/**
		 * This method handles the link on Service Order Page .
		 * @name handleLinkPress
		 * @param
		 * @returns
		 */
		handleLinkPress: function() {
			serviceCaseCreation.util.Util.handleProblemDescription(this, this._count, serviceCaseCreation.Ids.PROBLEM_DESC_TEXT,
				serviceCaseCreation.Ids.PROBLEM_DESC_LABEL, serviceCaseCreation.Ids.LINK_TEXT, serviceCaseCreation.Ids.DESC_ICON);

			this._count += 1;
		},

		/**
		 * This method is to open dialog fragment to searching assigned person .
		 * @name assignedPerson
		 * @param
		 * @returns
		 */
		assignedPerson: function() {
			serviceCaseCreation.fragmentHelper.createDialogFragment(this.getCurrentView().getId(), this,
				"serviceCaseCreation.view.fragments.AssignedTo").open();
		},

		/**
		 * This method is called on ok click on the assigned to fragment .
		 * @name onAssignedTo
		 * @param
		 * @returns
		 */
		onAssignedTo: function() {
			var sUserId = this.getView().byId(serviceCaseCreation.Ids.USERID_INPUT).getValue(),
				sFirstName = this.getView().byId(serviceCaseCreation.Ids.FIRST_NAME_INPUT).getValue().trim().replace(/ /g, "%20"),
				sLastName = this.getView().byId(serviceCaseCreation.Ids.LAST_NAME_INPUT).getValue().trim().replace(/ /g, "%20"),
				sAsnMessageToast = this.resourceBundle.getText("ServiceOrder.AssignMessageToast");

			if (sFirstName || sLastName || sUserId) {

				this.destroyDialog();
				var sBusyDialogMsg = this.resourceBundle.getText("ServiceOrder.BusyDialogMsg");
				serviceCaseCreation.fragmentHelper.dialogFragmentContent(this, "", "", "", sBusyDialogMsg);
				this._busyDialog = serviceCaseCreation.fragmentHelper.createDialogFragment(this.getCurrentView().getId(), this,
					"serviceCaseCreation.view.fragments.BusyDialog");
				this._busyDialog.open();

				var aEntitySet = [serviceCaseCreation.util.ServiceConfigConstants.CaseCreationCEUserHelpSet + "?$filter=Firstname%20eq%20%27" +
					sFirstName + "%27%20and%20Lastname%20eq%20%27" + sLastName + "%27%20and%20Userid%20eq%20%27" + sUserId + "%27"
				];

				this.finishoDataModelregistartionProcessWithParams(serviceCaseCreation.util.EventTriggers.CASE_CREATION_USER_HELP_SUCCESS,
					"handleCEinputSuccess",
					serviceCaseCreation.util.EventTriggers.CASE_CREATION_USER_HELP_FAIL,
					"handleCEinputFail",
					aEntitySet,
					serviceCaseCreation.util.ServiceConfigConstants.get, "", "", "", serviceCaseCreation.util.EventTriggers.TRIGGER_CASE_CREATION_USER_HELP_READ
				);
			} else
				MessageToast.show(sAsnMessageToast);
		},

		/**
		 * This method is success call back function for assigned to service call .
		 * @name handleCEinputSuccess
		 * @param
		 * @returns
		 */
		handleCEinputSuccess: function() {
			this._busyDialog.destroy();
			var ceHelpModel = sap.ui.getCore().getModel("ccUserHelpListModel");

			if (ceHelpModel.getData().d.results.length) {
				this.assignedSearchResultdialog = serviceCaseCreation.fragmentHelper.createDialogFragment(this.getCurrentView().getId(), this,
					"serviceCaseCreation.view.fragments.AssignedSearchResult");
				this.assignedSearchResultdialog.setModel(ceHelpModel);
				this.assignedSearchResultdialog.open();

				if (ceHelpModel.getData().d.results.length === 1) {
					var oTable = this.getView().byId(serviceCaseCreation.Ids.ASSIGNED_SEARCH_RESULT_TABLE)
					oTable.setSelectedItem(oTable.getItems()[0], true);
				}
			} else {
				var sMessageToast = this.resourceBundle.getText("ServiceOrder.MessageToast");
				sap.m.MessageToast.show(sMessageToast);
			}
		},

		/**
		 * This method is failure call back function for assigned to service call .
		 * @name handleCEinputFail
		 * @param
		 * @returns
		 */
		handleCEinputFail: function() {
			this._busyDialog.destroy();
		},

		/**
		 * This method is to close dialog fragment to searching assigned person .
		 * @name onAssignedToResultSelectionChange
		 * @param
		 * @returns
		 */
		onAssignedToResultSelectionChange: function(oEvent) {
			var oUserListModel = sap.ui.getCore().getModel("ccUserHelpListModel");
			if (oUserListModel.getData().d.results.length === 1) {
				this.onSelectAssignedName();
			}
		},

		/**
		 * This method is to select line item for assigning service case .
		 * @name onSelectAssignedName
		 * @param
		 * @returns
		 */
		onSelectAssignedName: function(oEvent) {
			var oTable = this.getView().byId(serviceCaseCreation.Ids.ASSIGNED_SEARCH_RESULT_TABLE);

			if (oTable.getSelectedItem()) {
				var firstName = oTable.getSelectedItem().getBindingContext().getProperty("Firstname");
				var lastName = oTable.getSelectedItem().getBindingContext().getProperty("Lastname");
				this.userId = oTable.getSelectedItem().getBindingContext().getProperty("Userid");
				this.getView().byId(serviceCaseCreation.Ids.ASSIGNED_TO_ID_INPUT).setValue(firstName + " " + lastName);
			}

			this.assignedSearchResultdialog.destroy();
		},

		/**
		 * This method is to close dialog fragment of searched result for assigned person .
		 * @name cancelAssignedResult
		 * @param
		 * @returns
		 */
		cancelAssignedResult: function() {
			this.assignedSearchResultdialog.destroy();
		},

		/**
		 * This method is to close dialog fragment to searching assigned person .
		 * @name onCancelAssignedTo
		 * @param
		 * @returns
		 */
		onCancelAssignedTo: function() {
			this.destroyDialog();
		},

		/**
		 * This method is to Validate the wrong values in combobox
		 * @name onInputLiveChangeCombox
		 * @param oEvent - Current Event Parameter
		 * @returns
		 */
		onInputLiveChangeCombox: function(oEvent) {
			var oView = this.getCurrentView(),
				sEventId = oEvent.getSource().getId();

			serviceCaseCreation.util.Util.doCompleteComboBoxElementsValidation(this, [sEventId]);
		},

		/************************start of PCR017437++************************/

		/**
		 * This method is helps in retrieving Symptom Levels values for a Service Order.
		 * @name onEditSVO
		 * @param
		 * @returns
		 */
		onEditSVO: function() {
			if (this.ServiceCaseModel) {
				if (this.ServiceCaseModel.Servicetype === "ZCMO") {
					if (!this.getModelFromCore("ccServiceOrderModel") || this.getModelFromCore("ccServiceOrderModel")) {
						if (this.getModelFromCore("ccServiceOrderModel")) {
							if (this.getModelFromCore("ccServiceOrderModel").getData().hasOwnProperty("SymDataFetchedFor" + this.serviceCaseNumber)) {
								this.onEdit();
							} else {
								this._fnGetServiceOrder();
							}
						} else {
							this._fnGetServiceOrder();
						}
					}
				} else {
					this.onEdit();
				}
			}
		},

		/**
		 * An internal method which will help in retrieving a specific service Order
		 * @name _fnGetServiceOrder
		 * @param
		 * @returns
		 */
		_fnGetServiceOrder: function() {
			serviceCaseCreation.fragmentHelper.openBusyDialog.call(this, this.resourceBundle.getText("ServiceOrder.BusyDialogMsg"));

			var sServiceCaseQuery = serviceCaseCreation.util.ServiceConfigConstants.serviceCaseEntitySet +
				"?$expand=NavToHdrSymptoms,Nav_CaseHdr_To_LaborItem&$filter=Servicecasenumber%20eq%20" + "%27" + this.serviceCaseNumber + "%27";

			var sAssemQuery = serviceCaseCreation.util.ServiceConfigConstants.assemblyListSet + "?$filter=ServiceCaseNo%20eq%20%27" + this.serviceCaseNumber +
				"%27";

			this.oAssemCustIdModel = new serviceCaseCreation.model.SvcCreateCoreModel(this);
			this.oAssemCustIdModel.attachserviceCaseCreationEventWithEventName(
				serviceCaseCreation.util.EventTriggers.SERVICE_CASE_READ_SUCCESS,
				jQuery.proxy(this.handleSymLevelReadSuccess),
				this
			);
			this.oAssemCustIdModel.addBatchOperation(
				sServiceCaseQuery,
				serviceCaseCreation.util.ServiceConfigConstants.get,
				"", "", ""
			);
			this.oAssemCustIdModel.attachserviceCaseCreationEventWithEventName(
				serviceCaseCreation.util.EventTriggers.SERVICE_CASE_READ_FAIL,
				jQuery.proxy(this.handleServiceCaseReadError),
				this
			);
			this.oAssemCustIdModel.addBatchOperation(
				sAssemQuery,
				serviceCaseCreation.util.ServiceConfigConstants.get,
				"", "", "");
			this.oAssemCustIdModel.fireserviceCaseCreationEventWithEventName(
				serviceCaseCreation.util.EventTriggers.TRIGGER_SERVICE_CASE_READ
			);

			/*this.finishoDataModelregistartionProcessWithParams(
				serviceCaseCreation.util.EventTriggers.SERVICE_CASE_READ_SUCCESS,
				"handleSymLevelReadSuccess",
				serviceCaseCreation.util.EventTriggers.SERVICE_CASE_READ_FAIL,
				"handleServiceCaseReadError",
				serviceCaseCreation.util.ServiceConfigConstants.serviceCaseEntitySet +
				"?$expand=NavToHdrSymptoms,Nav_CaseHdr_To_LaborItem&$filter=Servicecasenumber%20eq%20" + "%27" + this.serviceCaseNumber + "%27",
				serviceCaseCreation.util.ServiceConfigConstants.get, "", "", "",
				serviceCaseCreation.util.EventTriggers.TRIGGER_SERVICE_CASE_READ);*/
		},

		/**
		 * Success call back method for retrieving Symptom levels data.
		 * @name handleSymLevelReadSuccess
		 * @param
		 * @returns
		 */
		handleSymLevelReadSuccess: function() {
			// this.destroyDialog();

			if (this.getModelFromCore("ccServiceOrderModel") && this.getModelFromCore("ccEditAssemListModel")) { //PCR020942++; added && this.getModelFromCore("ccEditAssemListModel")
				this.destroyDialog(); //PCR020942++

				var oServiceOrderModelData = this.getModelFromCore("ccServiceOrderModel").getData();

				if (oServiceOrderModelData) {
					var oSvcOrder = oServiceOrderModelData.d.results[0];
					oServiceOrderModelData["SymDataFetchedFor" + oSvcOrder.Servicecasenumber] = true;
					this.ServiceCaseModel = oSvcOrder;
					this.onEdit();
				}

				this.getView().byId(serviceCaseCreation.Ids.ASSEM_CMBX).setModel(this.getModelFromCore("ccEditAssemListModel")); //PCR020942++
			}
		},

		/************************end of PCR017437++************************/

		/**
		 * This method is for editing a Part from Parts List.
		 * @name onEdit
		 * @param
		 * @returns
		 */
		onEdit: function() {
			var oView = this.getCurrentView();
			oView.byId(serviceCaseCreation.Ids.PROBLEM_DESC_TEXT).setVisible(false);
			oView.byId(serviceCaseCreation.Ids.PROBLEM_DESC_LABEL).setVisible(false);
			sap.ui.getCore().getModel("ccServiceCaseModel").updateBindings();
			this.hideElementsWithIDs(this.aTextElements);
			this.hideElementsWithIDs([serviceCaseCreation.Ids.EDIT_BUTTON, serviceCaseCreation.Ids.KA_BUTTON]); //PCR020942++; added serviceCaseCreation.Ids.KA_BUTTON
			//this.showElementsWithIDs(this.aInputElements); //PCR018422--
			this.showElementsWithIDs(this.aInputElements.concat([serviceCaseCreation.Ids.DELAYFLXBX])); //PCR018422++
			this.showElementsWithIDs([serviceCaseCreation.Ids.UPDATE_BUTTON, serviceCaseCreation.Ids.CANCEL_BUTTON]);
			this.hideElementsWithIDs([serviceCaseCreation.Ids.DESC_ICON]);
			//start of PCR017437 changes
			if (this.ServiceCaseModel.Servicetype === "ZPRJ" || this.ServiceCaseModel.Servicetype === "ZPMO") {
				this.hideElementsWithIDs([serviceCaseCreation.Ids.DELAY_PMO_PRJ]);
				this.showElementsWithIDs([serviceCaseCreation.Ids.DELAY_CMO]);
			}
			if (this.ServiceCaseModel.Servicetype === "ZINS")
				this.hideElementsWithIDs([serviceCaseCreation.Ids.DELAY_PMO_PRJ, serviceCaseCreation.Ids.DELAY_CMO]);

			if (this.ServiceCaseModel) {
				//end of PCR017437 changes
				oView.byId(serviceCaseCreation.Ids.DELAY_STATUS_COMBOBOX).setSelectedKey(this.ServiceCaseModel.Delay);
				oView.byId(serviceCaseCreation.Ids.ASSIGNED_TO).setValue(this.ServiceCaseModel.AssignedtoName);
				this.userId = this.ServiceCaseModel.Assignedto;
				oView.byId(serviceCaseCreation.Ids.PROBLEM_DESC_TEXT_AREA).setValue(this.ServiceCaseModel.Problemdescription);
				oView.byId(serviceCaseCreation.Ids.COMBOBOX_CIDPMTYPE).setSelectedKey(this.ServiceCaseModel.PmtypeCategory);
				oView.byId(serviceCaseCreation.Ids.COMBOBOX_IDTIER).setSelectedKey(this.ServiceCaseModel.Tier);
				//oView.byId(serviceCaseCreation.Ids.COMBOBOX_IDSYMPTOM).setSelectedKey(this.ServiceCaseModel.Symptom); //PCR017437--
				oView.byId(serviceCaseCreation.Ids.INPUT_FIXBILLING).setSelectedKey(this.ServiceCaseModel.FixedbillingTm);
				oView.byId(serviceCaseCreation.Ids.COMBOBOX_SERVICECLASSIFICATION).setSelectedKey(this.ServiceCaseModel.Srvclassification);
				oView.byId(serviceCaseCreation.Ids.CUSTPO_INPUT).setValue(this.ServiceCaseModel.Customerponum);
				oView.byId(serviceCaseCreation.Ids.INPUT_OPPNUM1).setValue(this.ServiceCaseModel.Customerponum);
				oView.byId(serviceCaseCreation.Ids.INPUT_WAFERSCRAP).setValue(this.ServiceCaseModel.WaferScrapCount);
				oView.byId(serviceCaseCreation.Ids.INPUT_ACCASSIGNMENT_DISPLAY).setValue(this.ServiceCaseModel.AcctAssgn);
				oView.byId(serviceCaseCreation.Ids.COMBOBOX_NONCONFIRM).setSelectedKey(this.ServiceCaseModel.NonConform);
				oView.byId(serviceCaseCreation.Ids.COMBOBOX_CATEGORY2).setSelectedKey(this.ServiceCaseModel.Category2);
				oView.byId(serviceCaseCreation.Ids.ASSEM_CMBX).setSelectedKey(this.ServiceCaseModel.Assembly); //PCR020942++
				oView.byId(serviceCaseCreation.Ids.TOOLSTAT_CMBX).setSelectedKey(this.ServiceCaseModel.Toolstatus); //PCR020942++
				oView.byId(serviceCaseCreation.Ids.ASSEMBLY_STAT).setSelectedKey(this.ServiceCaseModel.AsmblyStat); //PCR027779++
				oView.byId(serviceCaseCreation.Ids.CUSTOMER_STAT).setSelectedKey(this.ServiceCaseModel.CustToolStat); //PCR027779++

				var that = this;

				jQuery.each(this.aLabels, function(i, oItem) {
					that.getView().byId(oItem).addStyleClass("asteriskCC");
				});
				
				/*Begin of PCR034663++*/
				oView.byId(serviceCaseCreation.Ids.NSO_CMBX).setModel(sap.ui.getCore().getModel("ccMasterListModel"));
				this.bnsoFlg = false;
				var that = this;
				if (this.ServiceCaseModel.Servicetype == "ZPRJ") {
					jQuery.each(sap.ui.getCore().getModel("ccMasterListModel").getData().masterListSets.nsoCategory1Condtions	, function(i, item) {
						if (item.GuidKey == that.ServiceCaseModel.Category1 )
							that.bnsoFlg = true;											
					});
					
					
					if(this.bnsoFlg ) {
						oView.byId(serviceCaseCreation.Ids.NSO_LBL).addStyleClass("asteriskCC");	
						if(!this.ServiceCaseModel.ZzprjNso) {
							oView.byId(serviceCaseCreation.Ids.NSO_CMBX).setEnabled(true);				
							this.hideElementsWithIDs([serviceCaseCreation.Ids.CUSTPO_TEXT,
								serviceCaseCreation.Ids.NSO_TXT							
								]);
							if(this.ServiceCaseModel.Category1 ===	"08" || this.ServiceCaseModel.Category1 ===	"02") {
								this.showElementsWithIDs([serviceCaseCreation.Ids.INPUT_CUSTPO_FLEX,							
									serviceCaseCreation.Ids.CUSTPO_INPUT,
									]);	
							} else {
								this.hideElementsWithIDs([serviceCaseCreation.Ids.INPUT_CUSTPO_FLEX,							
									serviceCaseCreation.Ids.CUSTPO_INPUT,
									]);	
							}
							this.showElementsWithIDs([
								serviceCaseCreation.Ids.NSO_FLXBX,
								serviceCaseCreation.Ids.NSO_CMBX								
								]);													
						} else {
							this.hideElementsWithIDs([serviceCaseCreation.Ids.NSO_CMBX,
								serviceCaseCreation.Ids.CUSTPO_INPUT]);
							this.showElementsWithIDs([
								serviceCaseCreation.Ids.NSO_FLXBX,
								serviceCaseCreation.Ids.NSO_TXT]);	
							if(that.ServiceCaseModel.ZzprjNso.toUpperCase() === "YES") {
								this.showElementsWithIDs([serviceCaseCreation.Ids.INPUT_CUSTPO_FLEX,							
									serviceCaseCreation.Ids.CUSTPO_TEXT,
									]);
								this.getView().byId(serviceCaseCreation.Ids.OPPNO_LBL).addStyleClass("asteriskCC");
							} else {
								if(this.ServiceCaseModel.Category1 !==	"08" && this.ServiceCaseModel.Category1 !==	"02")
									this.hideElementsWithIDs([serviceCaseCreation.Ids.INPUT_CUSTPO_FLEX,							
										serviceCaseCreation.Ids.CUSTPO_TEXT,
										]);	
								else {
									this.showElementsWithIDs([serviceCaseCreation.Ids.INPUT_CUSTPO_FLEX,							
										serviceCaseCreation.Ids.CUSTPO_INPUT,
										]);
								}
							}							
						}
						
					} else {										
						this.hideElementsWithIDs([
							serviceCaseCreation.Ids.NSO_TXT]);
						this.showElementsWithIDs([
							serviceCaseCreation.Ids.NSO_FLXBX,
							serviceCaseCreation.Ids.NSO_CMBX								
							]);
						oView.byId(serviceCaseCreation.Ids.NSO_LBL).removeStyleClass("asteriskCC");
					}
				}
				if(that.ServiceCaseModel.Category1 === "OTHE" && (that.ServiceCaseModel.Category2 === "01" || that.ServiceCaseModel.Category2 === "06")) {
					this.showElementsWithIDs([serviceCaseCreation.Ids.INPUT_CUSTPO_FLEX,serviceCaseCreation.Ids.CUSTPO_TEXT]);						
					this.hideElementsWithIDs([serviceCaseCreation.Ids.CUSTPO_INPUT]);
				}
				/*End of PCR034663++*/

				/*Begin of PCR020942++ changes*/
				// if (this.ServiceCaseModel.Symptom) {

				/*serviceCaseCreation.util.Util.clearSympLevelElementsBindings.call(this, [serviceCaseCreation.Ids.COMBOBOX_IDFAULT,
					// serviceCaseCreation.Ids.COMBOBOX_IDSYMPTOM
				]); //PCR017437++
				serviceCaseCreation.util.Util.filterSymptomLevelsBindings.call(this, this.ServiceCaseModel, "NavToHdrSymptoms",
					serviceCaseCreation.Ids.COMBOBOX_IDSYMPTOM); //PCR017437++
				oView.byId(serviceCaseCreation.Ids.COMBOBOX_IDSYMPTOM).setSelectedKey(this.ServiceCaseModel.Symptom); //PCR017437++
				var aFault = [];
				var symptomKey = this.ServiceCaseModel.Symptom;
				jQuery.each(sap.ui.getCore().getModel("ccMasterListModel").getData().masterListSets.fault, function(i, item) {
					if (item.ParentGuidKey == symptomKey)
						aFault.push(item)
				});
				var faultModel = new sap.ui.model.json.JSONModel();
				faultModel.setData(aFault);
				this.getCurrentView().byId(serviceCaseCreation.Ids.COMBOBOX_IDFAULT).setModel(faultModel);
				var sSymptomLevelOneVal = oView.byId(serviceCaseCreation.Ids.COMBOBOX_IDSYMPTOM).getValue(); //PCR017437++
				serviceCaseCreation.util.Util.filterSymptomLevelTwoBindings.call(this, sSymptomLevelOneVal, serviceCaseCreation.Ids.COMBOBOX_IDFAULT); //PCR017437++
				oView.byId(serviceCaseCreation.Ids.COMBOBOX_IDFAULT).setSelectedKey(this.ServiceCaseModel.Fault);*/

				var oSymOneCmbx = oView.byId(serviceCaseCreation.Ids.COMBOBOX_IDSYMPTOM);
				oSymOneCmbx.rerender();
				oSymOneCmbx.removeStyleClass("inputMenuValueStateError");
				oSymOneCmbx.addStyleClass("inputMenuBorder");

				serviceCaseCreation.util.Util.clearSympLevelElementsBindings.call(this, [
					serviceCaseCreation.Ids.COMBOBOX_IDFAULT
				]);
				var aSymOneFilter = serviceCaseCreation.util.Util.filterSymptomLevelsBindings.call(this, this.ServiceCaseModel,
					"NavToHdrSymptoms");
				oSymOneCmbx.getAggregation("_input").setValue(this.ServiceCaseModel.SymptomDesc);
				oSymOneCmbx.setArrParentFilers(aSymOneFilter);
				oSymOneCmbx.setParentKey(this.ServiceCaseModel.Symptom);

				serviceCaseCreation.util.Util._fnSetSymLevelsFieldsData.call(this, this.ServiceCaseModel.Symptom, serviceCaseCreation.Ids.COMBOBOX_IDFAULT, true);                   //PCR035464++

				serviceCaseCreation.util.Util.filterSymptomLevelTwoBindings.call(this, this.ServiceCaseModel.SymptomDesc, serviceCaseCreation.Ids
					.COMBOBOX_IDFAULT, "onEdit");
				oView.byId(serviceCaseCreation.Ids.COMBOBOX_IDFAULT).setSelectedKey(this.ServiceCaseModel.Fault);
				// }
				/*End of PCR020942++ changes*/
				/*satrt of PCR016664++/
				 * adding category2 based on category 1 in PRJ order
				 */

				if (this.ServiceCaseModel.Category1) {
					var aCategory2 = [];
					var cat1Key = this.ServiceCaseModel.Category1;
					jQuery.each(sap.ui.getCore().getModel("ccMasterListModel").getData().masterListSets.category2, function(i, item) {
						if (item.ParentGuidKey == cat1Key)
							aCategory2.push(item)
					});
					var category2Model = new sap.ui.model.json.JSONModel();
					category2Model.setData(aCategory2);
					oView.byId(serviceCaseCreation.Ids.COMBOBOX_CATEGORY2).setModel(category2Model);
					oView.byId(serviceCaseCreation.Ids.COMBOBOX_CATEGORY2).setSelectedKey(this.ServiceCaseModel.Category2);
				}

				if (this.ServiceCaseModel.Category2) {
					var aCategory3 = [];
					var cat2Key = this.ServiceCaseModel.Category2;
					var sGuidkey = this.ServiceCaseModel.Cat2_GUID;
					jQuery.each(sap.ui.getCore().getModel("ccMasterListModel").getData().masterListSets.category3, function(i, item) {
						if (item.ParentGuidKey == cat2Key && sGuidkey == item.KeyValue3)
							aCategory3.push(item)
					});
					var category3Model = new sap.ui.model.json.JSONModel();
					category3Model.setData(aCategory3);
					oView.byId(serviceCaseCreation.Ids.COMBOBOX_CATEGORY3).setModel(category3Model);
					oView.byId(serviceCaseCreation.Ids.COMBOBOX_CATEGORY3).setSelectedKey(this.ServiceCaseModel.Category3);
				}

				if (this.ServiceCaseModel.Category3) {
					var aCategory4 = [];
					var cat3Key = this.ServiceCaseModel.Category3;
					var sGuidkey = this.ServiceCaseModel.Cat3_GUID;
					jQuery.each(sap.ui.getCore().getModel("ccMasterListModel").getData().masterListSets.category4, function(i, item) {
						if (item.ParentGuidKey == cat3Key && sGuidkey == item.KeyValue3)
							aCategory4.push(item)
					});
					var category4Model = new sap.ui.model.json.JSONModel();
					category4Model.setData(aCategory4);
					oView.byId(serviceCaseCreation.Ids.COMBOBOX_CATEGORY4).setModel(category4Model);
					oView.byId(serviceCaseCreation.Ids.COMBOBOX_CATEGORY4).setSelectedKey(this.ServiceCaseModel.Category4);
				}

				/*end of PCR016664++*/
			}
		},
		/** Begin of PCR027291++
		 * This method is for checking value state
		 * @name onChangeCause
		 * @param oEvent-Current Event Parameter
		 * @returns
		 */
		onChangeCause: function(oEvent) {
			var oView = this.getView();
			var sValueState = (oEvent.getSource().getValue().length) ? "None" : "Error";
			oEvent.getSource().setValueState(sValueState);
			var selKey = oEvent.getSource().getSelectedKey();
			var sGuidkey = oEvent.getSource().getSelectedItem().getBindingContext().getObject().KeyValue2;
			var showElements = [],
				hideElements = [];

			switch (selKey) {
				case "02":
				case "03":
				case "04":
				case "05":
				case "06":
					showElements = [
						serviceCaseCreation.Ids.CATEGORY3_FLEX
					]
					hideElements = [
						serviceCaseCreation.Ids.CATEGORY4_FLEX
					]
					break;
				default:
					showElements = [

					];
					hideElements = [
						serviceCaseCreation.Ids.CATEGORY3_FLEX,
						serviceCaseCreation.Ids.CATEGORY4_FLEX
					]
					break;
			}

			/*
			 * setting Values of category3 based on category 2*/
			var aCatagory3 = [];
			jQuery.each(sap.ui.getCore().getModel("ccMasterListModel").getData().masterListSets.category3, function(i, item) {
				if (item.ParentGuidKey == selKey && sGuidkey == item.KeyValue3)
					aCatagory3.push(item)
			});

			if (aCatagory3.length > 0) {
				var catagory3Model = new sap.ui.model.json.JSONModel();

				catagory3Model.setData(aCatagory3);
				oView.byId(serviceCaseCreation.Ids.COMBOBOX_CATEGORY3).setSelectedKey("");
				oView.byId(serviceCaseCreation.Ids.COMBOBOX_CATEGORY3).setModel(catagory3Model);
				
				/*Start of PCR034663++*/
				this.getView().byId(serviceCaseCreation.Ids.CATEGORIZATION_FLEXBOX).removeStyleClass("nsomargin");
				this.getView().byId(serviceCaseCreation.Ids.CATEGORY2_FLEX).removeStyleClass("nsomargin");
				/*End of PCR034663++*/
			}

			this.hideElementsWithIDs(hideElements);
			this.showElementsWithIDs(showElements);
		},

		/**
		 * This method is for checking value state
		 * @name onChangeCause
		 * @param oEvent-Current Event Parameter
		 * @returns
		 */
		onChangeCat3: function(oEvent) {
			var oView = this.getView();
			var sValueState = (oEvent.getSource().getValue().length) ? "None" : "Error";
			oEvent.getSource().setValueState(sValueState);
			var selKey = oEvent.getSource().getSelectedKey();
			var sGuidkey = oEvent.getSource().getSelectedItem().getBindingContext().getObject().KeyValue2;
			var showElements = [],
				hideElements = [];

			switch (selKey) {
				case "02":
				case "03":
				case "04":
				case "05":
				case "06":
					showElements = [
						serviceCaseCreation.Ids.CATEGORY4_FLEX
					]
					hideElements = [

					]
					break;
				default:
					showElements = [

					];
					hideElements = [
						serviceCaseCreation.Ids.CATEGORY4_FLEX
					]
					break;
			}

			/*
			 * setting Values of category4 based on category 3*/
			var aCatagory4 = [];
			jQuery.each(sap.ui.getCore().getModel("ccMasterListModel").getData().masterListSets.category4, function(i, item) {
				if (item.ParentGuidKey == selKey && sGuidkey == item.KeyValue3)
					aCatagory4.push(item)
			});

			if (aCatagory4.length > 0) {
				var catagory4Model = new sap.ui.model.json.JSONModel();

				catagory4Model.setData(aCatagory4);
				oView.byId(serviceCaseCreation.Ids.COMBOBOX_CATEGORY4).setSelectedKey("");
				oView.byId(serviceCaseCreation.Ids.COMBOBOX_CATEGORY4).setModel(catagory4Model);
			}

			this.hideElementsWithIDs(hideElements);
			this.showElementsWithIDs(showElements);
		},
		/* end of PCR027291++ */

		/**
		 * This method is to check value state.
		 * @name srNoChange
		 * @param oEvent - Current Event Parameter
		 * @returns
		 */
		srNoChange: function(oEvent) {
			var sValueState = (oEvent.getSource().getValue().length) ? "None" : "Error";
			oEvent.getSource().setValueState(sValueState);
		},

		/**
		 * This method is to open labor id dialog
		 * @name openLaborId
		 * @param oEvent - Current Event Parameter
		 * @returns
		 */
		openLaborId: function(oEvent) {
			var sPath = oEvent.getSource().getParent().getBindingContext().sPath;
			this.sIdentificationIndex = sPath.split("/")[2];

			this.inputId = oEvent.getSource().getId();
			this._laborDialog = serviceCaseCreation.fragmentHelper.createDialogFragment(this.getCurrentView().getId(), this,
				"serviceCaseCreation.view.fragments.LaborIdList");
			this._laborDialog.setModel(sap.ui.getCore().getModel("ccMasterListModel"));
			this._laborDialog.open();
		},

		/**
		 * This method is to select labor id from the list
		 * @name _handleValueHelpClose
		 * @param evt - Current Event Parameter
		 * @returns
		 */
		_handleValueHelpClose: function(evt) {
			var oSelectedItem = evt.getParameter("selectedItem");
			if (oSelectedItem) {
				var _sLaborObj = this._laborDialog.getModel().getProperty(oSelectedItem.getBindingContextPath()),
					laborListObj = this.getCurrentView().byId(serviceCaseCreation.Ids.LABOR_LIST).getModel().getData().results[this.sIdentificationIndex];
				laborListObj.Laborid = _sLaborObj.GuidKey;
				laborListObj.Description = _sLaborObj.KeyValue1;
				this.getCurrentView().byId(serviceCaseCreation.Ids.LABOR_LIST).getModel().refresh();
				this.getCurrentView().byId(serviceCaseCreation.Ids.LABOR_LIST_EXPENCES).getModel().refresh();
			}

			evt.getSource().getBinding("items").filter([]);
		},

		/**
		 * This method is to Tier Service call
		 * @name tierCondition
		 * @param
		 * @returns
		 */
		tierCondition: function() {
			var sBusyDialogMsg = this.resourceBundle.getText("ServiceOrder.BusyDialogMsg");
			serviceCaseCreation.fragmentHelper.dialogFragmentContent(this, "", "", "", sBusyDialogMsg);
			this._busyDialog = serviceCaseCreation.fragmentHelper.createDialogFragment(this.getCurrentView().getId(), this,
				"serviceCaseCreation.view.fragments.BusyDialog");
			this._busyDialog.open();

			var sServiceCaseNumber = this.serviceCaseNumber;

			this.finishoDataModelregistartionProcessWithParams(serviceCaseCreation.util.EventTriggers.TIER_LIST_READ_SUCCESS,
				"handleTierListFetchSuccess", serviceCaseCreation.util.EventTriggers.TIER_LIST_READ_FAIL,
				"handleTierListError", serviceCaseCreation.util.ServiceConfigConstants.tierListEntitySet +
				"?$expand=ToLabor&$filter=InServiceCaseNumber%20eq%20%27" + sServiceCaseNumber + "%27",
				serviceCaseCreation.util.ServiceConfigConstants.get, "", "", "",
				serviceCaseCreation.util.EventTriggers.TRIGGER_TIER_LIST_READ);
		},

		/**
		 * This method is to Add lines in the Labor list
		 * @name onAddlabor
		 * @param oEvent - Current Event Parameter
		 * @returns
		 */
		onAddLabor: function(oEvent) {
			var laborListModel = sap.ui.getCore().getModel("ccLaborListModel");
			var laborListData = sap.ui.getCore().getModel("ccLaborListModel").getData();
			var tempArr = laborListData;
			var AddNewLine = {
				"Servicecasenumber": this.serviceCaseNumber,
			}
			var alaborListData = {
				results: []
			};

			//Start of PCR020161++ changes
			var oServiceCaseModel = sap.ui.getCore().getModel("ccServiceCaseModel"),
				sSvcType = oServiceCaseModel.getProperty(this.contextPath + "/Servicetype"),
				sCategory1 = oServiceCaseModel.getProperty(this.contextPath + "/Category1");

			if (sSvcType === "ZINS" || (sSvcType === "ZPRJ" && sCategory1 === "21")) {
				AddNewLine.Laborid = "A7380";
				AddNewLine.Description = "INDIRECT LABOR";
				AddNewLine.Quantity = "";
				AddNewLine.bQuantEnabled = true;
				AddNewLine.bIdEnabled = false;
			}

			//End of PCR020161++ changes

			alaborListData.results.push(AddNewLine);

			for (var i = 0; i < laborListData.results.length; i++) {
				alaborListData.results.push(tempArr.results[i]);
			}

			laborListModel.setData(alaborListData);
			laborListModel.refresh();
			var view = this.getCurrentView();
			this.enableElementsWithIDs(this.aToggleAvailabilityOfElements);
		},

		/**
		 * This method is to successful Tier Service call and open Tier List
		 * @name  handleTierListFetchSuccess
		 * @param
		 * @returns
		 */
		handleTierListFetchSuccess: function() {
			this.destroyDialog();
			this._TierDialog = serviceCaseCreation.fragmentHelper.createDialogFragment(this.getCurrentView().getId(), this,
				"serviceCaseCreation.view.fragments.Tier");
			//Start of PCR020161++ changes
			var oTierModel = sap.ui.getCore().getModel("ccTierListModel"),
				aTiers = oTierModel.getData().d.results,
				aTierItems = [];
			var oTier;

			for (oTier in aTiers) {
				if (aTiers[oTier].TierId !== "A7380") {
					aTierItems.push(aTiers[oTier]);
				}
			}

			oTierModel.getData().d.results = aTierItems;
			//End of PCR020161++ changes
			this._TierDialog.setModel(sap.ui.getCore().getModel("ccTierListModel"));
			oTierModel.updateBindings(); //PCR020161++
			this._TierDialog.open();
		},

		/**
		 * This method is to corresponding Tier selection Item number
		 * @name onTierSelection
		 * @param oEvent - Current Event Parameter
		 * @returns
		 */
		onTierSelection: function(oEvent) {
			var oSelectedItem = oEvent.getSource();
			sPath = oSelectedItem.getSelectedItem().getBindingContext().getPath();
			this.oTierSelecetedItem = oSelectedItem.getModel().getProperty(sPath);

			this.AddExpenseline();
			var laborListExpenseData = sap.ui.getCore().getModel("ccLaborListExpenseModel").getData().results[0];
			laborListExpenseData.HigherItem = this.oTierSelecetedItem.ItemNumber;

			this.destroyDialog()
		},

		/**
		 * This method is to call for Install order Tier checking
		 * @name onAddExpenseLabor
		 * @param
		 * @returns
		 */
		onAddExpenseLabor: function() {
			if (this.ServiceCaseModel.Servicetype == "ZINS")
				this.tierCondition();
			else
				this.AddExpenseline();
		},

		/**
		 * This method is to Add lines in the Expense list
		 * @name AddExpenseline
		 * @param
		 * @returns
		 */
		AddExpenseline: function() {
			var laborListExpenseModel = sap.ui.getCore().getModel("ccLaborListExpenseModel"),
				laborListExpenseData = sap.ui.getCore().getModel("ccLaborListExpenseModel").getData(),
				tempArr = laborListExpenseData;

			var AddNewLine = {
				"Servicecasenumber": this.serviceCaseNumber,
				"Laborid": "A7005",
				"Description": "ENTER DESCRIPTION - EXPENSE",
				"Quantity": "1",
				"ExpenseAmount": 0.00,
				"ExpenseAmountCurrency": this.ExpenseCurrency,
			}

			var alaborListData = {
					results: []
				},
				laborListExpenseDataLength = laborListExpenseData.results.length;
			alaborListData.results.push(AddNewLine);

			for (var i = 0; i < laborListExpenseDataLength; i++) {
				alaborListData.results.push(tempArr.results[i]);
			}

			laborListExpenseModel.setData(alaborListData);
			laborListExpenseModel.refresh();
			this.enableElementsWithIDs(this.aToggleAvailabilityOfElements);
		},

		/**
		 * This method is to update Service Order .
		 * @name onSaveLabo
		 * @param oEvent - Current Event Parameter
		 * @returns
		 */
		onSaveLabor: function(oEvent) {
			var sBusyDialogMsg = this.resourceBundle.getText("ServiceOrder.BusyDialogMsg");
			serviceCaseCreation.fragmentHelper.dialogFragmentContent(this, "", "", "", sBusyDialogMsg);

			if (this.bPlannedHrsFlag) {
				serviceCaseCreation.fragmentHelper.createDialogFragment(this.getCurrentView().getId(), this,
					"serviceCaseCreation.view.fragments.BusyDialog").open();

				this.getCurrentView().setBusyIndicatorDelay(10000);
				this._busyIndicator = new sap.m.BusyIndicator();

				var oTable = oEvent.getSource(),
					oRow = oTable.getModel().getData(),
					updateLaborData = [];

				//Start of PCR020161++ changes
				jQuery.each(oRow.results, function(i, oItem) {
					if (oItem.Quantity) {
						if (oItem.Laborid == "A7005")
							oItem.ExpenseAmount = oItem.ExpenseAmount.toString();

						if (oItem.hasOwnProperty("bQuantEnabled")) {
							delete oItem.bQuantEnabled;
						}

						if (oItem.hasOwnProperty("bIdEnabled")) {
							delete oItem.bIdEnabled;
						}

						updateLaborData.push(oItem);
					}
				});

				/*updateLaborData = oRow.results;
				jQuery.each(updateLaborData, function(i, oItem) {

					if (oItem.Laborid == "A7005")
						oItem.ExpenseAmount = oItem.ExpenseAmount.toString();
					
					if (oItem.Servicetype) { //PCR020161++
						delete oItem.Servicetype; //PCR020161++
					}

				});*/

				//End of PCR020161++ changes

				var updateData = {
					"d": {
						"Servicecasenumber": this.serviceCaseNumber,
						"Servicetype": this.ServiceCaseModel.Servicetype,
						"Servicecontract": this.ServiceCaseModel.Servicecontract,
						"Warrantyid": this.ServiceCaseModel.Warrantyid,
						"FixedbillingTm": this.ServiceCaseModel.FixedbillingTm,
						"Customerponum": this.ServiceCaseModel.Customerponum,
						"Nav_CaseHdr_To_LaborItem": updateLaborData
					}
				};
				var self = this;

				self.finishoDataModelregistartionProcessWithParams(serviceCaseCreation.util.EventTriggers.SERVICE_CASES_UPDATE_SUCCESS,
					"handleServiceLaborAddSuccess", serviceCaseCreation.util.EventTriggers.SERVICE_CASES_UPDATE_FAIL,
					"handleServiceCaseLaborAddFailed", serviceCaseCreation.util.ServiceConfigConstants.serviceCaseEntitySet,
					serviceCaseCreation.util.ServiceConfigConstants.post, updateData, "", "", serviceCaseCreation.util.EventTriggers.TRIGGER_SERVICE_CASES_UPDATE
				);
			} else {
				var smaxLengthDialogMsg = this.resourceBundle.getText("ServiceOrder.smaxLengthDialogMsg");
				MessageToast.show(smaxLengthDialogMsg);
			}
		},

		/**
		 * This method is success callback function to update Service Order .
		 * @name handleServiceLaborAddSuccess
		 * @param
		 * @returns
		 */
		handleServiceLaborAddSuccess: function() {
			var oServiceCaseModel = sap.ui.getCore().getModel("ccServiceCaseModel"), //PCR020161++
				sSvcType = oServiceCaseModel.getProperty(this.contextPath + "/Servicetype"),
				sCategory1 = oServiceCaseModel.getProperty(this.contextPath + "/Category1"); //PCR020161++

			this.serviceCaseRead();
			this.destroyDialog();
			var handleSuccessTitle = this.resourceBundle.getText("ServiceOrder.SuccessTitle");
			var handleSuccessDescription = this.resourceBundle.getText("ServiceOrder.Description");

			serviceCaseCreation.fragmentHelper.dialogFragmentContent(this, handleSuccessTitle, serviceCaseCreation.StandardSAPIcons.ICON_SAP_MSG_SUCCESS,
				"#bada71", handleSuccessDescription);
			serviceCaseCreation.fragmentHelper.createDialogFragment(this.getCurrentView().getId(), this,
				"serviceCaseCreation.view.fragments.InfoDialog").open();

			sap.ui.getCore().getModel("ccServiceCaseModel").refresh();
			var aLaborData = [];
			var aLaborExpenseData = [];

			//Start of PCR020161-- changes
			/*jQuery.each(sap.ui.getCore().getModel("ccServiceCaseModel").getData().d.results[this.context].Nav_CaseHdr_To_LaborItem.results,
				function(i, oItem) {
				oItem.Servicetype = oServiceCaseModel.getProperty(sSvcType); //PCR020161++
				oItem.Category1 = oServiceCaseModel.getProperty(sCategory1); //PCR020161++
				
					if (oItem.Laborid == "A7005")
						aLaborExpenseData.push(oItem);
					else
						aLaborData.push(oItem);
				});
			var oLabor = {
				results: aLaborData
			};
			var oLaborExpense = {
				results: aLaborExpenseData
			};*/

			var oItems = this._fnValidateLaborItemInputs(sap.ui.getCore().getModel("ccServiceCaseModel").getData().d.results[this.context].Nav_CaseHdr_To_LaborItem
				.results);
			var oLabor = {
				results: oItems.aLaborData
			};
			var oLaborExpense = {
				results: oItems.aLaborExpenseData
			};

			//End of PCR020161++ changes
			sap.ui.getCore().getModel("ccLaborListModel").setData(oLabor);
			sap.ui.getCore().getModel("ccLaborListExpenseModel").setData(oLaborExpense);
			sap.ui.getCore().getModel("ccLaborListModel").refresh();
			sap.ui.getCore().getModel("ccLaborListExpenseModel").refresh();
			this.getCurrentView().getModel().refresh();
		},

		/**
		 * This method is error callback function to update Service Order .
		 * @name handleServiceCaseLaborAddFailed
		 * @param
		 * @returns
		 */
		handleServiceCaseLaborAddFailed: function(oData) {
			this.destroyDialog();
			var handleFailureTitle = this.resourceBundle.getText("ServiceOrder.FailureTitle");
			var errormessage = oData.getParameter("d").ErrorMessage;
			serviceCaseCreation.fragmentHelper.dialogFragmentContent(this, handleFailureTitle, serviceCaseCreation.StandardSAPIcons.ICON_SAP_MSG_ERROR,
				"#cc1919", errormessage);
			serviceCaseCreation.fragmentHelper.createDialogFragment(this.getCurrentView().getId(), this,
				"serviceCaseCreation.view.fragments.InfoDialog").open();
		},

		onChangeCauseTier: function() {
			this.getView().byId(serviceCaseCreation.Ids.COMBOBOX_IDTIER).setPlaceholder("");
		},

		mandatoryFieldCheck: function() {
			var oView = this.getView();
			var aInputElementsRef = [
				oView.byId(serviceCaseCreation.Ids.MAL_FCTN_START_DATEPICKER),
				oView.byId(serviceCaseCreation.Ids.MAL_FCTN_START_TIMEPICKER),
				oView.byId(serviceCaseCreation.Ids.ASSIGNED_TO),
				oView.byId(serviceCaseCreation.Ids.PROBLEM_DESC_TEXT_AREA),
			]

			if (this.ServiceCaseModel.Servicetype == "ZCMO") {
				// aInputElementsRef.push(oView.byId(serviceCaseCreation.Ids.COMBOBOX_IDSYMPTOM)); //PCR020942--
				aInputElementsRef.push(oView.byId(serviceCaseCreation.Ids.COMBOBOX_IDFAULT));
				aInputElementsRef.push(oView.byId(serviceCaseCreation.Ids.COMBOBOX_NONCONFIRM));
				aInputElementsRef.push(oView.byId(serviceCaseCreation.Ids.MALFUNCDTPKR)); //PCR018422++
				aInputElementsRef.push(oView.byId(serviceCaseCreation.Ids.MALFUNCTMPKR)); //PCR018422++
				aInputElementsRef.push(oView.byId(serviceCaseCreation.Ids.ASSEM_CMBX)); //PCR020942++
				aInputElementsRef.push(oView.byId(serviceCaseCreation.Ids.TOOLSTAT_CMBX)); //PCR020942++

				if (this.ServiceCaseModel.Warrantyid == "WTY0001" ||
					this.ServiceCaseModel.Warrantyid == "WTY0003") {
					aInputElementsRef.push(oView.byId(serviceCaseCreation.Ids.COMBOBOX_IDTIER));
				}
			} else if (this.ServiceCaseModel.Servicetype == "ZPRJ") {
				/*Begin of PCR034663++*/
				if(this.getView().byId(serviceCaseCreation.Ids.NSO_LBL).hasStyleClass("asteriskCC") && this.getView().byId(serviceCaseCreation.Ids.NSO_CMBX).getVisible())
					aInputElementsRef.push(this.getView().byId(serviceCaseCreation.Ids.NSO_CMBX));
				
				if(this.getView().byId(serviceCaseCreation.Ids.OPPNO_LBL).hasStyleClass("asteriskCC") && this.getView().byId(serviceCaseCreation.Ids.CUSTPO_INPUT).getVisible())
					aInputElementsRef.push(this.getView().byId(serviceCaseCreation.Ids.CUSTPO_INPUT));
					
				/*End of PCR034663++*/

			} else if (this.ServiceCaseModel.Servicetype == "ZPMO") {
				aInputElementsRef.push(oView.byId(serviceCaseCreation.Ids.COMBOBOX_CIDPMTYPE));
			}

			if (this.ServiceCaseModel.Servicetype == "ZCMO" || this.ServiceCaseModel.Servicetype == "ZPMO") {
				//	V01--  if(this.ServiceCaseModel.Servicecontract == "" && this.ServiceCaseModel.Warrantyid == "") {
				//	V01--  	   aInputElementsRef.push(oView.byId(serviceCaseCreation.Ids.INPUT_FIXBILLING));
				//	V01--  }
				var _FixBilling = oView.byId(serviceCaseCreation.Ids.INPUT_FIXBILLING).getSelectedKey();

				if (_FixBilling != "") {
					aInputElementsRef.push(oView.byId(serviceCaseCreation.Ids.COMBOBOX_SERVICECLASSIFICATION));
				}
			} else if (this.ServiceCaseModel.Servicetype == "ZPRJ") {
				var _category = this.ServiceCaseModel.Category1;

				switch (_category) {
					case "02":
						//V01--aInputElementsRef.push(view.byId(serviceCaseCreation.Ids.INPUT_FIXBILLING));
						var _FixBilling = oView.byId(serviceCaseCreation.Ids.INPUT_FIXBILLING).getSelectedKey();

						if (_FixBilling != "") {
							aInputElementsRef.push(oView.byId(serviceCaseCreation.Ids.COMBOBOX_SERVICECLASSIFICATION));
						}
						break;

					case "03":
						aInputElementsRef.push(oView.byId(serviceCaseCreation.Ids.INPUT_OPPNUM1));
						break;
					case "07":
						aInputElementsRef.push(oView.byId(serviceCaseCreation.Ids.INPUT_ACCASSIGNMENT_DISPLAY));
						break;
					case "08":
						//V01--	aInputElementsRef.push(oView.byId(serviceCaseCreation.Ids.INPUT_FIXBILLING));
						var _FixBilling = oView.byId(serviceCaseCreation.Ids.INPUT_FIXBILLING).getSelectedKey();

						if (_FixBilling != "") {
							aInputElementsRef.push(oView.byId(serviceCaseCreation.Ids.COMBOBOX_SERVICECLASSIFICATION));
						}
						break;
					default:
						break;
				}
			}

			var aComboBox = [
				// serviceCaseCreation.Ids.COMBOBOX_IDSYMPTOM, //PCR020942--
				serviceCaseCreation.Ids.COMBOBOX_IDFAULT,
				serviceCaseCreation.Ids.COMBOBOX_IDTIER,
				serviceCaseCreation.Ids.DELAY_STATUS_COMBOBOX,
				//V01--	serviceCaseCreation.Ids.INPUT_FIXBILLING,
				serviceCaseCreation.Ids.COMBOBOX_SERVICECLASSIFICATION,
				serviceCaseCreation.Ids.COMBOBOX_CIDPMTYPE,
				serviceCaseCreation.Ids.COMBOBOX_NONCONFIRM
			];

			//Start of PCR033903++ changes
			if (this.ServiceCaseModel.Servicetype !== serviceCaseCreation.constants.ZINS) {
				aInputElementsRef.push(oView.byId(serviceCaseCreation.Ids.TOOLSTAT_CMBX));
			}
			//End of PCR033903++ changes
			

			var isMandatoryComboboxCheckSuccess = serviceCaseCreation.util.Util.doCompleteComboBoxElementsValidation(this, aComboBox);
			var isMandatoryFieldCheckSuccess = serviceCaseCreation.util.Util.doCompleteInputElementsValidation(aInputElementsRef);
			return [isMandatoryComboboxCheckSuccess, isMandatoryFieldCheckSuccess]
		},

		/*Cross App Navigation
		 * PCR
		 * V01++*/

		onNavToOtherApps: function(oEvent) {
			var oIcon = oEvent.oSource,
				sSelectedSrc = (oEvent.getSource().data("button")) ? oIcon.getIcon() : oIcon.getSrc(),
				oTargetObj = new Object(),
				oParamsObj = new Object();

			switch (sSelectedSrc) {
				case "sap-icon://customer-financial-fact-sheet":
					oTargetObj.semanticObject = "ZFLDSRV";
					break;
				case "sap-icon://task":
					oTargetObj.semanticObject = "ZFLDCONF";
					break;
				case "sap-icon://inspect-down":
					oTargetObj.semanticObject = "ZFLDRETURN";
					break;
					/*start of PCR018233++ changes*/
				case "sap-icon://collaborate":
					//oTargetObj.semanticObject = "ZFLDESCMGMT"; //PCR032539--
					oTargetObj.semanticObject = "ZESCLN_MGMT"; //PCR032539++
					break;
					/*end of PCR018233++ changes*/
				default:
					break;
			}

			oTargetObj.action = "display";

			if (this.getModel()) {
				oParamsObj.serviceOrder = this.getModel().getProperty(this.contextPath).Servicecasenumber;
				if (sap.ushell && sap.ushell.Container && sap.ushell.Container.getService) {
					var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
					oCrossAppNavigator.toExternal({
						target: oTargetObj,
						params: oParamsObj
					});
				} else {
					jQuery.sap.log.info("Cannot Navigate - Application Running Standalone");
				}
			}
		},

		/*--------*/

		/**
		 * This method is to update Service Order .
		 * @name onServiceCaseUpdate
		 * @param
		 * @returns
		 */
		onServiceCaseUpdate: function() {
			var flag,
				view = this.getCurrentView(),
				mandatoryCheckReturn = this.mandatoryFieldCheck();
			var isMandatoryComboboxCheckSuccess = mandatoryCheckReturn[0],
				isMandatoryFieldCheckSuccess = mandatoryCheckReturn[1];

			if (isMandatoryComboboxCheckSuccess[0]) {
				if (isMandatoryFieldCheckSuccess) {
					var self = this,
						oView = this.getCurrentView(),
						sBusyDialogMsg = this.resourceBundle.getText("ServiceOrder.BusyDialogMsg");

					serviceCaseCreation.fragmentHelper.dialogFragmentContent(this, "", "", "", sBusyDialogMsg);
					serviceCaseCreation.fragmentHelper.createDialogFragment(this.getCurrentView().getId(), this,
						"serviceCaseCreation.view.fragments.BusyDialog").open();

					var updateData = this.getModel().getData().d.results[this.context],
						_date = oView.byId(serviceCaseCreation.Ids.MAL_FCTN_START_DATEPICKER).getValue(),
						_time = oView.byId(serviceCaseCreation.Ids.MAL_FCTN_START_TIMEPICKER).getValue(),
						_dateFormat = serviceCaseCreation.formatter.formatter.dateFormatForPost(oView.byId("malStartdateDatePicker").getDateValue()),
						_timeFormate = _time.substring(0, 2) + _time.substring(3, 5) + "00",
						_dateTime = _dateFormat.concat(_timeFormate),
						ServiceCaseModelUpdated = sap.ui.getCore().getModel("ccServiceCaseModel"),
						updateServiceCaseData = ServiceCaseModelUpdated.getData().d.results[this.context],
						timeZone = oView.byId(serviceCaseCreation.Ids.TIMEZONE_TEXT).getText(),
						assignTo = this.userId,
						delay = oView.byId(serviceCaseCreation.Ids.DELAY_STATUS_COMBOBOX).getSelectedKey(),
						desc = oView.byId(serviceCaseCreation.Ids.PROBLEM_DESC_TEXT_AREA).getValue(),
						symptom = oView.byId(serviceCaseCreation.Ids.COMBOBOX_IDSYMPTOM).getParentKey(),
						fault = oView.byId(serviceCaseCreation.Ids.COMBOBOX_IDFAULT).getSelectedKey(),
						tier = oView.byId(serviceCaseCreation.Ids.COMBOBOX_IDTIER).getSelectedKey(),
						pmType = oView.byId(serviceCaseCreation.Ids.COMBOBOX_CIDPMTYPE).getSelectedKey(),
						category1 = this.ServiceCaseModel.Category1,
						fixedbillingTm = oView.byId(serviceCaseCreation.Ids.INPUT_FIXBILLING).getSelectedKey(),
						srvclassification = oView.byId(serviceCaseCreation.Ids.COMBOBOX_SERVICECLASSIFICATION).getSelectedKey(),
						custPo = oView.byId(serviceCaseCreation.Ids.CUSTPO_INPUT).getValue().trim(),//PCR034663++ added trim
						category2 = oView.byId(serviceCaseCreation.Ids.COMBOBOX_CATEGORY2).getSelectedKey(),
						sAssemKey = oView.byId(serviceCaseCreation.Ids.ASSEM_CMBX).getSelectedKey(), //PCR020942++
						aToolStatKey = oView.byId(serviceCaseCreation.Ids.TOOLSTAT_CMBX).getSelectedKey(), //PCR020942++
						/*Begin of PCR027291++*/
						_Category2GUID, _Category2Desc, _Category3GUID, _Category3Desc, _Category4GUID, _Category4Desc, category3, category4;
					if (oView.byId(serviceCaseCreation.Ids.CATEGORY3_FLEX).getVisible())
						category3 = oView.byId(serviceCaseCreation.Ids.COMBOBOX_CATEGORY3).getSelectedKey();
					if (oView.byId(serviceCaseCreation.Ids.CATEGORY4_FLEX).getVisible())
						category4 = oView.byId(serviceCaseCreation.Ids.COMBOBOX_CATEGORY4).getSelectedKey();
					if (category2) {
						_Category2GUID = oView.byId(serviceCaseCreation.Ids.COMBOBOX_CATEGORY2).getSelectedItem().getBindingContext().getObject().KeyValue2;
						_Category2Desc = oView.byId(serviceCaseCreation.Ids.COMBOBOX_CATEGORY2).getSelectedItem().getBindingContext().getObject().KeyValue1;
					}
					if (category3) {
						_Category3GUID = view.byId(serviceCaseCreation.Ids.COMBOBOX_CATEGORY3).getSelectedItem().getBindingContext().getObject().KeyValue2;
						_Category3Desc = view.byId(serviceCaseCreation.Ids.COMBOBOX_CATEGORY3).getSelectedItem().getBindingContext().getObject().KeyValue1;
					}

					if (category4) {
						_Category4GUID = view.byId(serviceCaseCreation.Ids.COMBOBOX_CATEGORY4).getSelectedItem().getBindingContext().getObject().KeyValue2;
						_Category4Desc = view.byId(serviceCaseCreation.Ids.COMBOBOX_CATEGORY4).getSelectedItem().getBindingContext().getObject().KeyValue1;
					}
					/*end of PCR027291++*/
					/*Start of PCR018422++ changes; Malfunction Start date and time changes*/
					var sMalfunctionstartdate = (this.ServiceCaseModel.Servicetype == "ZCMO") ? serviceCaseCreation.formatter.formatter.dateFormatInPost(
						oView.byId(serviceCaseCreation.Ids.MALFUNCDTPKR).getDateValue()) : "";
					var sMalfunctionstarttime = (this.ServiceCaseModel.Servicetype == "ZCMO") ? serviceCaseCreation.formatter.formatter.malFuncTimeFormatInPost(
						oView.byId(serviceCaseCreation.Ids.MALFUNCTMPKR).getDateValue()) : "";
					/*End of PCR018422++ changes*/

					var _NonConform, _WaferScrap;
					if (this.ServiceCaseModel.Servicetype == "ZCMO") {
						_NonConform = oView.byId(serviceCaseCreation.Ids.COMBOBOX_NONCONFIRM).getSelectedKey();
						_WaferScrap = oView.byId(serviceCaseCreation.Ids.INPUT_WAFERSCRAP).getValue();
					} else {
						_NonConform = "";
						_WaferScrap = "";
					}

					var acctAssign;
					if (category1 == "03") {
						custPo = oView.byId(serviceCaseCreation.Ids.INPUT_OPPNUM1).getValue();
						acctAssign = custPo;
					} else
						acctAssign = oView.byId(serviceCaseCreation.Ids.INPUT_ACCASSIGNMENT_DISPLAY).getValue();
						
					var aToolStatKey = oView.byId(serviceCaseCreation.Ids.TOOLSTAT_CMBX).getSelectedKey(); //PCR033903++
					
					var payload = {
						"d": {
							"Servicecasenumber": this.serviceCaseNumber,
							"Problemdescription": desc.trim(),
							"Startdatetime": _dateTime,
							"TimeZone": timeZone,
							"Assignedto": assignTo,
							"Symptom": symptom,
							"Fault": fault,
							"Delay": delay,
							"Tier": tier,
							"PmtypeCategory": pmType,
							"Customerponum": custPo.trim(),
							"FixedbillingTm": fixedbillingTm,
							"Srvclassification": srvclassification,
							"AcctAssgn": acctAssign,
							"NonConform": _NonConform,
							"WaferScrapCount": _WaferScrap.trim(),
							"Category2": category2,
							"Servicecontract": this.ServiceCaseModel.Servicecontract,
							"Warrantyid": this.ServiceCaseModel.Warrantyid,
							"Malfunctionstartdate": sMalfunctionstartdate, //PCR018422++
							"Malfunctionstarttime": sMalfunctionstarttime, //PCR018422++
							"Toolstatus": aToolStatKey, //PCR020942++
							"Assembly": sAssemKey, //PCR020942++
							/*Begin of PCR027291++*/
							"Category1": this.ServiceCaseModel.Category1,
							"Category3": category3,
							"Category4": category4,
							"Cat1_GUID": this.ServiceCaseModel.Cat1_GUID,
							"Cat2_GUID": _Category2GUID,
							"Cat3_GUID": _Category3GUID,
							"Cat4_GUID": _Category4GUID,
							"Category1Desc": this.ServiceCaseModel.Category1Desc,
							"Category2Desc": _Category2Desc,
							"Category3Desc": _Category3Desc,
							"Category4Desc": _Category4Desc,
							/*end of PCR027291++*/
							/*Begin of PCR027779++*/
							"AsmblyStatus": view.byId(serviceCaseCreation.Ids.ASSEMBLY_STAT).getSelectedKey(),
							"CustToolStatus": view.byId(serviceCaseCreation.Ids.CUSTOMER_STAT).getSelectedKey(),
							"ExpDelDate": serviceCaseCreation.formatter.formatter.dateFormatInPost(view.byId(serviceCaseCreation.Ids.EXPECTED_DEL).getDateValue()),
							//"InternalNotes":view.byId(serviceCaseCreation.Ids.INTERNAL_NOTES).getValue(),//PCR030427--
							//"ExternalNotes":view.byId(serviceCaseCreation.Ids.EXTERNAL_NOTES).getValue(),//PCR030427--
							"CustContact": view.byId(serviceCaseCreation.Ids.CUST_CONT_PERS).getValue(),
								/*end of PCR027779++*/
							"ZzprjNso" : view.byId(serviceCaseCreation.Ids.NSO_CMBX).getSelectedKey() //PCR034663++
						}
					};

					this.finishoDataModelregistartionProcessWithParams(serviceCaseCreation.util.EventTriggers.SERVICE_CASES_UPDATE_SUCCESS,
						"handleServiceCaseUpdateSuccess", serviceCaseCreation.util.EventTriggers.SERVICE_CASES_UPDATE_FAIL,
						"handleServiceCaseUpdateFail", serviceCaseCreation.util.ServiceConfigConstants.serviceCaseEntitySet,
						serviceCaseCreation.util.ServiceConfigConstants.post, payload, "", "", serviceCaseCreation.util.EventTriggers.TRIGGER_SERVICE_CASES_UPDATE
					);
				} else {
					var mandatoryMsgToast = this.resourceBundle.getText("ServiceOrder.mandatoryMsgToast");
					MessageToast.show(mandatoryMsgToast);
				}
			} else {
				var allMandatoryMsgToast = this.resourceBundle.getText("ServiceOrder.allMandatoryMsgToast");
				MessageToast.show(allMandatoryMsgToast);
			}
		},

		/**
		 * This method is to Read Services Case data after update success.
		 * @name serviceCaseRead
		 * @param
		 * @returns
		 */
		serviceCaseRead: function() {
			//var entity = serviceCaseCreation.util.ServiceConfigConstants.SserviceCaseEntitySet+"&$filter=Servicecasenumber%20eq%20"+"%27"+this.serviceCaseNumber+"%27"; //PCR017437--
			//var entity = serviceCaseCreation.util.ServiceConfigConstants.serviceCaseEntitySet+"?$expand=NavToHdrSymptoms,Nav_CaseHdr_To_LaborItem&$filter=Servicecasenumber%20eq%20"+"%27"+this.serviceCaseNumber+"%27"; //PCR017437++ //PCR018233--
			var entity = serviceCaseCreation.util.ServiceConfigConstants.serviceCaseEntitySet +
				"?$expand=NavToHdrSymptoms,Nav_CaseHdr_To_LaborItem,ToServiceCaseRead&$filter=Servicecasenumber%20eq%20" + "%27" + this.serviceCaseNumber +
				"%27"; //PCR018233++
			this.finishoDataModelregistartionProcessWithParams(
				serviceCaseCreation.util.EventTriggers.SERVICE_CASE_READ_SUCCESS,
				"handleServiceCaseReadSuccess",
				serviceCaseCreation.util.EventTriggers.SERVICE_CASE_READ_FAIL,
				"handleServiceCaseReadError",
				entity,
				serviceCaseCreation.util.ServiceConfigConstants.get, "", "", "",
				serviceCaseCreation.util.EventTriggers.TRIGGER_SERVICE_CASE_READ);
		},

		/**
		 * This method is to handle successful fetching of Services Case data.
		 * @name handleServiceCaseFetchSuccess
		 * @param oData -Holds the fetched data
		 * @returns
		 */
		handleServiceCaseUpdateSuccess: function(oData) {
			this.serviceCaseRead();
			this.destroyDialog();
			var handleSuccessTitle = this.resourceBundle.getText("ServiceOrder.SuccessTitle");
			var handleSuccessDescription = this.resourceBundle.getText("ServiceOrder.Description");

			serviceCaseCreation.fragmentHelper.dialogFragmentContent(this, handleSuccessTitle, serviceCaseCreation.StandardSAPIcons.ICON_SAP_MSG_SUCCESS,
				"#bada71", handleSuccessDescription);
			serviceCaseCreation.fragmentHelper.createDialogFragment(this.getCurrentView().getId(), this,
				"serviceCaseCreation.view.fragments.InfoDialog").open();

			this._toggleElementsAvailability();
			this.showElementsWithIDs([serviceCaseCreation.Ids.EDIT_BUTTON, serviceCaseCreation.Ids.KA_BUTTON]); //PCR020942++; added serviceCaseCreation.Ids.KA_BUTTON
			this.getCurrentView().getModel().refresh();
			this.ServiceCaseModel = this.getView().getModel().getData().d.results[this.context];

			serviceCaseCreation.util.Util.resetProblemDescriptionInitialPosition(this, serviceCaseCreation.Ids.PROBLEM_DESC_TEXT,
				serviceCaseCreation.Ids.PROBLEM_DESC_LABEL, serviceCaseCreation.Ids.LINK_TEXT, serviceCaseCreation.Ids.DESC_ICON);
			this.toggleNsoState();	//PCR034663++
		},

		/**
		 * This method is the success response of service call of serviceCaseList.
		 * @name handleServiceCaseFetchSuccess
		 * @param oData - reponse data
		 * @returns
		 */
		handleServiceCaseReadSuccess: function(oData) {
			var that = this; //PCR020161++
			this.getCurrentView().getModel().refresh();
			this.ServiceCaseModel = this.getView().getModel().getData().d.results[this.context];
			var aLaborData = [],
				aLaborExpenseData = [];

			//Start of PCR020161++ changes

			/*jQuery.each(sap.ui.getCore().getModel("ccServiceCaseModel").getData().d.results[this.context].Nav_CaseHdr_To_LaborItem.results,
				function(i, oItem) {
					oItem.Servicetype = that.ServiceCaseModel.Servicetype; //PCR020161++
					oItem.Category1 = that.ServiceCaseModel.Category1; //PCR020161++
					
					if (oItem.Laborid == "A7005")
						aLaborExpenseData.push(oItem);
					else
						aLaborData.push(oItem);
				});
			
			var oLabor = {
				results: aLaborData
			};
			var oLaborExpense = {
				results: aLaborExpenseData
			};*/

			this._onBindingChange(this.ServiceCaseModel); //PCR020942++
			var oItems = this._fnValidateLaborItemInputs(this.ServiceCaseModel.Nav_CaseHdr_To_LaborItem.results);
			var oLabor = {
				results: oItems.aLaborData
			};
			var oLaborExpense = {
				results: oItems.aLaborExpenseData
			};

			//End of PCR020161++ changes

			sap.ui.getCore().getModel("ccLaborListModel").setData(oLabor);
			sap.ui.getCore().getModel("ccLaborListExpenseModel").setData(oLaborExpense);
			sap.ui.getCore().getModel("ccLaborListModel").refresh();
			sap.ui.getCore().getModel("ccLaborListExpenseModel").refresh();
			this.getCurrentView().getModel().refresh();

			//start of PCR017437 changes

			if (this.ServiceCaseModel.Servicetype === "ZCMO" && this.getModelFromCore("ccServiceOrderModel")) {
				var oServiceOrderModelData = this.getModelFromCore("ccServiceOrderModel").getData();
				if (oServiceOrderModelData) {
					var oSvcOrder = oServiceOrderModelData.d.results[0];
					oServiceOrderModelData["SymDataFetchedFor" + oSvcOrder.Servicecasenumber] = true;
					this.ServiceCaseModel = oSvcOrder;
				}
			}
			//end of PCR017437 changes
		},

		/**
		 * This method is the fail response of service call of serviceCaseList.
		 * @name handleServiceCaseReadError
		 * @param oData - Current Event Parameter
		 * @returns
		 */
		handleServiceCaseReadError: function(oData) {
			this.destroyDialog();

			var sFailureDialogMsg = this.resourceBundle.getText("CreateServiceCase.FailureDialogMsg"),
				errormessage = oData.getParameter("d").ErrorMessage;

			serviceCaseCreation.fragmentHelper.dialogFragmentContent(this, sFailureDialogMsg, serviceCaseCreation.StandardSAPIcons.ICON_SAP_MSG_ERROR,
				"#cc1919", errormessage);
			serviceCaseCreation.fragmentHelper.createDialogFragment(this.getCurrentView().getId(), this,
				"serviceCaseCreation.view.fragments.InfoDialog").open();
		},

		/**
		 * This method is to handle when unsuccessful fetching of Services Case data.
		 * @name handleServiceCaseUpdateFail
		 * @param oData - Current Event Parameter
		 * @returns
		 */
		handleServiceCaseUpdateFail: function(oData) {
			this.destroyDialog();
			var errormessage = oData.getParameter("d").ErrorMessage,
				substring = "Service Case updated Successfully";

			if (errormessage.match(substring)) {
				this.serviceCaseRead();
				this.getCurrentView().getModel().refresh();
				this.ServiceCaseModel = this.getView().getModel().getData().d.results[this.context];

			}
			var handleFailureTitle = this.resourceBundle.getText("ServiceOrder.FailureTitle");

			serviceCaseCreation.fragmentHelper.dialogFragmentContent(this, handleFailureTitle, serviceCaseCreation.StandardSAPIcons.ICON_SAP_MSG_ERROR,
				"#cc1919", errormessage);
			serviceCaseCreation.fragmentHelper.createDialogFragment(this.getCurrentView().getId(), this,
				"serviceCaseCreation.view.fragments.InfoDialog").open();

			this._toggleElementsAvailability();
			this.toggleNsoState();	//PCR034663++
			this.showElementsWithIDs([serviceCaseCreation.Ids.EDIT_BUTTON, serviceCaseCreation.Ids.KA_BUTTON]); //PCR020942++; added serviceCaseCreation.Ids.KA_BUTTON
		},

		onCancelTier: function() {
			this.destroyDialog();
		},

		/**
		 * This method called when user click on Cancel button and change the visibility of Buttons.
		 * @name onCancel
		 * @param
		 * @returns
		 */
		onCancel: function() {
			this._toggleElementsAvailability();
			this.showElementsWithIDs([serviceCaseCreation.Ids.EDIT_BUTTON, serviceCaseCreation.Ids.KA_BUTTON]); //PCR020942++; added serviceCaseCreation.Ids.KA_BUTTON
			serviceCaseCreation.util.Util.resetProblemDescriptionInitialPosition(this,
				serviceCaseCreation.Ids.PROBLEM_DESC_TEXT,
				serviceCaseCreation.Ids.PROBLEM_DESC_LABEL,
				serviceCaseCreation.Ids.LINK_TEXT,
				serviceCaseCreation.Ids.DESC_ICON
			);

			var that = this;

			jQuery.each(this.aLabels, function(i, oItem) {
				that.getView().byId(oItem).removeStyleClass("asteriskCC");
			});
			this.toggleNsoState();	//PCR034663++
		},

		/**
		 * This method called for Maximum length checking for Planned hours.
		 * @name maxlengthChecking
		 * @param oEvent - Current event parameter
		 * @returns
		 */
		maxlengthChecking: function(oEvent) {
			var oValue = oEvent.getSource().getValue();
			var regx = /^\d{1,9}(\.$|\.\d{1,3}$|$)/;

			if (regx.test(oValue)) {
				this.bPlannedHrsFlag = true;
				oEvent.getSource().setValueState("None");
			} else {
				this.bPlannedHrsFlag = false;
				oEvent.getSource().setValueState("Error");
			}
		},

		/**
		 * This method called when iconTab filter selection.
		 * @name onSelectChanged
		 * @param
		 * @returns
		 */
		onSelectChanged: function(oEvent) {
			var key = oEvent.getParameters().key;
			var bEnabled = this.hideElementsWithIDs(this.aInputElements);
			var that = this;

			//Start of PCR018422++ changes
			var oMasterListModel = this.getModelFromCore("ccMasterListModel"),
				aExeServEmpSrvOrd = oMasterListModel.getData().aExeServEmpSrvOrd,
				aPsdnLogSrvOrd = oMasterListModel.getData().aPsdnLogSrvOrd,
				aAttachmentsSrvOrd = oMasterListModel.getData().aAttachmentsSrvOrd;
			//End of PCR018422++ changes

			if (this.ServiceCaseModel) {
				if (key === '1') {
					bEnabled = true;
					this.showElementsWithIDs(this.aTextElements);
					this.showElementsWithIDs([serviceCaseCreation.Ids.EDIT_BUTTON, serviceCaseCreation.Ids.KA_BUTTON]); //PCR020942++; added serviceCaseCreation.Ids.KA_BUTTON
					this.getCurrentView().byId(serviceCaseCreation.Ids.PROBLEM_DESC_LABEL).setVisible(true);
					this.getCurrentView().byId(serviceCaseCreation.Ids.PROBLEM_DESC_TEXT).setVisible(false);

					jQuery.each(this.aLabels, function(i, oItem) {
						that.getView().byId(oItem).removeStyleClass("asteriskCC");
					});

					/*Begin of PCR020942-- changes*/

					if (key === '1' && this.ServiceCaseModel.Orderstatus === "Work Completed") {
						this.hideElementsWithIDs([serviceCaseCreation.Ids.EDIT_BUTTON]);
					}
				}
				/*else if (key === '1' && sStatus === "Work Completed") {
					/*if (key === '1' && this.ServiceCaseModel.Orderstatus === "Work Completed") { //PCR018233--
					this.hideElementsWithIDs([serviceCaseCreation.Ids.EDIT_BUTTON]);
				}*/
				/*End of PCR020942-- changes*/
				else if (key === '2' || key === '3') {
					/*if (key === '2') {*/ //PCR018233--
					this.hideElementsWithIDs([serviceCaseCreation.Ids.EDIT_BUTTON, serviceCaseCreation.Ids.KA_BUTTON]); //PCR020942++; added serviceCaseCreation.Ids.KA_BUTTON
					this.hideElementsWithIDs([serviceCaseCreation.Ids.UPDATE_BUTTON, serviceCaseCreation.Ids.CANCEL_BUTTON]);
				}
				/*start of PCR018233++ changes*/
				/*if (key === '3') {
					this.hideElementsWithIDs([serviceCaseCreation.Ids.EDIT_BUTTON]);
					this.hideElementsWithIDs([serviceCaseCreation.Ids.UPDATE_BUTTON, serviceCaseCreation.Ids.CANCEL_BUTTON]);
				}*/
				else if (key === 'ESE') {
					var oESEModel = this.getModelFromCore("displayESEModel");
					this.hideElementsWithIDs([
						serviceCaseCreation.Ids.EDIT_BUTTON, serviceCaseCreation.Ids.UPDATE_BUTTON, serviceCaseCreation.Ids.CANCEL_BUTTON,
						serviceCaseCreation.Ids.KA_BUTTON //PCR020942++; added serviceCaseCreation.Ids.KA_BUTTON
					]);					
					
					//if (aExeServEmpSrvOrd.indexOf(this.serviceCaseNumber) < 0 && !oESEModel || !oESEModel) { PCR033903--
						sap.ui.controller("serviceCaseCreation.controller.ExeServEmp").fetchESEList("handleFetchESESuccess");
					//}PCR033903--
				}
				/*end of PCR018233++ changes*/
				/*start of PCR018422++ changes*/
				else if (key === 'PDL') {
					var oPassDownLogModel = this.getModelFromCore("passDownLogModel");
					this.hideElementsWithIDs([
						serviceCaseCreation.Ids.EDIT_BUTTON, serviceCaseCreation.Ids.UPDATE_BUTTON, serviceCaseCreation.Ids.CANCEL_BUTTON,
						serviceCaseCreation.Ids.KA_BUTTON //PCR020942++; added serviceCaseCreation.Ids.KA_BUTTON
					]);
					
					
					//if (aPsdnLogSrvOrd.indexOf(this.serviceCaseNumber) < 0 && !oPassDownLogModel || !oPassDownLogModel) { PCR033903--
						sap.ui.controller("serviceCaseCreation.controller.PassDownLog").fnFetchPassDownLogData();
					//} PCR033903--
				} else if (key === 'Attachments') {
					var oAttachmentsModel = this.getModelFromCore("attachmentsModel");
					this.hideElementsWithIDs([
						serviceCaseCreation.Ids.EDIT_BUTTON, serviceCaseCreation.Ids.UPDATE_BUTTON, serviceCaseCreation.Ids.CANCEL_BUTTON,
						serviceCaseCreation.Ids.KA_BUTTON //PCR020942++; added serviceCaseCreation.Ids.KA_BUTTON
					]);
					
					//if (aAttachmentsSrvOrd.indexOf(this.serviceCaseNumber) < 0 && !oAttachmentsModel || !oAttachmentsModel) { PCR033903--
						sap.ui.controller("serviceCaseCreation.controller.Attachments").fnFetchAttachments();
					//} PCR033903--
				}
				/*end of PCR018422++ changes*/
			}
		},

		/* =========================================================== */
		/* begin: internal methods                                     */
		/* =========================================================== */

		/**
		 * This method .
		 * @name onInfoDialog
		 * @param
		 * @returns
		 */
		onInfoDialog: function(oEvent) {
			this.destroyDialog();
			this._toggleElementsAvailability();

			var that = this;
			jQuery.each(this.aLabels, function(i, oItem) {
				that.getView().byId(oItem).removeStyleClass("asteriskCC");
			});

			if (this.getView().byId(serviceCaseCreation.Ids.ICOTAB_BAR).getSelectedKey() == "2" || this.getView().byId(serviceCaseCreation.Ids.ICOTAB_BAR)
				.getSelectedKey() == "3") {
				this.hideElementsWithIDs([serviceCaseCreation.Ids.EDIT_BUTTON, serviceCaseCreation.Ids.KA_BUTTON]); //PCR020942++; added serviceCaseCreation.Ids.KA_BUTTON]);
			} else {
				this.showElementsWithIDs([serviceCaseCreation.Ids.EDIT_BUTTON, serviceCaseCreation.Ids.KA_BUTTON]); //PCR020942++; added serviceCaseCreation.Ids.KA_BUTTON]);
			}

			serviceCaseCreation.util.Util.resetProblemDescriptionInitialPosition(this, serviceCaseCreation.Ids.PROBLEM_DESC_TEXT,
				serviceCaseCreation.Ids.PROBLEM_DESC_LABEL, serviceCaseCreation.Ids.LINK_TEXT, serviceCaseCreation.Ids.DESC_ICON);
			this.toggleNsoState();	//PCR034663++
		},

		/**
		 * This method is the success response of service call of serviceCaseList.
		 * @name handleServiceCaseFetchSuccess
		 * @param reponse data
		 * @returns
		 */
		handleServiceCaseFetchSuccess: function() {
			this.getCurrentView().setModel(sap.ui.getCore().getModel("ccServiceCaseModel"));
		},

		/**
		 * This method .
		 * @name _toggleElementsAvailability
		 * @param
		 * @returns
		 */
		_toggleElementsAvailability: function() {
			this.hideElementsWithIDs(this.aInputElements);
			this.showElementsWithIDs(this.aTextElements);
			this.disableElementsWithIDs(this.aToggleAvailabilityOfElements);

			var aDelayFlxbx = [serviceCaseCreation.Ids.DELAYFLXBX]; //PCR018422++
			(this.ServiceCaseModel.Servicetype === "ZCMO") ? this.showElementsWithIDs(aDelayFlxbx): this.hideElementsWithIDs(aDelayFlxbx); //PCR018422++

			//PCR017437++ changes start
			if (this.ServiceCaseModel.Servicetype === "ZPRJ" || this.ServiceCaseModel.Servicetype === "ZPMO") {
				this.showElementsWithIDs([serviceCaseCreation.Ids.DELAY_PMO_PRJ]);
				this.hideElementsWithIDs([serviceCaseCreation.Ids.DELAY_CMO]);
			}

			if (this.ServiceCaseModel.Servicetype === "ZINS")
				this.hideElementsWithIDs([serviceCaseCreation.Ids.DELAY_PMO_PRJ, serviceCaseCreation.Ids.DELAY_CMO]);
			//PCR017437++ changes end
		},

		/**
		 * This method is called on change of symptom level drop down
		 * @name onChangeSymptom
		 * @param oEvent - Current Event Parameter
		 * @returns
		 */
		onChangeSymptom: function(oEvent) {
			var Symptomkey = oEvent.getSource().getSelectedKey(),
				aFault = [];

			jQuery.each(sap.ui.getCore().getModel("ccMasterListModel").getData().masterListSets.fault, function(i, item) {
				if (item.ParentGuidKey == Symptomkey)
					aFault.push(item)
			});

			var faultModel = new sap.ui.model.json.JSONModel();
			faultModel.setData(aFault);

			this.getCurrentView().byId(serviceCaseCreation.Ids.COMBOBOX_IDFAULT).setModel(faultModel);
			this.getCurrentView().byId(serviceCaseCreation.Ids.COMBOBOX_IDFAULT).setSelectedKey("");

			serviceCaseCreation.util.Util.filterSymptomLevelTwoBindings.call(this, oEvent.getSource().getValue(), serviceCaseCreation.Ids.COMBOBOX_IDFAULT); //PCR017437++

			var sValueState = (oEvent.getSource().getValue().length) ? "None" : "Error";
			oEvent.getSource().setValueState(sValueState);
		},

		/**
		 * This method is called on change of Fix Bill Drop Down
		 * @name onChangeFixbilling
		 * @param oEvent - Current Event Parameter
		 * @returns
		 */
		onChangeFixbilling: function(oEvent) {
			this.getCurrentView().byId(serviceCaseCreation.Ids.COMBOBOX_SERVICECLASSIFICATION).setSelectedKey("CPS1");

			var sValueState = (oEvent.getSource().getValue().length) ? "None" : "Error";
			oEvent.getSource().setValueState(sValueState);
		},
		
		
		/**
		 * This method will help to identify the route pattern when navigate to Service Order view.
		 * @name _onAttachRouteMatched
		 * @param oEvent- Current event parameter
		 * @returns
		 */
		_onAttachRouteMatched: function(oEvent) {
			if (oEvent.getParameter("name") === "serviceOrder" || oEvent.getParameter("name") === "resetMasterList") {
				
				this._oSymLevels = {}; //PCR017437++
				sap.ui.getCore().byId(serviceCaseCreation.Ids.APP_PAGE).byId(serviceCaseCreation.Ids.FIORI_CONTENT).setMode(sap.m.SplitAppMode.StretchCompressMode);
				sap.ui.getCore().byId(serviceCaseCreation.Ids.APP_PAGE).byId(serviceCaseCreation.Ids.FIORI_CONTENT).addStyleClass("svcCreate");//PCR033903++

				/*start of PCR018233++ changes*/
				/*if (this.getView().byId(serviceCaseCreation.Ids.ICOTAB_BAR).getSelectedKey() == "2" || this.getView().byId(serviceCaseCreation.Ids
						.ICOTAB_BAR).getSelectedKey() == "3") {
					this.getView().byId(serviceCaseCreation.Ids.ICOTAB_BAR).setSelectedKey("1");
				}*/
				this.getView().byId(serviceCaseCreation.Ids.ICOTAB_BAR).setSelectedKey("1");
				/*end of PCR018233++ changes*/

				this.getCurrentView().byId(serviceCaseCreation.Ids.MAL_FCTN_START_DATEPICKER).setDisplayFormat("dd-MMM-yyyy");
				this.context = oEvent.getParameter("arguments").ServiceCasePath;
				this.contextPath = "/d/results/" + this.context;
				this.getCurrentView().bindElement(this.contextPath);
				var oServiceCaseModel = sap.ui.getCore().getModel("ccServiceCaseModel");

				if (oServiceCaseModel) {
					this.getCurrentView().setBusy(false); //PCR016664++
					var oView = this.getCurrentView();
					this.bPlannedHrsFlag = true;

					oView.byId(serviceCaseCreation.Ids.DELAY_STATUS_COMBOBOX).setModel(sap.ui.getCore().getModel("ccMasterListModel"));
					oView.byId(serviceCaseCreation.Ids.COMBOBOX_IDSYMPTOM).setModel(sap.ui.getCore().getModel("ccMasterListModel"));
					oView.byId(serviceCaseCreation.Ids.COMBOBOX_IDTIER).setModel(sap.ui.getCore().getModel("ccMasterListModel"));
					oView.byId(serviceCaseCreation.Ids.INPUT_FIXBILLING).setModel(sap.ui.getCore().getModel("ccMasterListModel"));
					oView.byId(serviceCaseCreation.Ids.COMBOBOX_SERVICECLASSIFICATION).setModel(sap.ui.getCore().getModel("ccMasterListModel"));
					oView.byId(serviceCaseCreation.Ids.COMBOBOX_CIDPMTYPE).setModel(sap.ui.getCore().getModel("ccMasterListModel"));
					oView.byId(serviceCaseCreation.Ids.COMBOBOX_NONCONFIRM).setModel(sap.ui.getCore().getModel("ccMasterListModel"));
					oView.byId(serviceCaseCreation.Ids.COMBOBOX_CATEGORY2).setModel(sap.ui.getCore().getModel("ccMasterListModel"));
					oView.byId(serviceCaseCreation.Ids.TOOLSTAT_CMBX).setModel(sap.ui.getCore().getModel("ccMasterListModel")); //PCR020942++
					oView.byId(serviceCaseCreation.Ids.ASSEMBLY_STAT).setModel(sap.ui.getCore().getModel("ccMasterListModel")); //PCR027779++
					oView.byId(serviceCaseCreation.Ids.CUSTOMER_STAT).setModel(sap.ui.getCore().getModel("ccMasterListModel")); //PCR027779++

					this.getCurrentView().setModel(sap.ui.getCore().getModel("ccServiceCaseModel"));
					this.ServiceCaseModel = oView.getModel().getData().d.results[this.context];

					if (this.ServiceCaseModel) { //V01++
						this._onBindingChange(this.ServiceCaseModel); //PCR020942++
						this.serviceCaseNumber = this.ServiceCaseModel.Servicecasenumber;
						this.ExpenseCurrency = this.ServiceCaseModel.Currency
							//this.oServiceCaseModel = new serviceCaseCreation.model.SvcCreateCoreModel(); //PCR020161--

						var LaborListModel = new sap.ui.model.json.JSONModel();
						var LaborListExpenseModel = new sap.ui.model.json.JSONModel();
						var aLaborData = [];
						var aLaborExpenseData = [];

						/*start of PCR018233++ changes*/
						//Start of PCR020194++ changes; as they're over written in production; pushing PCR018233 changes again
						var oSvcMdlData = oServiceCaseModel.getProperty("/d/"),
							oDeviceModel = this.getModel("device").getData(),
							bIsPhone = oDeviceModel.isPhone || oDeviceModel.isTablet && oDeviceModel.isNotDesktop;
						oSvcMdlData.orderBtn = bIsPhone ? "" : this.resourceBundle.getText("orderBtn");
						oSvcMdlData.confirmBtn = bIsPhone ? "" : this.resourceBundle.getText("confirmBtn");
						oSvcMdlData.returnBtn = bIsPhone ? "" : this.resourceBundle.getText("returnBtn");
						oSvcMdlData.escalationsBtn = bIsPhone ? "" : this.resourceBundle.getText("escalationsBtn");
						oSvcMdlData.btnSize = bIsPhone ? "3.5rem" : "8.2rem";
						oServiceCaseModel.updateBindings();
						/*end of PCR020194++ changes*/

						sap.ui.getCore().setModel(null, "displayESEModel");
						sap.ui.getCore().setModel(null, "passDownLogModel");
						sap.ui.getCore().setModel(null, "attachmentsModel");
						/*end of PCR018233++ changes*/

						//	var temp;
						/*jQuery.each(oView.getModel().getData().d.results[this.context].Nav_CaseHdr_To_LaborItem.results, function(i, oItem) {
							if (oItem.Laborid == "A7005")
								aLaborExpenseData.push(oItem);
							else
								aLaborData.push(oItem);
						});*/
						var oItems = this._fnValidateLaborItemInputs(oServiceCaseModel.getData().d.results[this.context].Nav_CaseHdr_To_LaborItem.results);

						var oLabor = {
							results: oItems.aLaborData
						};
						var oLaborExpense = {
							results: oItems.aLaborExpenseData
						};
						LaborListModel.setData(oLabor);
						LaborListModel.setSizeLimit(3000); //PCR020161++
						LaborListExpenseModel.setData(oLaborExpense);
						LaborListExpenseModel.setSizeLimit(3000); //PCR020161++
						sap.ui.getCore().setModel(LaborListModel, "ccLaborListModel");
						sap.ui.getCore().setModel(LaborListExpenseModel, "ccLaborListExpenseModel");
						oView.byId(serviceCaseCreation.Ids.LABOR_LIST).setModel(LaborListModel);
						oView.byId(serviceCaseCreation.Ids.LABOR_LIST_EXPENCES).setModel(LaborListExpenseModel);
						LaborListExpenseModel.updateBindings(); //PCR020161++
						LaborListModel.updateBindings(); //PCR020161++
						this._toggleElementsAvailability();

						if (this.ServiceCaseModel.Orderstatus == "Work Completed") {
							this.getView().byId(serviceCaseCreation.Ids.LABOR_SAVE).setEnabled(false);
							this.getView().byId(serviceCaseCreation.Ids.LABOR_ADD).setEnabled(false);
							this.getView().byId(serviceCaseCreation.Ids.EXPENSE_SAVE).setEnabled(false);
							this.getView().byId(serviceCaseCreation.Ids.EXPENSE_ADD).setEnabled(false);
							this.hideElementsWithIDs([serviceCaseCreation.Ids.EDIT_BUTTON]);
						} else {
							this.getView().byId(serviceCaseCreation.Ids.LABOR_SAVE).setEnabled(true);
							this.getView().byId(serviceCaseCreation.Ids.LABOR_ADD).setEnabled(true);
							this.getView().byId(serviceCaseCreation.Ids.EXPENSE_SAVE).setEnabled(true);
							this.getView().byId(serviceCaseCreation.Ids.EXPENSE_ADD).setEnabled(true);
							this.showElementsWithIDs([serviceCaseCreation.Ids.EDIT_BUTTON]);
							//Start if PCR020161 changes
							/* Enabling Add Labor Button for ZINS service type*/
							/*if (this.ServiceCaseModel.Servicetype == "ZINS") {
								this.getView().byId(serviceCaseCreation.Ids.LABOR_SAVE).setEnabled(false);
								this.getView().byId(serviceCaseCreation.Ids.LABOR_ADD).setEnabled(false);
							}*/
							if (this.ServiceCaseModel.Servicetype === "ZPRJ" && this.ServiceCaseModel.Category1 === "21") {
								this.getView().byId(serviceCaseCreation.Ids.EXPENSE_SAVE).setEnabled(false);
								this.getView().byId(serviceCaseCreation.Ids.EXPENSE_ADD).setEnabled(false);
							} else {
								this.getView().byId(serviceCaseCreation.Ids.EXPENSE_SAVE).setEnabled(true);
								this.getView().byId(serviceCaseCreation.Ids.EXPENSE_ADD).setEnabled(true);
							}
							//End if PCR020161 changes
						}

						if (this.getView().byId(serviceCaseCreation.Ids.ICOTAB_BAR).getSelectedKey() == "2" ||
							this.getView().byId(serviceCaseCreation.Ids.ICOTAB_BAR).getSelectedKey() == "3") {
							this.hideElementsWithIDs([serviceCaseCreation.Ids.EDIT_BUTTON]);
						}
						//for category2
						//if(this.getView().byId(serviceCaseCreation.Ids.COMBOBOX_IDCATEGORIZATION_TEXT).getText().toUpperCase() === "RELOCATION")
						var _cat1 = this.ServiceCaseModel.Category1; //PCR016664++//PCR027291++
						if (_cat1 === "08" || _cat1 === "14" || _cat1 === "07" || _cat1 === "04") { //PCR016664++//PCR027291++
							this.showElementsWithIDs([serviceCaseCreation.Ids.CATEGORY2_FLEX]);
						} else {
							this.hideElementsWithIDs([serviceCaseCreation.Ids.CATEGORY2_FLEX]);
						} //PCR016664++
						/*Begin of PCR027291++*/
						var _cat2 = this.ServiceCaseModel.Category2;
						if (_cat2 === "02" || _cat2 === "03" || _cat2 === "04" || _cat2 === "05" || _cat2 === "06") {
							this.showElementsWithIDs([serviceCaseCreation.Ids.CATEGORY3_FLEX]);
						} else {
							this.hideElementsWithIDs([serviceCaseCreation.Ids.CATEGORY3_FLEX]);
						}

						var _cat3 = this.ServiceCaseModel.Category3
						if (_cat3 === "02" || _cat3 === "03" || _cat3 === "04" || _cat3 === "05" || _cat3 === "06") {
							this.showElementsWithIDs([serviceCaseCreation.Ids.CATEGORY4_FLEX]);
						} else {
							this.hideElementsWithIDs([serviceCaseCreation.Ids.CATEGORY4_FLEX]);
						}
						/*end of PCR027291++*/
						if (this.ServiceCaseModel.Servicetype == "ZINS") {
							this.hideElementsWithIDs([
								serviceCaseCreation.Ids.CATEGORIZATION_FLEX,
								serviceCaseCreation.Ids.PM_TYPE_FLEX,
								serviceCaseCreation.Ids.CATEGORY_GRID,
								serviceCaseCreation.Ids.CATEGORY_TOOLBAR,
								serviceCaseCreation.Ids.SYMPTOM_FLEX,
								serviceCaseCreation.Ids.TIER_FLEX,
								serviceCaseCreation.Ids.FAULT_FLEX,
								serviceCaseCreation.Ids.TOOLBAR_CONTRACT,
								serviceCaseCreation.Ids.GRID_CONTRACT,
								serviceCaseCreation.Ids.TOOLBAR_PAID_SERVICE1,
								serviceCaseCreation.Ids.GRID_PAID_SERVICE,
								serviceCaseCreation.Ids.CONFIRM_FLEX,
								serviceCaseCreation.Ids.WAFER_FLEX,
								serviceCaseCreation.Ids.DELAY_PMO_PRJ, //PCR017437++
								serviceCaseCreation.Ids.DELAY_CMO, //PCR017437++
								// serviceCaseCreation.Ids.MALFUNCDTFLXBX, //PCR018422++ //PCR033903--
								serviceCaseCreation.Ids.ASSEM_FLEX, //PCR020942++
								serviceCaseCreation.Ids.TOOLSTAT_FLEX, //PCR020942++
								serviceCaseCreation.Ids.DELAYFLXBX,
								serviceCaseCreation.Ids.KA_BUTTON, //PCR020942++
								serviceCaseCreation.Ids.CATEGORY_TOOLBAR1 //PCR020161++
							]);
						} else if (this.ServiceCaseModel.Servicetype == "ZCMO") {
							this.showElementsWithIDs([
								serviceCaseCreation.Ids.CATEGORY_GRID,
								serviceCaseCreation.Ids.CATEGORY_TOOLBAR,
								serviceCaseCreation.Ids.SYMPTOM_FLEX,
								serviceCaseCreation.Ids.FAULT_FLEX,
								serviceCaseCreation.Ids.CUST_LBL,
								serviceCaseCreation.Ids.TOOLBAR_PAID_SERVICE1,
								serviceCaseCreation.Ids.GRID_PAID_SERVICE,
								serviceCaseCreation.Ids.TOOLBAR_CONTRACT,
								serviceCaseCreation.Ids.GRID_CONTRACT,
								serviceCaseCreation.Ids.CONFIRM_FLEX,
								serviceCaseCreation.Ids.WAFER_FLEX,
								serviceCaseCreation.Ids.DELAY_CMO, //PCR017437++
								// serviceCaseCreation.Ids.MALFUNCDTFLXBX, //PCR018422++ //PCR033903--
								serviceCaseCreation.Ids.DELAYFLXBX, //PCR018422++
								serviceCaseCreation.Ids.ASSEM_FLEX, //PCR020942++
								serviceCaseCreation.Ids.TOOLSTAT_FLEX, //PCR020942++
								serviceCaseCreation.Ids.KA_BUTTON //PCR020942++
							]);
							this.hideElementsWithIDs([
								serviceCaseCreation.Ids.TIER_FLEX,
								serviceCaseCreation.Ids.CATEGORIZATION_FLEX,
								serviceCaseCreation.Ids.PM_TYPE_FLEX,
								serviceCaseCreation.Ids.OPPNO_LBL,
								serviceCaseCreation.Ids.CATEGORY_GRID1,
								serviceCaseCreation.Ids.CATEGORY_TOOLBAR1,
								serviceCaseCreation.Ids.ACCASSIGN_FLEX_DISPLAY,
								serviceCaseCreation.Ids.ACCCAT_FLEX_DISPLAY,
								serviceCaseCreation.Ids.CONTRACT_GRID1,
								serviceCaseCreation.Ids.CUST_PO_FLEX1,
								serviceCaseCreation.Ids.ACC_FLEX_ID,
								serviceCaseCreation.Ids.DELAY_PMO_PRJ //PCR017437++
							]);
							if (this.ServiceCaseModel.Warrantyid == "WTY0001" || this.ServiceCaseModel.Warrantyid == "WTY0003") {
								this.showElementsWithIDs([serviceCaseCreation.Ids.TIER_FLEX]);
							}
						} else if (this.ServiceCaseModel.Servicetype == "ZPMO") {
							this.showElementsWithIDs([
								serviceCaseCreation.Ids.CATEGORY_GRID,
								serviceCaseCreation.Ids.CATEGORY_TOOLBAR,
								serviceCaseCreation.Ids.PM_TYPE_FLEX,
								serviceCaseCreation.Ids.CUST_LBL,
								serviceCaseCreation.Ids.TOOLBAR_PAID_SERVICE1,
								serviceCaseCreation.Ids.GRID_PAID_SERVICE,
								serviceCaseCreation.Ids.TOOLBAR_CONTRACT,
								serviceCaseCreation.Ids.GRID_CONTRACT,
								serviceCaseCreation.Ids.DELAY_PMO_PRJ, //PCR017437++
								serviceCaseCreation.Ids.TOOLSTAT_FLEX, //PCR020942++
							]);
							this.hideElementsWithIDs([
								serviceCaseCreation.Ids.SYMPTOM_FLEX,
								serviceCaseCreation.Ids.TIER_FLEX,
								serviceCaseCreation.Ids.FAULT_FLEX,
								serviceCaseCreation.Ids.CATEGORIZATION_FLEX,
								serviceCaseCreation.Ids.OPPNO_LBL,
								serviceCaseCreation.Ids.CATEGORY_GRID1,
								serviceCaseCreation.Ids.CATEGORY_TOOLBAR1,
								serviceCaseCreation.Ids.ACCASSIGN_FLEX_DISPLAY,
								serviceCaseCreation.Ids.ACCCAT_FLEX_DISPLAY,
								serviceCaseCreation.Ids.CONTRACT_GRID1,
								serviceCaseCreation.Ids.CUST_PO_FLEX1,
								serviceCaseCreation.Ids.ACC_FLEX_ID,
								serviceCaseCreation.Ids.CONFIRM_FLEX,
								serviceCaseCreation.Ids.WAFER_FLEX,
								serviceCaseCreation.Ids.DELAY_CMO, //PCR017437++
								// serviceCaseCreation.Ids.MALFUNCDTFLXBX, //PCR018422++ //PCR033903--
								serviceCaseCreation.Ids.ASSEM_FLEX, //PCR020942++
								// serviceCaseCreation.Ids.TOOLSTAT_FLEX, //PCR020942++ //PCR033903--
								serviceCaseCreation.Ids.DELAYFLXBX,
								serviceCaseCreation.Ids.KA_BUTTON //PCR020942++
							]);
						} else if (this.ServiceCaseModel.Servicetype == "ZPRJ") {
							this.hideElementsWithIDs([
								serviceCaseCreation.Ids.SYMPTOM_FLEX,
								serviceCaseCreation.Ids.TIER_FLEX,
								serviceCaseCreation.Ids.FAULT_FLEX,
								serviceCaseCreation.Ids.CUST_LBL,
								serviceCaseCreation.Ids.CATEGORY_TOOLBAR,
								serviceCaseCreation.Ids.CATEGORY_GRID,
								serviceCaseCreation.Ids.COMBOBOX_IDPMTPE_TEXT,
								serviceCaseCreation.Ids.INPUT_ACCASSIGNMENT_DISPLAY,
								serviceCaseCreation.Ids.TOOLBAR_CONTRACT,
								serviceCaseCreation.Ids.GRID_CONTRACT,
								serviceCaseCreation.Ids.CONFIRM_FLEX,
								serviceCaseCreation.Ids.WAFER_FLEX,
								serviceCaseCreation.Ids.DELAY_CMO, //PCR017437++
								// serviceCaseCreation.Ids.MALFUNCDTFLXBX, //PCR018422++ //PCR033903--
								serviceCaseCreation.Ids.ASSEM_FLEX, //PCR020942++
								// serviceCaseCreation.Ids.TOOLSTAT_FLEX, //PCR020942++  //PCR033903--
								serviceCaseCreation.Ids.DELAYFLXBX,
								serviceCaseCreation.Ids.KA_BUTTON //PCR020942++
							]);
							this.showElementsWithIDs([
								serviceCaseCreation.Ids.CATEGORY_GRID1,
								serviceCaseCreation.Ids.CATEGORIZATION_FLEX,
								serviceCaseCreation.Ids.OPPNO_LBL,
								serviceCaseCreation.Ids.CATEGORY_TOOLBAR1,
								serviceCaseCreation.Ids.TOOLBAR_PAID_SERVICE1,
								serviceCaseCreation.Ids.GRID_PAID_SERVICE,
								serviceCaseCreation.Ids.ACCASSIGN_FLEX_DISPLAY,
								serviceCaseCreation.Ids.ACCCAT_FLEX_DISPLAY,
								serviceCaseCreation.Ids.DELAY_PMO_PRJ, //PCR017437++
								serviceCaseCreation.Ids.TOOLSTAT_FLEX //PR033903++
							]);

						}

						var _category1 = this.ServiceCaseModel.Category1;
						if (_category1 == "02") {
							this.showElementsWithIDs([
								serviceCaseCreation.Ids.FIXBILL_FLEX,
								serviceCaseCreation.Ids.SERVICECLASSIFICATION_FLEX,
								serviceCaseCreation.Ids.INPUT_CUSTPO_FLEX,
							]);
							this.hideElementsWithIDs([
								serviceCaseCreation.Ids.ACCASSIGN_FLEX_DISPLAY,
								serviceCaseCreation.Ids.ACCCAT_FLEX_DISPLAY,
								serviceCaseCreation.Ids.CONTRACT_GRID1, ,
								serviceCaseCreation.Ids.CUST_PO_FLEX1,
								serviceCaseCreation.Ids.ACC_FLEX_ID,
								serviceCaseCreation.Ids.OPPNO_LBL1,
								serviceCaseCreation.Ids.INPUT_OPPNUM1,
								serviceCaseCreation.Ids.ASSIGNMENT_CAT1,
								serviceCaseCreation.Ids.ACCASSIGN_CAT_TEXT
							]);
						} else if (_category1 == "03") {
							this.hideElementsWithIDs([
								serviceCaseCreation.Ids.GRID_PAID_SERVICE, //PCR020161++
								serviceCaseCreation.Ids.FIXBILL_FLEX,
								serviceCaseCreation.Ids.SERVICECLASSIFICATION_FLEX,
								serviceCaseCreation.Ids.INPUT_ACCASSIGNMENT_DISPLAY,
								serviceCaseCreation.Ids.ACCASSIGN_FLEX_DISPLAY,
								serviceCaseCreation.Ids.ACCCAT_FLEX_DISPLAY,
								serviceCaseCreation.Ids.INPUT_CUSTPO_FLEX,
								serviceCaseCreation.Ids.INPUT_OPPNUM1,
							]);
							this.showElementsWithIDs([
								serviceCaseCreation.Ids.CONTRACT_GRID1, ,
								serviceCaseCreation.Ids.CUST_PO_FLEX1,
								serviceCaseCreation.Ids.ACC_FLEX_ID,
								serviceCaseCreation.Ids.OPPNO_LBL1,
								serviceCaseCreation.Ids.ASSIGNMENT_CAT1,
								serviceCaseCreation.Ids.ACCASSIGN_CAT_TEXT
							]);
						} else if (_category1 == "07" || _category1 === "04") {
							this.hideElementsWithIDs([
								serviceCaseCreation.Ids.FIXBILL_FLEX,
								serviceCaseCreation.Ids.SERVICECLASSIFICATION_FLEX,
								serviceCaseCreation.Ids.INPUT_CUSTPO_FLEX,
								serviceCaseCreation.Ids.CONTRACT_GRID1, ,
								serviceCaseCreation.Ids.CUST_PO_FLEX1,
								serviceCaseCreation.Ids.ACC_FLEX_ID,
								serviceCaseCreation.Ids.OPPNO_LBL1,
								serviceCaseCreation.Ids.INPUT_OPPNUM1,
								serviceCaseCreation.Ids.ASSIGNMENT_CAT1,
								serviceCaseCreation.Ids.ACCASSIGN_CAT_TEXT
							]);
							this.showElementsWithIDs([
								serviceCaseCreation.Ids.ACCASSIGN_FLEX_DISPLAY,
								serviceCaseCreation.Ids.ACCCAT_FLEX_DISPLAY,
							]);
						} else if (_category1 == "08") {
							this.showElementsWithIDs([
								serviceCaseCreation.Ids.FIXBILL_FLEX,
								serviceCaseCreation.Ids.SERVICECLASSIFICATION_FLEX,
								serviceCaseCreation.Ids.INPUT_CUSTPO_FLEX,
							]);
							this.hideElementsWithIDs([
								serviceCaseCreation.Ids.ACCASSIGN_FLEX_DISPLAY,
								serviceCaseCreation.Ids.ACCCAT_FLEX_DISPLAY,
								serviceCaseCreation.Ids.CONTRACT_GRID1, ,
								serviceCaseCreation.Ids.CUST_PO_FLEX1,
								serviceCaseCreation.Ids.ACC_FLEX_ID,
								serviceCaseCreation.Ids.OPPNO_LBL1,
								serviceCaseCreation.Ids.INPUT_OPPNUM1,
								serviceCaseCreation.Ids.ASSIGNMENT_CAT1,
								serviceCaseCreation.Ids.ACCASSIGN_CAT_TEXT
							]);
						} else if (_category1 == "14") {
							this.hideElementsWithIDs([
								serviceCaseCreation.Ids.FIXBILL_FLEX,
								serviceCaseCreation.Ids.SERVICECLASSIFICATION_FLEX,
								serviceCaseCreation.Ids.INPUT_CUSTPO_FLEX,
								serviceCaseCreation.Ids.CONTRACT_GRID1, ,
								serviceCaseCreation.Ids.CUST_PO_FLEX1,
								serviceCaseCreation.Ids.ACC_FLEX_ID,
								serviceCaseCreation.Ids.OPPNO_LBL1,
								serviceCaseCreation.Ids.INPUT_OPPNUM1,
								serviceCaseCreation.Ids.ASSIGNMENT_CAT1,
								serviceCaseCreation.Ids.ACCASSIGN_CAT_TEXT
							]);
							this.showElementsWithIDs([
								serviceCaseCreation.Ids.ACCASSIGN_FLEX_DISPLAY,
								serviceCaseCreation.Ids.ACCCAT_FLEX_DISPLAY,
							]);
						} else {
							this.showElementsWithIDs([
								serviceCaseCreation.Ids.FIXBILL_FLEX,
								serviceCaseCreation.Ids.SERVICECLASSIFICATION_FLEX,
								serviceCaseCreation.Ids.INPUT_CUSTPO_FLEX,
							]);
							this.hideElementsWithIDs([
								serviceCaseCreation.Ids.ACCASSIGN_FLEX_DISPLAY,
								serviceCaseCreation.Ids.ACCCAT_FLEX_DISPLAY,
								serviceCaseCreation.Ids.CONTRACT_GRID1, ,
								serviceCaseCreation.Ids.CUST_PO_FLEX1,
								serviceCaseCreation.Ids.ACC_FLEX_ID,
								serviceCaseCreation.Ids.OPPNO_LBL1,
								serviceCaseCreation.Ids.INPUT_OPPNUM1,
								serviceCaseCreation.Ids.ASSIGNMENT_CAT1,
								serviceCaseCreation.Ids.ACCASSIGN_CAT_TEXT
							]);
							//Start of PCR020161++ changes; Indirect Labor changes
							if (_category1 === "21") {
								this.hideElementsWithIDs([
									serviceCaseCreation.Ids.TOOLBAR_PAID_SERVICE1,
									serviceCaseCreation.Ids.GRID_PAID_SERVICE
								]);
							}
							//End of PCR020161++ changes
						}
						if (this.ServiceCaseModel.Currency == "") {
							this.hideElementsWithIDs([
								serviceCaseCreation.Ids.CURRENCY_DISP_ID,
							]);
						} else {
							this.showElementsWithIDs([
								serviceCaseCreation.Ids.CURRENCY_DISP_ID,
							]);
						}
					}
				}
				
				/*Begin of PCR034663++*/	
				var bnsoFlg = false;
				var that = this;
				
				if (this.ServiceCaseModel.Servicetype == "ZPRJ") {					
					jQuery.each(sap.ui.getCore().getModel("ccMasterListModel").getData().masterListSets.nsoCategory1Condtions	, function(i, item) {
						if (item.GuidKey == that.ServiceCaseModel.Category1 )
							bnsoFlg = true;											
					});
					
					oView.byId(serviceCaseCreation.Ids.NSO_CMBX).setEnabled(false);
					oView.byId(serviceCaseCreation.Ids.OPPNO_LBL).setText(this.resourceBundle.getText("CreateServiceCase.Project/OpportunityNo"));
					this.getView().byId(serviceCaseCreation.Ids.OPPNO_LBL).removeStyleClass("asteriskCC");
					this.getView().byId(serviceCaseCreation.Ids.NSO_LBL).removeStyleClass("asteriskCC");
					if(bnsoFlg && that.ServiceCaseModel.ZzprjNso) {	
						this.showElementsWithIDs([
							serviceCaseCreation.Ids.NSO_FLXBX,							
							serviceCaseCreation.Ids.NSO_TXT]);	
						if(that.ServiceCaseModel.ZzprjNso.toUpperCase() === "YES") {
							this.showElementsWithIDs([serviceCaseCreation.Ids.INPUT_CUSTPO_FLEX,							
								serviceCaseCreation.Ids.CUSTPO_TEXT,
								]);							
								this.getView().byId(serviceCaseCreation.Ids.OPPNO_LBL).setText(this.resourceBundle.getText("CreateServiceCase.OpportunityNo"));							
						} else {
							if(this.ServiceCaseModel.Category1 !==	"08" && this.ServiceCaseModel.Category1 !==	"02")
								this.hideElementsWithIDs([serviceCaseCreation.Ids.INPUT_CUSTPO_FLEX,							
									serviceCaseCreation.Ids.CUSTPO_TEXT,
									]);	
							else
								this.showElementsWithIDs([serviceCaseCreation.Ids.INPUT_CUSTPO_FLEX,							
									serviceCaseCreation.Ids.CUSTPO_TEXT,
									]);
						}
						this.hideElementsWithIDs([
							serviceCaseCreation.Ids.NSO_CMBX,
							serviceCaseCreation.Ids.CUSTPO_INPUT]);
											
					} else {
						if(bnsoFlg) {
							oView.byId(serviceCaseCreation.Ids.NSO_CMBX).setEnabled(true);
							this.hideElementsWithIDs([serviceCaseCreation.Ids.CUSTPO_INPUT,
								serviceCaseCreation.Ids.NSO_CMBX							
								]);
							if(this.ServiceCaseModel.Category1 !==	"08" && this.ServiceCaseModel.Category1 !==	"02") {
								this.hideElementsWithIDs([serviceCaseCreation.Ids.INPUT_CUSTPO_FLEX,							
									serviceCaseCreation.Ids.CUSTPO_TEXT,
									]);	
							} else {
								this.showElementsWithIDs([serviceCaseCreation.Ids.INPUT_CUSTPO_FLEX,							
									serviceCaseCreation.Ids.CUSTPO_TEXT,
									]);								
							}
							this.showElementsWithIDs([
								serviceCaseCreation.Ids.NSO_FLXBX,
								serviceCaseCreation.Ids.NSO_TXT								
								]);
													
						}
						else {
							this.hideElementsWithIDs([								
								serviceCaseCreation.Ids.NSO_CMBX,
								serviceCaseCreation.Ids.CUSTPO_INPUT]);	
							this.showElementsWithIDs([
								serviceCaseCreation.Ids.NSO_FLXBX,							
								serviceCaseCreation.Ids.NSO_TXT]);	
							
						}
					}
					this.getView().byId(serviceCaseCreation.Ids.NSO_CMBX).setSelectedKey("");
					
					if(!this.getView().byId(serviceCaseCreation.Ids.CATEGORY3_FLEX).getVisible()) {
						this.getView().byId(serviceCaseCreation.Ids.CATEGORIZATION_FLEXBOX).addStyleClass("nsomargin");
						this.getView().byId(serviceCaseCreation.Ids.CATEGORY2_FLEX).addStyleClass("nsomargin");
					} else {
						this.getView().byId(serviceCaseCreation.Ids.CATEGORIZATION_FLEXBOX).removeStyleClass("nsomargin");
						this.getView().byId(serviceCaseCreation.Ids.CATEGORY2_FLEX).removeStyleClass("nsomargin");
					}
					
					if(this.getView().byId(serviceCaseCreation.Ids.FIXBILL_FLEX).getVisible()) {
						this.getView().byId(serviceCaseCreation.Ids.FIXBILL_FLEX).addStyleClass("nsomargin");
						this.getView().byId(serviceCaseCreation.Ids.SERVICECLASSIFICATION_FLEX).addStyleClass("nsomargin");
					}
				} /* Start of PCR033903++*/else {
					this.hideElementsWithIDs([								
						serviceCaseCreation.Ids.NSO_FLXBX]);	
				} /* End of PCR033903++*/
				
				/*End of PCR034663++*/
				//Prb Dsc
				if (jQuery.device.is.phone)
					this.getCurrentView().byId("prbDscFlx").addStyleClass("prbDscFlxMbCC");
				else
					this.getCurrentView().byId("prbDscFlx").addStyleClass("prbDscFlxDsktCC");

				this._count = 1;
				serviceCaseCreation.util.Util.resetProblemDescriptionInitialPosition(this, serviceCaseCreation.Ids.PROBLEM_DESC_TEXT,
					serviceCaseCreation.Ids.PROBLEM_DESC_LABEL, serviceCaseCreation.Ids.LINK_TEXT, serviceCaseCreation.Ids.DESC_ICON);

				//Prb Dsc	
				this.byId("serviceOrderPage").scrollTo(0);

				var that = this;
				jQuery.each(this.aLabels, function(i, oItem) {
					that.getView().byId(oItem).removeStyleClass("asteriskCC");
				});
			}
			if (oEvent.getParameter("name") === "advanceSearchtoMain") {
				this._toggleElementsAvailability();
				this.hideElementsWithIDs([serviceCaseCreation.Ids.PROBLEM_DESC_TEXT]);
			}
		},

		//Start of PCR020161++ changes; Indirect Labor changes

		_fnValidateLaborItemInputs: function(aItems) {
			var sServiceType = this.contextPath + "/Servicetype",
				sCate1 = this.contextPath + "/Category1";
			var aLaborExpenseData = [],
				aLaborData = [];
			var oServiceCaseModel = sap.ui.getCore().getModel("ccServiceCaseModel");
			var sServicetype, sLaborId, sCategory1, bIdEnabled, bQuantEnabled;

			jQuery.each(aItems, function(i, oItem) {
				sServicetype = oServiceCaseModel.getProperty(sServiceType);
				sCategory1 = oServiceCaseModel.getProperty(sCate1);
				sLaborId = oItem.Laborid;

				bIdEnabled = bQuantEnabled = true;

				if (sServicetype === "ZINS") {
					bIdEnabled = false;

					if (sLaborId !== "A7380") {
						bQuantEnabled = false;
					}
				} else if (sServicetype === "ZPRJ") {
					if (sCategory1 === "21") {
						bIdEnabled = false;

						if (sLaborId !== "A7380") {
							bQuantEnabled = false;
						}
					}
				}

				oItem.bQuantEnabled = bQuantEnabled;
				oItem.bIdEnabled = bIdEnabled;

				if (oItem.Laborid == "A7005") {
					aLaborExpenseData.push(oItem);
				} else {
					aLaborData.push(oItem);
				}
			});

			return {
				aLaborData: aLaborData,
				aLaborExpenseData: aLaborExpenseData
			}
		},

		//End of PCR020161++ changes

		/***************** Begin of PCR020942++ changes *****************/

		/**
		 * An event handler to show symptom level hint.
		 * @name onSymHintPress
		 */
		onSymHintPress: function() {
			if (Device.system.phone) {
				FragHelper.handleResourceNotFoundError(
					this,
					"information",
					this._resourceBundle.getText("symHint"),
					""
				);
			}
		},

		/**
		 * An internal method that will handle the context path bound to the view
		 * is changed. It'll also selects an item in the master list accordingly.
		 * @name _onBindingChange
		 * @param {Object} oCntx - service order context
		 */
		_onBindingChange: function(oCntx) {
			var oView = this.getView();
			var oHtml = oView.byId(serviceCaseCreation.Ids.KA_HTML),
				oLayout = oView.byId(serviceCaseCreation.Ids.KA_BUTTON);
			var aFields = ["KaUrl", "Symptom", "Fault", "Assembly", "Kpu"],
				sDisabled = "enabled",
				sFieldName = "",
				sUserId = "",
				sUserName = "";
			var oCont = sap.ushell;
			var sHTML, sbtnColor, sField, bIsZCMO, sAssemVal, arrAssem;

			if (oCntx) {
				bIsZCMO = oCntx.Servicetype === "ZCMO";

				for (sField in aFields) {
					if (!oCntx[aFields[sField]]) {
						sDisabled = "disabled";
						sFieldName += aFields[sField] + ", ";

						if (aFields[sField] === "Symptom") {
							sFieldName = "Symptom Level 1";
						} else if (aFields[sField] === "Fault") {
							sFieldName = "Symptom Level 2";
						}

					}
				}

				if (bIsZCMO && sFieldName) {
					MessageToast.show(
						this.resourceBundle.getText("KAButnDisabled") + " " + sFieldName + "  " + this.resourceBundle.getText("KABtnNotAvail")
					);
				}

				if (oCont) {
					sUserId = oCont.Container.getUser().getId();
					sUserName = oCont.Container.getUser().getFullName();
				}

				sbtnColor = sDisabled === "disabled" ? "#1b6d91" : "#009de0";
				sAssemVal = oCntx.Assembly;

				if (sAssemVal.indexOf("-") > -1) {
					arrAssem = sAssemVal.split("-");
					sAssemVal = arrAssem.slice(1, arrAssem.length).join("-");
				}
				// Start of PCR023277++ KA Project Changes
				sHTML = '<form action="' + oCntx.KaUrl + '" method="post">' +
					'<input type="hidden" name="ServiceCaseNumber" value="' + oCntx.Servicecasenumber + '">' +
					'<input type="hidden" name="SymptomLevel1Key" value="' + oCntx.Symptom + '">' +
					'<input type="hidden" name="SymptomLevel1Value" value="' + oCntx.SymptomDesc + '">' +
					'<input type="hidden" name="SymptomLevel2Key" value="' + oCntx.Fault + '">' +
					'<input type="hidden" name="SymptomLevel2Value" value="' + oCntx.FaultDesc + '">' +
					'<input type="hidden" name="AssemblyKey" value="' + sAssemVal + '">' +
					'<input type="hidden" name="AssemblyValue" value="' + sAssemVal + '">' +
					'<input type="hidden" name="KPU" value="' + oCntx.Kpu + '">' +
					'<input type="hidden" name="FabId" value="' + oCntx.Fabid + '">' +
					'<input type="hidden" name="FabIdValue" value="' + oCntx.Fabnamedescription + '">' +
					'<input type="hidden" name="UserId" value="' + sUserId + '">' +
					'<input type="hidden" name="UserName" value="' + sUserName + '">' +
					'<input type="hidden" name="DeviceType" value="' + navigator.userAgent + '">' +
					'<input type="hidden" name="AssemblyId" value="' + oCntx.AssemblyId + '">' +
					'<input type="hidden" name="GotCode" value="' + oCntx.GotCode + '">' +
					'<input type="hidden" name="EquipmentId" value="' + oCntx.Equipment + '">' +
					'<button ' + sDisabled +
					' style=" font-size: 0.875rem; border-radius: 0.125rem; padding: 0.1rem 0.5rem; margin: 4px 0.4rem 0 0; border-radius: 5px, display: block; border: none; background-color: ' +
					sbtnColor +
					'; border-color: #008bc7; color: #ffffff; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; vertical-align: top; line-height: 2.375rem;" type="submit" formtarget="_blank">Knowledge Assist</button>' +
					'</form>';
				// End of PCR023277++ KA Project Changes

				if (!oHtml) {
					var sId = this.createId(serviceCaseCreation.Ids.KA_HTML);
					oHtml = new HTML(sId, {
						content: sHTML,
						preferDOM: false
					});
				} else {
					oHtml.setContent(bIsZCMO ? sHTML : "");
				}

				if (bIsZCMO && oCntx.KaEnable) {
					oLayout.addContent(oHtml);
				} else {
					oLayout.removeContent(oHtml);
				}
			}
		},

		/**
		 * Event handler for InputMenu control - parent selection change.
		 * @name onSymLevelOneSelectionChange
		 * @param {Object} oEvent - event handler object
		 */
		onSymLevelOneSelectionChange: function(oEvent) {
			var aSymLevelTwoElement = [
				serviceCaseCreation.Ids.COMBOBOX_IDFAULT
			];
			var oSymOneCmbx = this.byId(serviceCaseCreation.Ids.COMBOBOX_IDSYMPTOM),
				oSymTwoCmbx = this.byId(serviceCaseCreation.Ids.COMBOBOX_IDFAULT);
			var oSymOne = oEvent.getParameter("oParent");
			var aChildFil;

			if (Object.keys(oSymOne).length) {
				serviceCaseCreation.util.Util._fnSetSymLevelsFieldsData.call(this,
					oSymOne.GuidKey,
					serviceCaseCreation.Ids.COMBOBOX_IDFAULT,
					Object.keys(oSymOne).length > 2                                                                                                                                  //PCR035464++
				);
				aChildFil = serviceCaseCreation.util.Util.filterSymptomLevelTwoBindings.call(this,
					oSymOne.KeyValue1,
					serviceCaseCreation.Ids.COMBOBOX_IDFAULT,
					"");
				oSymOneCmbx.setArrChildFilters([
					new Filter({
						filters: aChildFil ? aChildFil : [],
						and: false
					}),
					new Filter("ParentGuidKey", FilterOperator.EQ, oSymOne.GuidKey)
				]);
				serviceCaseCreation.util.Util.filterSymptomLevelTwoBindings.call(this,
					oSymOne.KeyValue1,
					serviceCaseCreation.Ids.COMBOBOX_IDFAULT,
					"onEdit"
				);
			}

			if (Object.keys(oSymOne).length > 2 || !Object.keys(oSymOne).length) {
				this.clearSelectedItemInComboBox(aSymLevelTwoElement);
				serviceCaseCreation.util.Util.doCompleteInputElementsValidation.call(this, [oSymTwoCmbx]);

				if (!Object.keys(oSymOne).length) {
					oSymTwoCmbx.getBinding("items").filter([new Filter("ParentGuidKey", FilterOperator.EQ, "$")]);
				}
			}
		},

		/**
		 * Event handler for InputMenu control - child selection change.
		 * @name onValueHelpRequest
		 * @param {Object} oEvent - event handler object
		 */
		onSetSymLevelTwoKey: function(oEvent) {
			var oSymLev = oEvent.getParameters(),
				oSymTwoCmbx = this.byId(serviceCaseCreation.Ids.COMBOBOX_IDFAULT);

			serviceCaseCreation.util.Util.filterSymptomLevelTwoBindings.call(this,
				oSymLev.oParent.KeyValue1,
				serviceCaseCreation.Ids.COMBOBOX_IDFAULT,
				"onEdit"
			);
			oSymTwoCmbx.setSelectedKey(oSymLev.oChild.GuidKey);
			oSymTwoCmbx.fireSelectionChange();
		},

		/**
		 * This method will deselect the selected key from Combo Box elements.
		 * @name clearSelectedItemInComboBox
		 * @param [elements] array - aElementIDs
		 */
		clearSelectedItemInComboBox: function(aElementIDs) {
			for (var elementID in aElementIDs) {
				this.getView().byId(aElementIDs[elementID]).setSelectedKey("");
			}
		},

		/***************** End of PCR020942++ changes *****************/
		/*Begin of PCR030996++*/
		/**
		 * This method will open the ark url.
		 * @name openArkUrl
		 * @param {Object} oEvent - event handler object
		 */
		openArkUrl: function(oEvent) {
			var ocontext = this.getView().getBindingContext().getObject();
			var singquo = "'";
			var surlParams = serviceCaseCreation.Constants.ARKEQUIP + singquo + this.ServiceCaseModel.Equipment + singquo +
				serviceCaseCreation.Constants.ARKSN + singquo + this.ServiceCaseModel.Serialnumber + singquo +
				serviceCaseCreation.Constants.ARKT1 + singquo + this.ServiceCaseModel.Equipment + singquo +
				serviceCaseCreation.Constants.ARKMAJASS + singquo + this.ServiceCaseModel.MAJ_ASSEMBLY + singquo +
				serviceCaseCreation.Constants.ARKMAJASSID + singquo + this.ServiceCaseModel.MAJASMBLY_EQUI + singquo;
			if (sap.ui.getCore().getModel("ccARKModel").getData().d.EvArkUrl)
				sap.m.URLHelper.redirect(sap.ui.getCore().getModel("ccARKModel").getData().d.EvArkUrl + surlParams, true);
			else
				MessageToast.show(sap.ui.getCore().getModel("ccARKModel").getData().d.EvError);
		},
		/*End of PCR030996++*/
		/* Begin of  PCR034663++ */
		
		/**
		 * This method calls when NSO got changed
		 * @name onNsochange
		 * @param oEvent- Current Event Parameter
		 * @returns
		 */		
		onNsochange: function(evt) {			
			if(this.getView().byId(serviceCaseCreation.Ids.NSO_CMBX).getSelectedKey() === "YES") {
				this.showElementsWithIDs([serviceCaseCreation.Ids.INPUT_CUSTPO_FLEX,
					serviceCaseCreation.Ids.CUSTPO_INPUT]);
				this.getView().byId(serviceCaseCreation.Ids.OPPNO_LBL).addStyleClass("asteriskCC");
				this.getView().byId(serviceCaseCreation.Ids.CUSTPO_INPUT).setMaxLength(10);
				
				this.getView().byId(serviceCaseCreation.Ids.OPPNO_LBL).setText(this.resourceBundle.getText("CreateServiceCase.OpportunityNo"));
			} else {
				if(this.bnsoFlg && this.ServiceCaseModel.Category1 !==	"08" && this.ServiceCaseModel.Category1 !==	"02")
					this.hideElementsWithIDs([serviceCaseCreation.Ids.INPUT_CUSTPO_FLEX	]);
				this.getView().byId(serviceCaseCreation.Ids.OPPNO_LBL).removeStyleClass("asteriskCC");
				this.getView().byId(serviceCaseCreation.Ids.CUSTPO_INPUT).setMaxLength(0);				
				this.getView().byId(serviceCaseCreation.Ids.OPPNO_LBL).setText(this.resourceBundle.getText("CreateServiceCase.Project/OpportunityNo"));
				if(!this.ServiceCaseModel.Customerponum) {
					this.getView().byId(serviceCaseCreation.Ids.CUSTPO_INPUT).setValue("");
					this.getView().byId(serviceCaseCreation.Ids.INPUT_OPPNUM1).setValue("");
				}
			}
			if(this.getView().byId(serviceCaseCreation.Ids.NSO_CMBX).getSelectedKey()  !== "YES") {
				if(this.bnsoFlg && this.ServiceCaseModel.Category1 !==	"08" && this.ServiceCaseModel.Category1 !==	"02")
					this.hideElementsWithIDs([serviceCaseCreation.Ids.INPUT_CUSTPO_FLEX]);
				this.getView().byId(serviceCaseCreation.Ids.NSO_CMBX).setValueState("None");			
				this.getView().byId(serviceCaseCreation.Ids.CUSTPO_INPUT).setValueState("None");
				this.getView().byId(serviceCaseCreation.Ids.OPPNO_LBL).setText(this.resourceBundle.getText("CreateServiceCase.Project/OpportunityNo"));
				if(!this.ServiceCaseModel.Customerponum) {
					this.getView().byId(serviceCaseCreation.Ids.CUSTPO_INPUT).setValue("");
					this.getView().byId(serviceCaseCreation.Ids.INPUT_OPPNUM1).setValue("");
				}
			}
			
		},
		
		/**
		 * This method changes the state of NSO
		 * @name toggleNsoState
		 * @param
		 * @returns
		 */		
		toggleNsoState: function() {
			var oView = this.getView(),
			that = this;
			this.getView().byId(serviceCaseCreation.Ids.NSO_CMBX).setSelectedKey("");
			oView.byId(serviceCaseCreation.Ids.NSO_CMBX).setModel(sap.ui.getCore().getModel("ccMasterListModel"));
			var bnsoFlg = false;
			if (this.ServiceCaseModel.Servicetype == "ZPRJ") {
				jQuery.each(sap.ui.getCore().getModel("ccMasterListModel").getData().masterListSets.nsoCategory1Condtions	, function(i, item) {
					if (item.GuidKey == that.ServiceCaseModel.Category1 )
						bnsoFlg = true;											
				});
				this.getView().byId(serviceCaseCreation.Ids.OPPNO_LBL).removeStyleClass("asteriskCC");
				this.getView().byId(serviceCaseCreation.Ids.NSO_LBL).removeStyleClass("asteriskCC");
				if(bnsoFlg) {
					this.showElementsWithIDs([
						serviceCaseCreation.Ids.NSO_FLXBX,					
						serviceCaseCreation.Ids.NSO_TXT]);						
					this.hideElementsWithIDs([serviceCaseCreation.Ids.NSO_CMBX,
						serviceCaseCreation.Ids.CUSTPO_INPUT]);
					if(this.ServiceCaseModel.ZzprjNso.toUpperCase() === "YES") {
						this.showElementsWithIDs([serviceCaseCreation.Ids.INPUT_CUSTPO_FLEX,						
							serviceCaseCreation.Ids.CUSTPO_TEXT]);	
					} else {
						if(this.ServiceCaseModel.Category1 !==	"08" && this.ServiceCaseModel.Category1 !==	"02")
							this.hideElementsWithIDs([serviceCaseCreation.Ids.INPUT_CUSTPO_FLEX,						
								serviceCaseCreation.Ids.CUSTPO_TEXT]);	
						else
							this.showElementsWithIDs([serviceCaseCreation.Ids.INPUT_CUSTPO_FLEX,						
								serviceCaseCreation.Ids.CUSTPO_TEXT]);
					}					
				} else {
					this.hideElementsWithIDs([
						serviceCaseCreation.Ids.NSO_CMBX]);
					this.showElementsWithIDs([
						serviceCaseCreation.Ids.NSO_FLXBX,
						serviceCaseCreation.Ids.NSO_TXT								
						]);
					
				}
			}
			if(that.ServiceCaseModel.Category1 === "OTHE" && (that.ServiceCaseModel.Category2 === "01" || that.ServiceCaseModel.Category2 === "06")) {
				this.showElementsWithIDs([serviceCaseCreation.Ids.INPUT_CUSTPO_FLEX,serviceCaseCreation.Ids.CUSTPO_TEXT]);						
				this.hideElementsWithIDs([serviceCaseCreation.Ids.CUSTPO_INPUT]);
			}
		},
		
		/**
		 * This method validates the opportunity no
		 * @name onCustPoValidation
		 * @param
		 * @returns
		 */
		onCustPoValidation: function() {
			var view = this.getCurrentView(),
			mandatoryCheckReturn = this.mandatoryFieldCheck();
		var isMandatoryComboboxCheckSuccess = mandatoryCheckReturn[0],
			isMandatoryFieldCheckSuccess = mandatoryCheckReturn[1];

		if (isMandatoryComboboxCheckSuccess[0]) {
			if (isMandatoryFieldCheckSuccess) {
			if(this.getView().byId(serviceCaseCreation.Ids.NSO_CMBX).getSelectedKey().toUpperCase() === "YES") {				
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
				var oDataModel = new sap.ui.model.odata.ODataModel( serviceCaseCreation.util.ServiceConfigConstants.getServiceCasesInfoURL, oConfig);
				var that = this;			
				var CustPosuccess = function(result) {
					if(result.EvError) {
					that.getView().byId(serviceCaseCreation.Ids.CUSTPO_INPUT).setValueState("Error");
					MessageBox.error(result.EvError);
					} else {
						that.getView().byId(serviceCaseCreation.Ids.CUSTPO_INPUT).setValueState("None");
						that.onServiceCaseUpdate();
					}
				};
				if(that.getView().byId(serviceCaseCreation.Ids.CUSTPO_INPUT).getValue())
					oDataModel.read("/" + "OppotunityValidationSet('"+that.getView().byId(serviceCaseCreation.Ids.CUSTPO_INPUT).getValue().trim()+"')", { success: CustPosuccess});
				
			} else {
				this.onServiceCaseUpdate();
			}
			} /* Start of PCR033903++*/else {
				var mandatoryMsgToast = this.resourceBundle.getText("ServiceOrder.mandatoryMsgToast");
				MessageToast.show(mandatoryMsgToast);
			} /* End of PCR033903++*/
			} else {
				var allMandatoryMsgToast = this.resourceBundle.getText("ServiceOrder.allMandatoryMsgToast");
				MessageToast.show(allMandatoryMsgToast);
			}
		},
		
		/* End of  PCR034663++ */
	});

	return serviceOrderController;

});