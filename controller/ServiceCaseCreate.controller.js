/**
 * This class holds methods for Service Case Creation.
 *
 * @class
 * @public
 * @author Siva Prasad Paruchuri
 * @since 13 November 2016
 * @extends sap.ui.core.mvc.Controller
 * @name serviceCaseCreation.controller.ServiceCaseCreate
 *
 ** ------------------------------------------------------------------------------------*
 * Modifications.                                                                       *
 * -------------                                                                        *
 * Ver.No    Date       Author  	     PCR No.        Description of change           *
 * ------ ----------	---------------	----------	-----------------------------------	*
 * V00  	13/10/2016	Siva Prasad                         							*
 *          			Prachuri/Alok   PCR012146   initial version         			*
 *                  	(X087050)                                                       *
 * V01		29/06/2016	X087050     	PCR014777   Advance search changes,     		*
 *                          						Time and material combo box     	*
 *                          						error state             			*
 * V02		13/09/2017	X087050     	PCR015946   Entitlement correction.         	*
 * V03		13/11/2017	X087050     	PCR016459   China scenario internally funded	*
 *                          						Change position of PM Type for  	*
 *                          						preventive Maintenance.     		*
 * V04		01/08/2018	X087050     	PCR016664   Prj Order new category addition 	*
 *                          						for the category R&D default    	*
 *                          						ERP internal order      			*
 ****************************************************************************************
 * ------------------------------------------------------------------------ *
 *  Date        Author  	PCR No.          Description of change      	*
 * -------     ----------	----------   ---------------------------------- *
 * 01/18/2018  X087050  	PCR017289   Fixedbill mandatory issue       	*
 * 01/31/2018  X087924  	PCR017285   Disabling Esc key for busy dialog	*
 * 02/13/2018  X087924  	PCR017437   Category fields drop down values	*
 * 08/01/2018  X087924  	PCR018422   Malfunction Date-time changes   	*
 * 10/03/2018  X087924  	PCR020161   Indirect Labor Changes      		*
 * 11/19/2019  Vimal Pandu  PCR020942   KA Project changes      			*
 * 03/02/2020  X0108534 	PCR027291   Add the category 3 & Category4  	*
 * 03/30/2020  X0108534 	PCR027779   Shift pass down fields      		*
 * 11/08/2019  X0106872 	PCR026357	Service order at any assembly   	*
 * 07/13/2020  X0108534 	PCR030427   internal external notes issue   	*
 * 07/15/2020  X0106207 	PCR029992   SOW ID                      		*
 * 08/31/2020  X0108534 	PCR030996   ARK URL						    	*
 * 09/22/2020  X0108356 	PCR031702   IBase Implementation			    *
 * 12/01/2020  Vimal Pandu  PCR032539   PSE Sprint 10 changes			    *
 * 29/01/2021  X0108356		PCR033434   IBase Hypercare Defects Corrections *
 * 03/01/2021  X0108534  	PCR034663   NSO and Labor cancellation			*
 * 03/18/2021  X0108534  	PCR033903	FSO Q2                              *
 * 05/10/2021  X0115030     PCR035223   Currency Code Bug fix  				*
 * 05/27/2021  X089025      PCR035464   Upgrade issue resolution            *
 * -------------------------------------------------------------------------*/
sap.ui.define([
	'jquery.sap.global',
	'sap/m/MessageToast',
	'serviceCaseCreation/controller/BaseController',
	'sap/ui/core/Control',
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageBox" //IBase PCR031702++
], function(jQuery, MessageToast, Controller, Control, Filter, FilterOperator, MessageBox) { //PCR031702++

	var serviceCaseCreateController = Controller.extend("serviceCaseCreation.controller.ServiceCaseCreate", {

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf serviceCaseCreation.controller.Login
		 */
		onInit: function() {
			try {
				this.assignName = sap.ushell.Container.getUser().getFullName();
				this.Userid = sap.ushell.Container.getUser().getId();
			} catch (e) {
				this.Userid = "";
				this.assignName = "";
			}

			serviceCaseCreation.controller.BaseController.prototype.setComponentModelToCurrentViewModel.call(this, "ccServiceCaseModel");
			sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(this._onAttachRouteMatched, this);
			this.resourceBundle = this.getComponent().getModel("i18n").getResourceBundle();

			this.aLabels = [
				serviceCaseCreation.Ids.SERVICETYPE_LBL,
				serviceCaseCreation.Ids.FAB_LBL,
				serviceCaseCreation.Ids.MAJORASSEMBLY_LBL,
				serviceCaseCreation.Ids.ASSIGNTO_LBL,
				serviceCaseCreation.Ids.DATEPKR_LBL,
				serviceCaseCreation.Ids.TIMEPKR_LBL,
				serviceCaseCreation.Ids.NONCONFIRM_LBL,
				serviceCaseCreation.Ids.PROBLEMDESCRIPTION_LBL,
				serviceCaseCreation.Ids.CURRENCY_LBL,
				serviceCaseCreation.Ids.SYMPTOM_LBL,
				serviceCaseCreation.Ids.FAULT_LBL,
				serviceCaseCreation.Ids.CTIER_LBL,
				serviceCaseCreation.Ids.CATEGORIZATION_LBL,
				serviceCaseCreation.Ids.PMTYPE_LBL,
				serviceCaseCreation.Ids.ASSEM_LABEL, //PCR020942++
				serviceCaseCreation.Ids.TOOLSTAT_LABEL //PCR020942++
			];

			/*Begin of PCR020942++ changes*/

			this.getView().byId(serviceCaseCreation.Ids.COMBOBOX_CIDSYMPTOM).setVisible(false);

			var iCounter = 0;

			this.getCurrentView().addEventDelegate({
				onAfterShow: function() {
					if (!iCounter) {
						++iCounter;

						this.getView().byId(serviceCaseCreation.Ids.COMBOBOX_CIDSYMPTOM).setVisible(true);
					}
				}.bind(this)
			});

			/*End of PCR020942++ changes*/
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
			sap.ui.getCore().byId(serviceCaseCreation.Ids.APP_PAGE).byId(serviceCaseCreation.Ids.FIORI_CONTENT).setMode(sap.m.SplitAppMode.StretchCompressMode);
			sap.ui.getCore().byId(serviceCaseCreation.Ids.APP_PAGE).byId(serviceCaseCreation.Ids.FIORI_CONTENT).addStyleClass("svcCreate");//PCR033903++
			this.getRouter().navTo("serviceCreatetoMaster");

			jQuery.each(this.aLabels, function(i, oItem) {
				that.getView().byId(oItem).removeStyleClass("asteriskCC");
			});
		},

		/**
		 * This method is to change the screen level manipulations based on service type selected
		 * @name onTypeselectionChange
		 * @param
		 * @returns
		 */
		onTypeselectionChange: function() {
			var oView = this.getCurrentView(),
				servicetype = oView.byId(serviceCaseCreation.Ids.SERVICE_TYPE).getSelectedKey();

			oView.byId(serviceCaseCreation.Ids.COMBOBOX_CIDPMTYPE).setSelectedKey("");
			oView.byId(serviceCaseCreation.Ids.CREATE_CUSTOMER_TOOLID).setValue("");
			oView.byId(serviceCaseCreation.Ids.CREATE_SERIAL_NUMBER).setValue("");
			oView.byId(serviceCaseCreation.Ids.COMBOBOX_CIDCATEGORIZATION).setValue(""); //PCR020161++
			oView.byId(serviceCaseCreation.Ids.CREATE_FABID).setValue("");
			this.modelRefreshForCSF();
			this._resetIbaseModel(); /* IBase PCR031702++ */
			this.getView().byId(serviceCaseCreation.Ids.NSO_FLXBX).setVisible(false);//PCR034663++

			switch (servicetype) {
				case "ZPMO":
					this.ServiceType = "ZPMO";
					//hiding category flex based on the order type preventive maintenance
					this.showElements = [
						serviceCaseCreation.Ids.PM_TYPE_FLEX,
						serviceCaseCreation.Ids.PAID_SERVICE_TOOLBAR, //PCR020161++
						//serviceCaseCreation.Ids.PM_FLEX,        //PCR016459
						// serviceCaseCreation.Ids.CATEGORY_TOOLBAR1, //PCR016459
						serviceCaseCreation.Ids.CUST_LBL,
						serviceCaseCreation.Ids.TOOLBAR_CONTRACT,
						serviceCaseCreation.Ids.GRID_CONTRACT,
						serviceCaseCreation.Ids.GRID_PAID_SERVICE,
						serviceCaseCreation.Ids.SERVICECLASSIFICATION_FLEX,
						serviceCaseCreation.Ids.FIXBILL_FLEX,
						serviceCaseCreation.Ids.INPUT_CUSTPO_FLEX,
						serviceCaseCreation.Ids.TOOLSTAT_FLEX //PCR033903++
					];
					this.hideElements = [
						serviceCaseCreation.Ids.SYMPTOM_FLEX,
						serviceCaseCreation.Ids.TIER_FLEX,
						serviceCaseCreation.Ids.FAULT_FLEX,
						serviceCaseCreation.Ids.CATEGORIZATION_FLEX,
						serviceCaseCreation.Ids.CATEGORY_GRID,
						serviceCaseCreation.Ids.CATEGORY_TOOLBAR,
						serviceCaseCreation.Ids.OPPNO_LBL,
						serviceCaseCreation.Ids.ACC_FLEX,
						serviceCaseCreation.Ids.ACC_ASSIGN_FLEX,
						serviceCaseCreation.Ids.PAID_GRID1,
						serviceCaseCreation.Ids.CUST_PO_FLEX1,
						serviceCaseCreation.Ids.ACC_FLEX1,
						serviceCaseCreation.Ids.CONFIRM_FLEX,
						serviceCaseCreation.Ids.WAFER_FLEX,
						serviceCaseCreation.Ids.CATEGORY2_FLEX,
						// serviceCaseCreation.Ids.TOOLSTAT_FLEX, //PCR020942++ //PCR033903--
						serviceCaseCreation.Ids.ASSEM_FLEX, //PCR020942++
						serviceCaseCreation.Ids.C_MALFUNCDT_FLXBX, //PCR018422++
						serviceCaseCreation.Ids.C_MALFUNCTM_FLXBX //PCR018422++

					];

					this.getView().byId(serviceCaseCreation.Ids.INPUT_CUSTPO).setPlaceholder(this.custPoPlaceholder);
					var oPmTypeCombo = oView.byId(serviceCaseCreation.Ids.COMBOBOX_CIDPMTYPE);
					(oPmTypeCombo.getSelectedKey() == "") ? oPmTypeCombo.setValueState("Error"): oPmTypeCombo.setValueState("None");
					break;

				case "ZPRJ":
					this.ServiceType = "ZPRJ";
					this.getView().byId(serviceCaseCreation.Ids.NSO_FLXBX).setVisible(true);//PCR034663++
					//for project orders show only Categorization field in the category flex
					this.hideElements = [
						serviceCaseCreation.Ids.SYMPTOM_FLEX,
						serviceCaseCreation.Ids.TIER_FLEX,
						serviceCaseCreation.Ids.FAULT_FLEX,
						serviceCaseCreation.Ids.PM_TYPE_FLEX,
						//serviceCaseCreation.Ids.PM_FLEX,          //PCR016459
						//serviceCaseCreation.Ids.CATEGORY_TOOLBAR1,    //PCR016459
						serviceCaseCreation.Ids.CUST_LBL,
						serviceCaseCreation.Ids.ACC_FLEX,
						serviceCaseCreation.Ids.ACC_ASSIGN_FLEX,
						serviceCaseCreation.Ids.TOOLBAR_CONTRACT,
						serviceCaseCreation.Ids.GRID_CONTRACT,
						serviceCaseCreation.Ids.PAID_GRID1,
						serviceCaseCreation.Ids.CUST_PO_FLEX1,
						serviceCaseCreation.Ids.ACC_FLEX1,
						serviceCaseCreation.Ids.CONFIRM_FLEX,
						serviceCaseCreation.Ids.WAFER_FLEX,
						// serviceCaseCreation.Ids.TOOLSTAT_FLEX, //PCR020942++ //PCR033903--
						serviceCaseCreation.Ids.ASSEM_FLEX, //PCR020942++
						serviceCaseCreation.Ids.C_MALFUNCDT_FLXBX, //PCR018422++
						serviceCaseCreation.Ids.C_MALFUNCTM_FLXBX, //PCR018422++
						serviceCaseCreation.Ids.CATEGORY3_FLEX, //PCR027291++
						serviceCaseCreation.Ids.CATEGORY4_FLEX //PCR027291++
					];
					this.showElements = [
						serviceCaseCreation.Ids.CATEGORY_GRID,
						serviceCaseCreation.Ids.CATEGORY_TOOLBAR,
						serviceCaseCreation.Ids.CATEGORIZATION_FLEX,
						serviceCaseCreation.Ids.OPPNO_LBL,
						serviceCaseCreation.Ids.TOOLSTAT_FLEX //PCR033903++
					];

					this.getView().byId(serviceCaseCreation.Ids.INPUT_CUSTPO).setPlaceholder(this.oppPlaceholder);
					break;

				case "ZCMO":
					this.ServiceType = "ZCMO";
					//for corrective maintenace dont show categorization field but remaining fields need to show
					this.showElements = [
						serviceCaseCreation.Ids.CATEGORY_GRID,
						serviceCaseCreation.Ids.CATEGORY_TOOLBAR,
						serviceCaseCreation.Ids.SYMPTOM_FLEX,
						serviceCaseCreation.Ids.FAULT_FLEX,
						serviceCaseCreation.Ids.CUST_LBL,
						serviceCaseCreation.Ids.GRID_PAID_SERVICE,
						serviceCaseCreation.Ids.SERVICECLASSIFICATION_FLEX,
						serviceCaseCreation.Ids.FIXBILL_FLEX,
						serviceCaseCreation.Ids.INPUT_CUSTPO_FLEX,
						serviceCaseCreation.Ids.TOOLBAR_CONTRACT,
						serviceCaseCreation.Ids.GRID_CONTRACT,
						serviceCaseCreation.Ids.CONFIRM_FLEX,
						serviceCaseCreation.Ids.WAFER_FLEX,
						serviceCaseCreation.Ids.TOOLSTAT_FLEX, //PCR020942++
						serviceCaseCreation.Ids.ASSEM_FLEX, //PCR020942++
						serviceCaseCreation.Ids.C_MALFUNCDT_FLXBX, //PCR018422++
						serviceCaseCreation.Ids.C_MALFUNCTM_FLXBX, //PCR018422++
						serviceCaseCreation.Ids.PAID_SERVICE_TOOLBAR //PCR020161++
					];
					this.hideElements = [
						serviceCaseCreation.Ids.TIER_FLEX,
						serviceCaseCreation.Ids.CATEGORIZATION_FLEX,
						serviceCaseCreation.Ids.PM_TYPE_FLEX,
						//serviceCaseCreation.Ids.PM_FLEX,            //PCR016459
						// serviceCaseCreation.Ids.CATEGORY_TOOLBAR1,     //PCR016459
						serviceCaseCreation.Ids.OPPNO_LBL,
						serviceCaseCreation.Ids.ACC_FLEX,
						serviceCaseCreation.Ids.ACC_ASSIGN_FLEX,
						serviceCaseCreation.Ids.OPPNO_LBL,
						serviceCaseCreation.Ids.TOOLBAR_CONTRACT,
						serviceCaseCreation.Ids.GRID_CONTRACT,
						serviceCaseCreation.Ids.PAID_GRID1,
						serviceCaseCreation.Ids.CUST_PO_FLEX1,
						serviceCaseCreation.Ids.ACC_FLEX1,
						serviceCaseCreation.Ids.CATEGORY2_FLEX,
						serviceCaseCreation.Ids.CATEGORY3_FLEX, //PCR027291++
						serviceCaseCreation.Ids.CATEGORY4_FLEX //PCR027291++
					];

					this.getView().byId(serviceCaseCreation.Ids.INPUT_CUSTPO).setPlaceholder(this.custPoPlaceholder);
					break;

				default:
					break;
			}
			this._toggleElementsAvailability();
		},

		/**
		 * This method is gets Called for destroy dialog
		 * @name onCancelTool
		 * @param oEvnt - Current Event Parameter
		 * @returns
		 */
		onCancelTool: function(oEvnt) {
			this.destroyDialog();
			var oView = this.getView(),
				oModel = oView.getModel();

			if (oModel.getData()) {
				oModel.getData().d.results = [];
				oModel.refresh();
			}

			oView.byId(serviceCaseCreation.Ids.CREATE_CUSTOMER_TOOLID).setValue("");
			oView.byId(serviceCaseCreation.Ids.CREATE_SERIAL_NUMBER).setValue("");
			oView.byId(serviceCaseCreation.Ids.CREATE_SERIAL_NUMBER).setValue("");
		},

		/**
		 * This method is gets called when user fills Customer tool Id or serial number or Fab Id
		 * @name onSubmit
		 * @param oEvent- Current Event Parameter
		 * @returns
		 */
		onSubmit: function(oEvent) {
			var cust = oEvent.getSource().data("cust"),
				serial = oEvent.getSource().data("serial"),
				fab = oEvent.getSource().data("fab"),
				oView = this.getView();

			if (serial) {
				oView.byId(serviceCaseCreation.Ids.CREATE_CUSTOMER_TOOLID).setValue("");
				oView.byId(serviceCaseCreation.Ids.CREATE_FABID).setValue("");
			} else if (cust) {
				oView.byId(serviceCaseCreation.Ids.CREATE_SERIAL_NUMBER).setValue("");
				oView.byId(serviceCaseCreation.Ids.CREATE_FABID).setValue("");
			} else if (fab) {
				oView.byId(serviceCaseCreation.Ids.CREATE_SERIAL_NUMBER).setValue("");
				oView.byId(serviceCaseCreation.Ids.CREATE_CUSTOMER_TOOLID).setValue("");
			}

			this._resetIbaseModel(); /* IBase PCR031702++ */

			var customerToolId = oView.byId(serviceCaseCreation.Ids.CREATE_CUSTOMER_TOOLID).getValue().trim().toUpperCase(),
				serialNumber = oView.byId(serviceCaseCreation.Ids.CREATE_SERIAL_NUMBER).getValue().trim().toUpperCase(),
				fabId = oView.byId(serviceCaseCreation.Ids.CREATE_FABID).getValue().trim().toUpperCase(),
				serviceType = oView.byId(serviceCaseCreation.Ids.SERVICE_TYPE).getSelectedKey(),
				pmType = oView.byId(serviceCaseCreation.Ids.COMBOBOX_CIDPMTYPE).getSelectedKey(),
				date = oView.byId(serviceCaseCreation.Ids.START_DATE_DATEPICKER).getDateValue(),
				time = oView.byId(serviceCaseCreation.Ids.START_TIME_TIMEPICKER).getValue(),
				dateFormat = serviceCaseCreation.formatter.formatter.dateFormatIntoPost(date),
				dateTime = dateFormat + 'T' + time;

			if (customerToolId != "" || serialNumber != "" || fabId != "") {
				var sBusyDialogMsg = this.resourceBundle.getText("CreateServiceCase.BusyDialogMsg"),
					aEntitySet = "";
				serviceCaseCreation.fragmentHelper.dialogFragmentContent(this, "", "", "", sBusyDialogMsg);
				serviceCaseCreation.fragmentHelper.createDialogFragment(this.getCurrentView().getId(), this,
					"serviceCaseCreation.view.fragments.BusyDialog").open();
				customerToolId = encodeURIComponent(customerToolId);

				if (this.ServiceType == "ZCMO" || this.ServiceType == "ZPRJ") {
					//aEntitySet =
					// [serviceCaseCreation.util.ServiceConfigConstants.customerToooIdMaster+"?$filter=Customertoolid%20eq%20%27"+customerToolId+"%27%20and%20Serialnumber%20eq%20%27"+serialNumber+"%27%20and%20ServiceCaseType%20eq%20%27"+serviceType+"%27%20a+
					//nd%20Fabid%20eq%20%27"+fabId+"%27%20and%20Timestamp%20eq%20datetime%27"+dateTime+"%27"]; //PCR017437--
					aEntitySet = [serviceCaseCreation.util.ServiceConfigConstants.customerToooIdMaster +
						"?$expand=NavToSymptoms&$filter=Customertoolid%20eq%20%27" + customerToolId + "%27%20and%20Serialnumber%20eq%20%27" +
						serialNumber + "%27%20and%20ServiceCaseType%20eq%20%27" + serviceType + "%27%20and%20Fabid%20eq%20%27" + fabId +
						"%27%20and%20Timestamp%20eq%20datetime%27" + dateTime + "%27"
					]; //PCR017437++

					this.finishoDataModelregistartionProcessWithParams(
						serviceCaseCreation.util.EventTriggers.CUSTOMER_TOOLID_READ_SUCCESS,
						"handleCustomerToolFetchSuccess",
						serviceCaseCreation.util.EventTriggers.CUSTOMER_TOOLID_READ_FAIL,
						"handleCustomerToolFetchFail",
						aEntitySet[0],
						serviceCaseCreation.util.ServiceConfigConstants.get, "", "", "",
						serviceCaseCreation.util.EventTriggers.TRIGGER_CUSTOMER_TOOLID_READ
					);
				}

				if (this.ServiceType == "ZPMO") {
					if (pmType) {
						aEntitySet = [serviceCaseCreation.util.ServiceConfigConstants.customerToooIdMaster + "?$filter=Customertoolid%20eq%20%27" +
							customerToolId + "%27%20and%20Serialnumber%20eq%20%27" + serialNumber + "%27%20and%20ServiceCaseType%20eq%20%27" + serviceType +
							"%27%20and%20Fabid%20eq%20%27" + fabId + "%27%20and%20PmType%20eq%20%27" + pmType + "%27%20and%20Timestamp%20eq%20datetime%27" +
							dateTime + "%27"
						];
						this.finishoDataModelregistartionProcessWithParams(
							serviceCaseCreation.util.EventTriggers.CUSTOMER_TOOLID_READ_SUCCESS,
							"handleCustomerToolFetchSuccess",
							serviceCaseCreation.util.EventTriggers.CUSTOMER_TOOLID_READ_FAIL,
							"handleCustomerToolFetchFail",
							//aEntitySet, //PCR020161--
							aEntitySet[0], //PCR020161++
							serviceCaseCreation.util.ServiceConfigConstants.get, "", "", "",
							serviceCaseCreation.util.EventTriggers.TRIGGER_CUSTOMER_TOOLID_READ
						);
					} else {
						this.destroyDialog();
						oView.byId(serviceCaseCreation.Ids.COMBOBOX_CIDPMTYPE).setValueState("Error");

						var sPMTypeCheckMsg = this.resourceBundle.getText("CreateServiceCase.PMTypeCheck");
						MessageToast.show(sPMTypeCheckMsg);
					}
				}
			}
		},

		/*Begin of PCR020942++ changes*/

		_fnFetchAssemData: function(sEquipNo) {
			var sBusyDialogMsg = this.resourceBundle.getText("CreateServiceCase.BusyDialogMsg");
			var sAssemQuery = serviceCaseCreation.util.ServiceConfigConstants.assemblyListSet +
				"?$filter=IvProcessType%20eq%20%27ZCMO%27%20and%20IvEquipment%20eq%20%27" + sEquipNo + "%27";

			serviceCaseCreation.fragmentHelper.dialogFragmentContent(this, "", "", "", sBusyDialogMsg);
			serviceCaseCreation.fragmentHelper.createDialogFragment(this.getCurrentView().getId(), this,
				"serviceCaseCreation.view.fragments.BusyDialog").open();

			this.finishoDataModelregistartionProcessWithParams(
				serviceCaseCreation.util.EventTriggers.ASSEM_READ_SUCCESS,
				"handleAssemblyDataFetchSuccess",
				serviceCaseCreation.util.EventTriggers.ASSEM_READ_FAIL,
				"handleCustomerToolFetchFail",
				sAssemQuery,
				serviceCaseCreation.util.ServiceConfigConstants.get, "", "", "",
				serviceCaseCreation.util.EventTriggers.TRIGGER_ASSEM_READ
			);
		},

		handleAssemblyDataFetchSuccess: function(oSuccess) {
			//  this.destroyDialog();    //IBase PCR031702--

			this.getView().byId(serviceCaseCreation.Ids.ASSEM_CMBX).setModel(sap.ui.getCore().getModel("ccAssemListModel"));
			this._fnFetchIBaseValid(); //IBase PCR031702++
		},

		/*End of PCR020942++ changes*/

		/*Begin of IBase PCR031702++ changes*/
		/**
		 * This method is to fetch Valid Ibase Flag.
		 * @name _fetchIBaseValid
		 * @param
		 * @returns
		 */
		_fnFetchIBaseValid: function() {
			var oServiceCaseModel = sap.ui.getCore().getModel("ccServiceCaseCreateModel"),
				sEquipment = oServiceCaseModel.getData().d.results[0].Equipment,
				sSerial = oServiceCaseModel.getData().d.results[0].Serialnumber,
				sCustToolId = encodeURIComponent(oServiceCaseModel.getData().d.results[0].Customertoolid.trim()); // PCR033434++
			var oIbaseModel = this.getOwnerComponent().getModel(serviceCaseCreation.constants.IBaseModel);
			oIbaseModel.setProperty("/iBaseUrl", true);

			this.finishoDataModelregistartionProcessWithParams(serviceCaseCreation.util.EventTriggers.IBASE_VALID_READ_SUCCESS,
				"handleIbaseValidFetchSuccess", serviceCaseCreation.util.EventTriggers.IBASE_VALID_READ_FAIL,
				"handleIbaseValidFetchError", serviceCaseCreation.util.ServiceConfigConstants.ibaseValidSet +
				"?$filter=ToolId%20eq%20%27" + sEquipment + "%27%20and%20SerialNumber%20eq%20%27" + sSerial +
				"%27%20and%20CustomerToolId%20eq%20%27" + sCustToolId +
				"%27%20and%20ProcessType%20eq%20%27%27%20and%20CategoryCode%20eq%20%27%27",
				serviceCaseCreation.util.ServiceConfigConstants.get, "", "", "",
				serviceCaseCreation.util.EventTriggers.TRIGGER_IBASE_VALID_READ);
		},

		/**
		 * This method is for Success service call of _fetchIBaseValid.
		 * @name handleIbaseValidFetchSuccess
		 * @param oRes
		 * @returns
		 */
		handleIbaseValidFetchSuccess: function(oRes) {
			this.destroyDialog();
			var oIbaseModel = this.getOwnerComponent().getModel(serviceCaseCreation.constants.IBaseModel),
				oIbaseMandateModel = sap.ui.getCore().getModel(serviceCaseCreation.constants.ibaseMandateModel);
			var bValid = (oIbaseMandateModel.getData().d.results[0].EquipValidForImt === "X" ? true : false);
			var equiCombobox = this.getView().byId(serviceCaseCreation.Ids.COMBOBOX_EQUIPMENT);
			oIbaseModel.setProperty("/iBaseUrl", false);
			oIbaseModel.setProperty("/iBaseValid", bValid);

			if (bValid)
				oIbaseModel.setProperty("/custSuggestBtn", true);
			else
				oIbaseModel.setProperty("/custSuggestBtn", false);

			this._formatMissingAssembly(equiCombobox);

		},
		/**
		 * This method is for Failure service call of _fetchIBaseValid.
		 * @name handleIbaseValidFetchError
		 * @param oRes
		 * @returns
		 */
		handleIbaseValidFetchError: function(oRes) {
			this.destroyDialog();
			var errormessage = oRes.getParameter("d").ErrorMessage;
			var oIbaseModel = this.getOwnerComponent().getModel(serviceCaseCreation.constants.IBaseModel);
			oIbaseModel.setProperty("/iBaseUrl", false);
			MessageToast.show("IBase: " + errormessage);

		},
		/*End of IBase PCR031702++ changes*/

		/**
		 * This method is called on change of Customer Tool ID or Serial no. or Fab ID.
		 * @name modelRefreshForCSF
		 * @param
		 * @returns
		 */
		modelRefreshForCSF: function() {
			var oView = this.getView(),
				equiCombobox = oView.byId(serviceCaseCreation.Ids.COMBOBOX_EQUIPMENT),
				_Assemblydetails = {
					d: {
						results: []
					}
				};

			assemblyDetailModel = new sap.ui.model.json.JSONModel();
			assemblyDetailModel.setData(_Assemblydetails);
			sap.ui.getCore().setModel(assemblyDetailModel, "ccAssemblyDetailModel");
			equiCombobox.setModel(assemblyDetailModel);
			equiCombobox.setSelectedKey("");

			var oModel = oView.getModel(),
				oData = oModel.getData().d;

			if (oData) {
				oModel.getData().d.results = [];
				oModel.refresh();
				oModel.updateBindings(true);
			}
		},

		/**
		 * This method is called on change of Customer Tool ID.
		 * @name onCustomerToolIDLiveChange
		 * @param oEvent - Current Event Parameter
		 * @returns
		 */
		onCustomerToolIDLiveChange: function(oEvent) {
			this.modelRefreshForCSF();
			this._resetIbaseModel(); /* IBase PCR031702++ */
			var oView = this.getView();
			//if customer tool id is empty then empty serial number
			oView.byId(serviceCaseCreation.Ids.CREATE_SERIAL_NUMBER).setValue("");
			oView.byId(serviceCaseCreation.Ids.CREATE_FABID).setValue("");
			this.hideElementsWithIDs([serviceCaseCreation.Ids.CURRENCY_FLEX]);

			if (oView.byId(serviceCaseCreation.Ids.SERVICE_TYPE).getSelectedKey() === "ZCMO" && !oEvent.getSource().getValue().length) //PCR017437++
				this._fnClearSympLevelElementsBindings(); //PCR017437++
		},

		/**
		 * This method is called on change of Serial  Number
		 * @name onSerialNumberLiveChange
		 * @param oEvent - Current Event Parameter
		 * @returns
		 */
		onSerialNumberLiveChange: function(oEvent) {
			this.modelRefreshForCSF();
			this._resetIbaseModel(); /* IBase PCR031702++ */

			var oView = this.getView();
			oView.byId(serviceCaseCreation.Ids.CREATE_CUSTOMER_TOOLID).setValue("");
			oView.byId(serviceCaseCreation.Ids.CREATE_FABID).setValue("");

			if (oView.byId(serviceCaseCreation.Ids.SERVICE_TYPE).getSelectedKey() === "ZCMO" && !oEvent.getSource().getValue().length) //PCR017437++
				this._fnClearSympLevelElementsBindings(); //PCR017437++

			this.hideElementsWithIDs([serviceCaseCreation.Ids.CURRENCY_FLEX]);
		},

		/**
		 * This method is called on change of FabID
		 * @name onFabIdLiveChange
		 * @param oEvent - Current Event Parameter
		 * @returns
		 */
		onFabIdLiveChange: function(oEvent) {
			this.modelRefreshForCSF();
			this._resetIbaseModel(); /* IBase PCR031702++ */
			var oView = this.getView();
			oView.byId(serviceCaseCreation.Ids.CREATE_CUSTOMER_TOOLID).setValue("");
			oView.byId(serviceCaseCreation.Ids.CREATE_SERIAL_NUMBER).setValue("");
			if (oView.byId(serviceCaseCreation.Ids.SERVICE_TYPE).getSelectedKey() === "ZCMO" && !oEvent.getSource().getValue().length) //PCR017437++
				this._fnClearSympLevelElementsBindings(); //PCR017437++

			this.hideElementsWithIDs([serviceCaseCreation.Ids.CURRENCY_FLEX]);

			var sValueState = (oEvent.getSource().getValue().length) ? "None" : "Error";
			oEvent.getSource().setValueState(sValueState);
		},

		/**
		 * This method called on Assembly value change
		 * @name onChangeEquipment
		 * @param oEvent - Current Event Parameter
		 * @returns
		 */
		onChangeEquipment: function(oEvent) {
			var oView = this.getCurrentView(),
				assembly = oEvent.getSource().getSelectedKey(),
				contractDetails = [],
				_serviceCaseCreateModel = sap.ui.getCore().getModel("ccServiceCaseCreateModel"),
				_assemblyDetailModel = sap.ui.getCore().getModel("ccAssemblyDetailModel");

			oView.byId(serviceCaseCreation.Ids.COMBOBOX_FIXBILLING).setValueState(sap.ui.core.ValueState.None); //PCR017289++
			this._sPath = oEvent.getSource().getSelectedItem().getBindingContext().getPath();
			oView.setModel(_assemblyDetailModel);
			oView.bindElement(this._sPath);
			oView.getModel().updateBindings();

			jQuery.each(_serviceCaseCreateModel.getData().d.results, function(i, oItem) {
				if (oItem.Assembly == assembly)
					contractDetails.push(oItem);
			});

			this._Contractdetails = contractDetails;
			var i = this._sPath.split('/')[3]
			viewdata = oView.getModel().getData().d.results[i];
			this._FnClearExitingFiltersAndBindNewData(viewdata); //PCR017437++

			/*Begin of IBase PCR031702++*/
			var oIbaseModel = this.getOwnerComponent().getModel(serviceCaseCreation.constants.IBaseModel);
			var showPosBtn = ((viewdata.Assemblydesc.indexOf(serviceCaseCreation.constants.CHAMBER) >= 0) || (viewdata.Assemblydesc.indexOf(serviceCaseCreation.constants.Chamber) >= 0)) ? true :
				false;
			var showAssmBtn = (viewdata.Assembly.indexOf(serviceCaseCreation.constants.MA) >= 0) ? true : false;
			var bValid = oIbaseModel.getProperty("/iBaseValid");

			if (bValid) {
				oIbaseModel.setProperty("/posSuggestBtn", showPosBtn);
				oIbaseModel.setProperty("/assmSuggestBtn", showAssmBtn);

				if (showAssmBtn)
					this.getView().byId(serviceCaseCreation.Ids.IBASE_BTN_ADDASSEMBLY).firePress();

			}
			/*End of IBase PCR031702++*/

			(assembly != "NA" || assembly != serviceCaseCreation.constants.MA) ? //IBase PCR031702++
			oView.byId(serviceCaseCreation.Ids.TEXT_CHAMBER).setText(viewdata.Assemblydesc):
				oView.byId(serviceCaseCreation.Ids.TEXT_CHAMBER).setText(viewdata.Equipmentdescription);

			this.Country = viewdata.Soldtocountry;

			if (viewdata.Soldtocountry == "CN") {
				oView.byId(serviceCaseCreation.Ids.CURRENCY_ID).setSelectedKey("");
				this.showElementsWithIDs([serviceCaseCreation.Ids.CURRENCY_FLEX]);

				//Currency value defaulting and manipulation based on Condition
				if (viewdata.Multicurrencyflag == "X") {
					oView.byId(serviceCaseCreation.Ids.CURRENCY_ID).setEnabled(true);
					oView.byId(serviceCaseCreation.Ids.SERVICE_CONTRACT_TEXT).setText(" ");
					oView.byId(serviceCaseCreation.Ids.WARRANTY_TEXT).setText(" ");
				} else {
					if (viewdata.Warrantyid == "" && viewdata.Servicecontract == "") {
						oView.byId(serviceCaseCreation.Ids.CURRENCY_ID).setEnabled(true);
					}
					if (viewdata.Warrantyid != "" && viewdata.Servicecontract == "") {
						oView.byId(serviceCaseCreation.Ids.CURRENCY_ID).setEnabled(false);
						oView.byId(serviceCaseCreation.Ids.CURRENCY_ID).setSelectedKey("O 50001140");
					}
					if (viewdata.Servicecontract != "") {
						oView.byId(serviceCaseCreation.Ids.CURRENCY_ID).setEnabled(false);
						if (viewdata.Contractcurrency == "USD") {
							oView.byId(serviceCaseCreation.Ids.CURRENCY_ID).setSelectedKey("O 50001140");
						} else if (viewdata.Contractcurrency == "RMB") {
							oView.byId(serviceCaseCreation.Ids.CURRENCY_ID).setSelectedKey("O 50001139");
						}
					}
				}

				/*start of PCR016459++*/
				if (oView.byId(serviceCaseCreation.Ids.COMBOBOX_CIDCATEGORIZATION).getSelectedKey() === "07") {
					var currencyCombo = oView.byId(serviceCaseCreation.Ids.CURRENCY_ID);
					currencyCombo.setSelectedKey("O 50001140");
					currencyCombo.setEnabled(false);
					currencyCombo.setValueState("None");
				}
				/*end of PCR016459++*/
			} else {
				this.showElements = [];
				this.hideElements = [serviceCaseCreation.Ids.CURRENCY_FLEX, ]
				this._toggleElementsAvailability();
			}

			//setting warranty default if both  contract warranty exists.
			this.warranty = oView.byId(serviceCaseCreation.Ids.WARRANTY_TEXT).getText();

			if (this.warranty != " ") {
				oView.byId(serviceCaseCreation.Ids.SERVICE_CONTRACT_TEXT).setText(" ");
			}

			if (this.warranty.indexOf("WTY0001") >= 0 || this.warranty.indexOf("WTY0003") >= 0)
				this.showElementsWithIDs([
					serviceCaseCreation.Ids.TIER_FLEX,
				]);
			else
				this.hideElementsWithIDs([
					serviceCaseCreation.Ids.TIER_FLEX,
				]);

			this.serviceContract = oView.byId(serviceCaseCreation.Ids.SERVICE_CONTRACT_TEXT).getText();
			var mandatoryCheck = this.onMandatoryFieldCheck("change");
			var sValueState = (oEvent.getSource().getValue().length) ? "None" : "Error";
			oEvent.getSource().setValueState(sValueState);
			/*start of PCR026357++*/
			if (((this.warranty == " ") || (this.warranty == "")) && ((this.serviceContract == " ") || (this.serviceContract == ""))) {
				var oldEquipment = viewdata.Equipmentdescription,
					oldSrvContract = viewdata.Servicecontract + " " + viewdata.Servicecontractdescription,
					oldSrvWarranty = viewdata.Warrantyid + " " + viewdata.Warrantyiddescription;
				jQuery.each(_serviceCaseCreateModel.getData().d.results, function(i, oItem) {
					if ((oItem.Assembly == 'NA' || oItem.Assembly == serviceCaseCreation.constants.MA) && (oItem.Assemblydesc == 'System' || oItem.Assemblydesc == 'SYSTEM' ||
							oItem.Assemblydesc == serviceCaseCreation.constants.MISSINGMAJORASSEMBLY || oItem.Assemblydesc == serviceCaseCreation.constants.MissingMajorAssembly)) { //IBase PCR031702++
						oldEquipment = oItem.Equipmentdescription;
						oldSrvContract = oItem.Servicecontract + " " + oItem.Servicecontractdescription;
						oldSrvWarranty = oItem.Warrantyid + " " + oItem.Warrantyiddescription;
					}
				});
				oView.byId(serviceCaseCreation.Ids.TEXT_CHAMBER).setText(oldEquipment);
				if (oldSrvWarranty != " ") {
					oldSrvContract = " ";
				}
				if (oldSrvWarranty.indexOf("WTY0001") >= 0 || oldSrvWarranty.indexOf("WTY0003") >= 0)
					this.showElementsWithIDs([
						serviceCaseCreation.Ids.TIER_FLEX,
					]);
				else
					this.hideElementsWithIDs([
						serviceCaseCreation.Ids.TIER_FLEX,
					]);
				oView.byId(serviceCaseCreation.Ids.SERVICE_CONTRACT_TEXT).setText(oldSrvContract);
				oView.byId(serviceCaseCreation.Ids.WARRANTY_TEXT).setText(oldSrvWarranty);
				if (oldSrvContract == " " && oldSrvWarranty == " ") {
					oView.byId(serviceCaseCreation.Ids.COMBOBOX_FIXBILLING).setValueState(sap.ui.core.ValueState.Error);
				} else {
					oView.byId(serviceCaseCreation.Ids.COMBOBOX_FIXBILLING).setValueState(sap.ui.core.ValueState.None);
				}
			}
			if (oView.byId(serviceCaseCreation.Ids.SERVICE_TYPE).getSelectedKey() === "ZCMO") {
				oView.byId(serviceCaseCreation.Ids.ASSEM_CMBX).setSelectedKey(viewdata.Assemblydesc);
				oView.byId(serviceCaseCreation.Ids.ASSEM_CMBX).setValueState(sap.ui.core.ValueState.None);
			}
			/*end of PCR026357++*/
		},

		/**
		 * This method is to push fault item a/c to selection of symptom key.
		 * @name onSymptomSelect
		 * @param oEvent - Current Event Parameter
		 * @returns
		 */
		/*
		    onSymptomSelect: function(oEvent) {
		      var oSource = oEvent.getSource();
		      var sValueState = (oEvent.getSource().getValue().length) ? "None" : "Error";
		      oEvent.getSource().setValueState(sValueState);
		      var Symptomkey = oSource.getSelectedKey(),
		        aFault = [];

		      jQuery.each(sap.ui.getCore().getModel("ccMasterListModel").getData().masterListSets.fault, function(i, item) {
		        if (item.ParentGuidKey == Symptomkey)
		          aFault.push(item)
		      });

		      var faultModel = new sap.ui.model.json.JSONModel();
		      faultModel.setData(aFault);
		      this.getCurrentView().byId(serviceCaseCreation.Ids.COMBOBOX_CIDFAULT).setSelectedKey("");
		      this.getCurrentView().byId(serviceCaseCreation.Ids.COMBOBOX_CIDFAULT).setModel(faultModel);
		      serviceCaseCreation.util.Util.filterSymptomLevelTwoBindings.call(this, oSource.getValue(), serviceCaseCreation.Ids.COMBOBOX_CIDFAULT); //PCR017437++
		    },*/

		/**
		 * This method is to Validate the wrong values in combobox
		 * @name onInputLiveChangeCombox
		 * @param oEvent - Current Event Parameter
		 * @returns
		 */
		onInputLiveChangeCombox: function(oEvent) {
			var sEventId = oEvent.getSource().getId();
			serviceCaseCreation.util.Util.doCompleteComboBoxElementsValidation(this, [sEventId]);
			/*V01*/
			if (sEventId.indexOf("FixBilling") >= 0) {
				this.onChangeFixbilling(oEvent);
			}
			/*V01*/
		},

		/*start of PCR018422++ changes; Malfunction Date validation*/

		/**
		 * This method is to check start date validation .
		 * @name dateChange
		 * @param oEvent - Current Event Parameter
		 * @returns
		 */
		dateChange: function(oEvent) {
			/*var today = new Date();
			var dd = today.getDate();
			var mm = today.getMonth()+1; //January is 0!
			var yyyy = today.getFullYear();

			if (dd<10)
			  dd='0'+dd;
			if (mm<10)
			  mm='0'+mm;

			var today = yyyy+'/'+mm+'/'+dd;
			if(oEvent.getParameter("invalidValue")){
			  oEvent.oSource.setValueState("Error");
			} else {
			  var oView = this.getView();
			  var inpDt = oView.byId(serviceCaseCreation.Ids.START_DATE_DATEPICKER).getValue();
			  var rRegexForDtFormat = /^([012]?\d|3[01])-([Jj][Aa][Nn]|[Ff][Ee][bB]|[Mm][Aa][Rr]|[Aa][Pp][Rr]|[Mm][Aa][Yy]|[Jj][Uu][Nn]|[Jj][u]l|[aA][Uu][gG]|[Ss][eE][pP]|[oO][Cc]|[Nn][oO][Vv]|[Dd][Ee][Cc])-(19|20)\d\d$/;
			    if( rRegexForDtFormat.test(inpDt)) {
			    var inputDateValue = oView.byId(serviceCaseCreation.Ids.START_DATE_DATEPICKER).getDateValue();
			    var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy/MM/dd"});
			    var inputDate = dateFormat.format(new Date(inputDateValue));
			    if (inputDate < today){
			      oEvent.oSource.setValueState("Error")
			    } else {
			      oEvent.oSource.setValueState("None");
			    }
			    } else {
			      oEvent.oSource.setValueState("Error")
			    }
			}*/

			var oElement = oEvent.getSource();
			var elementValue;
			var regexForDtFormat =
				/^([012]?\d|3[01])-([Jj][Aa][Nn]|[Ff][Ee][bB]|[Mm][Aa][Rr]|[Aa][Pp][Rr]|[Mm][Aa][Yy]|[Jj][Uu][Nn]|[Jj][u]l|[aA][Uu][gG]|[Ss][eE][pP]|[Oo][Cc][Tt]|[Nn][oO][Vv]|[Dd][Ee][Cc])-(19|20)\d\d$/;
			var sElementValue = oElement.getValue(),
				oElementDTValue = oElement.getDateValue();

			if (oElementDTValue) {
				elementValue = oElementDTValue;
			} else if (sElementValue && regexForDtFormat.test(sElementValue)) {
				var odate = sElementValue;
				odate = odate.split('-').join(' ');
				elementValue = new Date(odate);
			} else if (!oElementDTValue && !regexForDtFormat.test(sElementValue)) {
				elementValue = sElementValue;
			}

			if (typeof elementValue !== "object") {
				oElement.setValueState("Error")
			} else {
				oElement.setValueState("None");
			}
		},

		/*End of PCR018422++ changes*/

		/**
		 * This method is called on Change of Fix Billing Field .
		 * @name onChangeFixbilling
		 * @param oEvent - Current Event Parameter
		 * @returns
		 */
		onChangeFixbilling: function(oEvent) {
			var oView = this.getCurrentView();

			if (oEvent.getSource().getSelectedKey() != "") {
				oView.byId(serviceCaseCreation.Ids.COMBOBOX_SERVICECLASSIFICATION_CREATE).setSelectedKey("CPS1");
				oView.byId(serviceCaseCreation.Ids.TEXT_WARRANTYID).setText("");
				oView.byId(serviceCaseCreation.Ids.SERVICE_CONTRACT_TEXT).setText("");
			} else {
				oView.byId(serviceCaseCreation.Ids.COMBOBOX_SERVICECLASSIFICATION_CREATE).setSelectedKey("");
				oView.byId(serviceCaseCreation.Ids.TEXT_WARRANTYID).setText(this.warranty);
				oView.byId(serviceCaseCreation.Ids.SERVICE_CONTRACT_TEXT).setText(this.serviceContract);
			}
			//if(this.Country == "CN"){ PCR016459 --
			if (this.Country == "CN" && oView.byId(serviceCaseCreation.Ids.COMBOBOX_CIDCATEGORIZATION).getSelectedKey() !== "07") { //PCR016459 ++
				oView.byId(serviceCaseCreation.Ids.CURRENCY_ID).setEnabled(true);
				oView.byId(serviceCaseCreation.Ids.CURRENCY_ID).setSelectedKey("");
			}

			/*V01*/
			//PCR017289 Changed oEvent.getSource().getValue() to oEvent.getSource().getSelectedKey()
			var sValueState = (this.warranty == " " && this.serviceContract == " " && (oEvent.getSource().getSelectedKey() == "")) ? "Error" :
				"None";
			/*V01*/
			oEvent.getSource().setValueState(sValueState);
			if (this.warranty !== " " || this.serviceContract !== " ") //PCR017289++
				serviceCaseCreation.util.Util.doCompleteComboBoxElementsValidation(this, [oEvent.getSource().getId()]); //PCR017289++
			/*if(sValueState === "None" || this.warranty != "" || this.serviceContract != "")
			  serviceCaseCreation.util.Util.doCompleteComboBoxElementsValidation(this,[serviceCaseCreation.Ids.COMBOBOX_FIXBILLING]);*/
		},

		/**
		 * This method is called on live Change of serial number  .
		 * @name srNoChange
		 * @param oEvent - Current Event Parameter
		 * @returns
		 */
		srNoChange: function(oEvent) {
			var sValueState = (oEvent.getSource().getValue().trim().length) ? "None" : "Error";
			oEvent.getSource().setValueState(sValueState);
		},

		/**
		 * This method is called on Change of PmType Dropdown  .
		 * @name onChangePmType
		 * @param
		 * @returns
		 */
		onChangePmType: function() {
			var oView = this.getCurrentView();

			if (oView.byId(serviceCaseCreation.Ids.COMBOBOX_CIDPMTYPE).getSelectedKey()) {
				var customerToolId = oView.byId(serviceCaseCreation.Ids.CREATE_CUSTOMER_TOOLID).getValue().toUpperCase();
				var serialNumber = oView.byId(serviceCaseCreation.Ids.CREATE_SERIAL_NUMBER).getValue().toUpperCase();
				var fabId = oView.byId(serviceCaseCreation.Ids.CREATE_FABID).getValue().toUpperCase();
				var serviceType = oView.byId(serviceCaseCreation.Ids.SERVICE_TYPE).getSelectedKey();
				var pmType = oView.byId(serviceCaseCreation.Ids.COMBOBOX_CIDPMTYPE).getSelectedKey();
				date = oView.byId(serviceCaseCreation.Ids.START_DATE_DATEPICKER).getDateValue();
				time = oView.byId(serviceCaseCreation.Ids.START_TIME_TIMEPICKER).getValue();
				var dateFormat = serviceCaseCreation.formatter.formatter.dateFormatIntoPost(date);
				var dateTime = dateFormat + 'T' + time;

				if (customerToolId != "" || serialNumber != "" || fabId != "") {
					if (serialNumber) {
						customerToolId = "";
						fabId = "";
					} else if (customerToolId) {
						serialNumber = "";
						fabId = "";
					} else if (fabId) {
						serialNumber = "";
						customerToolId = "";
					}

					var sBusyDialogMsg = this.resourceBundle.getText("CreateServiceCase.BusyDialogMsg"),
						aEntitySet = "";
					serviceCaseCreation.fragmentHelper.dialogFragmentContent(this, "", "", "", sBusyDialogMsg);
					serviceCaseCreation.fragmentHelper.createDialogFragment(this.getCurrentView().getId(), this,
						"serviceCaseCreation.view.fragments.BusyDialog").open();

					aEntitySet = [serviceCaseCreation.util.ServiceConfigConstants.customerToooIdMaster + "?$filter=Customertoolid%20eq%20%27" +
						customerToolId + "%27%20and%20Serialnumber%20eq%20%27" + serialNumber + "%27%20and%20ServiceCaseType%20eq%20%27" + serviceType +
						"%27%20and%20Fabid%20eq%20%27" + fabId + "%27%20and%20PmType%20eq%20%27" + pmType + "%27%20and%20Timestamp%20eq%20datetime%27" +
						dateTime + "%27"
					];
					this.finishoDataModelregistartionProcessWithParams(serviceCaseCreation.util.EventTriggers.CUSTOMER_TOOLID_READ_SUCCESS,
						"handleCustomerToolFetchSuccess",
						serviceCaseCreation.util.EventTriggers.CUSTOMER_TOOLID_READ_FAIL,
						"handleCustomerToolFetchFail",
						aEntitySet,
						serviceCaseCreation.util.ServiceConfigConstants.get, "", "", "", serviceCaseCreation.util.EventTriggers.TRIGGER_CUSTOMER_TOOLID_READ
					);
				}
				oView.byId(serviceCaseCreation.Ids.COMBOBOX_CIDPMTYPE).setValueState("None");
			} else {
				oView.byId(serviceCaseCreation.Ids.COMBOBOX_CIDPMTYPE).setValueState("Error");
				oView.byId(serviceCaseCreation.Ids.CREATE_CUSTOMER_TOOLID).setValue("");
				oView.byId(serviceCaseCreation.Ids.CREATE_SERIAL_NUMBER).setValue("");
				oView.byId(serviceCaseCreation.Ids.CREATE_FABID).setValue("");
				this.modelRefreshForCSF();
			}
		},

		/**
		 * This method is called on Change of Category Dropdown  .
		 * @name onCategorisationChange
		 * @param oEvent - Current Event Parameter
		 * @returns
		 */
		onCategorisationChange: function(oEvent) {
			var oView = this.getView();
			var sValueState = (oEvent.getSource().getValue().length) ? "None" : "Error";
			oEvent.getSource().setValueState(sValueState);
			var selKey = oEvent.getSource().getSelectedKey();
			var sGuidkey = oEvent.getSource().getSelectedItem().getBindingContext().getObject().KeyValue2;

			/* Start of PCR016459 ++ */
			var bindData = oView.getModel().getData();
			if (bindData.d) {
				//if (bindData.d.results[0].Soldtocountry = "CN") {  //PCR035223--
				if (bindData.d.results[0].Soldtocountry === "CN") {  //PCR035223++
					var currencyCombo = oView.byId(serviceCaseCreation.Ids.CURRENCY_ID);
					currencyCombo.setSelectedKey("");
					currencyCombo.setEnabled(true);
					currencyCombo.setValueState("Error");
				}
			}
			/* end of PCR016459 ++ */

			switch (selKey) {
				case "02":
					this.showElements = [
						serviceCaseCreation.Ids.SERVICECLASSIFICATION_FLEX,
						serviceCaseCreation.Ids.FIXBILL_FLEX,
						serviceCaseCreation.Ids.INPUT_CUSTPO_FLEX,
						serviceCaseCreation.Ids.GRID_PAID_SERVICE,
						serviceCaseCreation.Ids.PAID_SERVICE_TOOLBAR //PCR020161++
					]
					this.hideElements = [
						serviceCaseCreation.Ids.ACC_FLEX,
						serviceCaseCreation.Ids.ACC_ASSIGN_FLEX,
						serviceCaseCreation.Ids.PAID_GRID1,
						serviceCaseCreation.Ids.CUST_PO_FLEX1,
						serviceCaseCreation.Ids.ACC_FLEX1,
						serviceCaseCreation.Ids.CATEGORY2_FLEX,
						serviceCaseCreation.Ids.CATEGORY3_FLEX, //PCR027291++
						serviceCaseCreation.Ids.CATEGORY4_FLEX, //PCR027291++
					]
					break;

				case "03":
					this.showElements = [
						serviceCaseCreation.Ids.PAID_SERVICE_TOOLBAR, //PCR020161++
						serviceCaseCreation.Ids.PAID_GRID1,
						serviceCaseCreation.Ids.CUST_PO_FLEX1,
						serviceCaseCreation.Ids.ACC_FLEX1
					]
					this.hideElements = [
						serviceCaseCreation.Ids.SERVICECLASSIFICATION_FLEX,
						serviceCaseCreation.Ids.FIXBILL_FLEX,
						serviceCaseCreation.Ids.ACC_ASSIGN_FLEX,
						serviceCaseCreation.Ids.GRID_PAID_SERVICE,
						serviceCaseCreation.Ids.CATEGORY2_FLEX,
						serviceCaseCreation.Ids.CATEGORY3_FLEX, //PCR027291++
						serviceCaseCreation.Ids.CATEGORY4_FLEX, //PCR027291++
					]
					oView.byId(serviceCaseCreation.Ids.COMBOBOX_ACC1).setSelectedKey("03");
					oView.byId(serviceCaseCreation.Ids.COMBOBOX_ACC1).setEnabled(false);
					break;
					// Begin of PCR027291++
				case "04":
					this.showElements = [
						serviceCaseCreation.Ids.ACC_FLEX,
						serviceCaseCreation.Ids.ACC_ASSIGN_FLEX,
						serviceCaseCreation.Ids.GRID_PAID_SERVICE,
						serviceCaseCreation.Ids.PAID_SERVICE_TOOLBAR,
						serviceCaseCreation.Ids.CATEGORY2_FLEX
					]
					this.hideElements = [
						serviceCaseCreation.Ids.SERVICECLASSIFICATION_FLEX,
						serviceCaseCreation.Ids.FIXBILL_FLEX,
						serviceCaseCreation.Ids.INPUT_CUSTPO_FLEX,
						serviceCaseCreation.Ids.PAID_GRID1,
						serviceCaseCreation.Ids.CUST_PO_FLEX1,
						serviceCaseCreation.Ids.ACC_FLEX1,
						serviceCaseCreation.Ids.CATEGORY3_FLEX,
						serviceCaseCreation.Ids.CATEGORY4_FLEX,
					]

					oView.byId(serviceCaseCreation.Ids.COMBOBOX_ACC).setSelectedKey("");
					oView.byId(serviceCaseCreation.Ids.COMBOBOX_ACC).setEnabled(true);

					break;
					// end of PCR027291++
				case "07":
					this.showElements = [
						serviceCaseCreation.Ids.ACC_FLEX,
						serviceCaseCreation.Ids.ACC_ASSIGN_FLEX,
						serviceCaseCreation.Ids.GRID_PAID_SERVICE,
						serviceCaseCreation.Ids.PAID_SERVICE_TOOLBAR, //PCR020161++
						serviceCaseCreation.Ids.CATEGORY2_FLEX, //PCR027291++
					]
					this.hideElements = [
						serviceCaseCreation.Ids.SERVICECLASSIFICATION_FLEX,
						serviceCaseCreation.Ids.FIXBILL_FLEX,
						serviceCaseCreation.Ids.INPUT_CUSTPO_FLEX,
						serviceCaseCreation.Ids.PAID_GRID1,
						serviceCaseCreation.Ids.CUST_PO_FLEX1,
						serviceCaseCreation.Ids.ACC_FLEX1,
						serviceCaseCreation.Ids.CATEGORY3_FLEX, //PCR027291++
						serviceCaseCreation.Ids.CATEGORY4_FLEX, //PCR027291++
						//serviceCaseCreation.Ids.CATEGORY2_FLEX PCR027291--
					]
					oView.byId(serviceCaseCreation.Ids.COMBOBOX_ACC).setSelectedKey("01");
					oView.byId(serviceCaseCreation.Ids.COMBOBOX_ACC).setEnabled(false);

					/* Start of PCR016459 ++ */
					if (bindData.d) {
						//if (bindData.d.results[0].Soldtocountry = "CN") {     //PCR035223--
						if (bindData.d.results[0].Soldtocountry === "CN") {     //PCR035223++
							var currencyCombo = oView.byId(serviceCaseCreation.Ids.CURRENCY_ID);
							currencyCombo.setSelectedKey("O 50001140");
							currencyCombo.setEnabled(false);
							currencyCombo.setValueState("None")
						}
					}
					/* end of PCR016459 ++ */
					break;

				case "08":
					this.showElements = [
						serviceCaseCreation.Ids.SERVICECLASSIFICATION_FLEX,
						serviceCaseCreation.Ids.FIXBILL_FLEX,
						serviceCaseCreation.Ids.INPUT_CUSTPO_FLEX,
						serviceCaseCreation.Ids.GRID_PAID_SERVICE,
						serviceCaseCreation.Ids.CATEGORY2_FLEX,
						serviceCaseCreation.Ids.PAID_SERVICE_TOOLBAR //PCR020161
					]
					this.hideElements = [
						serviceCaseCreation.Ids.ACC_FLEX,
						serviceCaseCreation.Ids.ACC_ASSIGN_FLEX,
						serviceCaseCreation.Ids.PAID_GRID1,
						serviceCaseCreation.Ids.CUST_PO_FLEX1,
						serviceCaseCreation.Ids.ACC_FLEX1,
						serviceCaseCreation.Ids.CATEGORY3_FLEX, //PCR027291++
						serviceCaseCreation.Ids.CATEGORY4_FLEX, //PCR027291++
					]
					break;
					/* start of PCR016664++
					 * adding new category based on category 1*/
				case "14":
					this.showElements = [
						serviceCaseCreation.Ids.ACC_FLEX,
						serviceCaseCreation.Ids.ACC_ASSIGN_FLEX,
						serviceCaseCreation.Ids.GRID_PAID_SERVICE,
						serviceCaseCreation.Ids.CATEGORY2_FLEX,
						serviceCaseCreation.Ids.PAID_SERVICE_TOOLBAR //PCR020161++
					]
					this.hideElements = [
						serviceCaseCreation.Ids.SERVICECLASSIFICATION_FLEX,
						serviceCaseCreation.Ids.FIXBILL_FLEX,
						serviceCaseCreation.Ids.INPUT_CUSTPO_FLEX,
						serviceCaseCreation.Ids.PAID_GRID1,
						serviceCaseCreation.Ids.CUST_PO_FLEX1,
						serviceCaseCreation.Ids.ACC_FLEX1,
						serviceCaseCreation.Ids.CATEGORY3_FLEX, //PCR027291++
						serviceCaseCreation.Ids.CATEGORY4_FLEX, //PCR027291++
					]

					oView.byId(serviceCaseCreation.Ids.COMBOBOX_ACC).setSelectedKey("01");
					oView.byId(serviceCaseCreation.Ids.COMBOBOX_ACC).setEnabled(false);

					if (bindData.d) {
						//if (bindData.d.results[0].Soldtocountry = "CN") {   //PCR035223--
						if (bindData.d.results[0].Soldtocountry === "CN") {    //PCR035223++
							var currencyCombo = oView.byId(serviceCaseCreation.Ids.CURRENCY_ID);
							currencyCombo.setSelectedKey("O 50001140");
							currencyCombo.setEnabled(false);
							currencyCombo.setValueState("None")
						}
					}
					break;
					// end of PCR016664++
					//Start of PCR020161++; Indirect Labor changes
				case "21":
					this.hideElements = [
						serviceCaseCreation.Ids.ACC_FLEX,
						serviceCaseCreation.Ids.ACC_ASSIGN_FLEX,
						serviceCaseCreation.Ids.PAID_SERVICE_TOOLBAR,
						serviceCaseCreation.Ids.PAID_SERVICE_GRID,
						serviceCaseCreation.Ids.CUST_PO_FLEX1,
						serviceCaseCreation.Ids.ACC_FLEX1,
						serviceCaseCreation.Ids.CATEGORY2_FLEX,
						serviceCaseCreation.Ids.SERVICECLASSIFICATION_FLEX,
						serviceCaseCreation.Ids.FIXBILL_FLEX,
						serviceCaseCreation.Ids.INPUT_CUSTPO_FLEX,
						serviceCaseCreation.Ids.PAID_GRID1,
						serviceCaseCreation.Ids.CATEGORY3_FLEX, //PCR027291++
						serviceCaseCreation.Ids.CATEGORY4_FLEX, //PCR027291++
					];
					this.showElements = [];
					//End of PCR020161++
				default:
					break;
			}
			/*Begin of PCR034663++*/	
			oView.byId(serviceCaseCreation.Ids.NSO_CMBX).setSelectedKey("");
			oView.byId(serviceCaseCreation.Ids.OPPNO_LBL).removeStyleClass("asteriskCC");
			oView.byId(serviceCaseCreation.Ids.OPPNO_LBL).setText(this.resourceBundle.getText("CreateServiceCase.Project/OpportunityNo"));
			this.bnsoFlg = false;
			var that = this;
			if(oView.byId(serviceCaseCreation.Ids.SERVICE_TYPE).getSelectedKey() === "ZPRJ" ) {
				jQuery.each(sap.ui.getCore().getModel("ccMasterListModel").getData().masterListSets.nsoCategory1Condtions	, function(i, item) {
					if (item.GuidKey == selKey )
						that.bnsoFlg = true;											
				});
			}		
			
			if(this.bnsoFlg) {
				oView.byId(serviceCaseCreation.Ids.NSO_CMBX).setEnabled(true);			
				oView.byId(serviceCaseCreation.Ids.NSO_LBL).addStyleClass("asteriskCC");
			} else {
				oView.byId(serviceCaseCreation.Ids.NSO_CMBX).setEnabled(false);				
				oView.byId(serviceCaseCreation.Ids.NSO_LBL).removeStyleClass("asteriskCC");				
			}
			oView.byId(serviceCaseCreation.Ids.NSO_CMBX).setValueState("None");
			/*End of PCR034663++*/
			/* start of PCR016664++
			 * setting Values of category2 based on category 1*/
			var aCatagory2 = [];
			jQuery.each(sap.ui.getCore().getModel("ccMasterListModel").getData().masterListSets.category2, function(i, item) {
				if (item.ParentGuidKey == selKey && sGuidkey == item.KeyValue3)
					aCatagory2.push(item)
			});

			var fnStyleClass = (selKey === "14") ? "addStyleClass" : "removeStyleClass"; //PCR020161++
			oView.byId(serviceCaseCreation.Ids.CAT_TWO_LBL)[fnStyleClass]("asteriskCC"); //PCR020161++
			oView.byId(serviceCaseCreation.Ids.COMBOBOX_CATEGORY2).setValueState("None"); //PCR020161++

			if (aCatagory2.length > 0) {
				var catagory2Model = new sap.ui.model.json.JSONModel();

				catagory2Model.setData(aCatagory2);
				oView.byId(serviceCaseCreation.Ids.COMBOBOX_CATEGORY2).setSelectedKey("");
				oView.byId(serviceCaseCreation.Ids.COMBOBOX_CATEGORY2).setModel(catagory2Model);
			}
			/* end of PCR016664++ */
			this._toggleElementsAvailability();
		},

		/**
		 * This method is called on Change of Currency selection for china scnerio  .
		 * @name onCurrencySelect
		 * @param oEvent - Current Event Parameter
		 * @returns
		 */
		onCurrencySelect: function(oEvent) {
			var sValueState = (oEvent.getSource().getValue().length) ? "None" : "Error";
			oEvent.getSource().setValueState(sValueState);
			var oView = this.getView(),
				currency = oEvent.getSource().getValue(),
				spath = oView.getBindingContext().getPath(),
				i = spath.split('/')[3];
			
			var data = oView.getModel().getData().d.results[i];
			var vCalData = sap.ui.getCore().getModel(serviceCaseCreation.constants.ccServiceCaseCreateModel).getData().d.results;  //PCR035223++

			if (data.Multicurrencyflag == "X") {
				var contract = data.Servicecontract + " " + data.Servicecontractdescription;
				var warranty = data.Warrantyid + " " + data.Warrantyiddescription;

				if (warranty != " ") {
					if (currency == "RMB") {
						if (data.Contractcurrency == "RMB") {
							oView.byId(serviceCaseCreation.Ids.WARRANTY_TEXT).setText(" ");
							oView.byId(serviceCaseCreation.Ids.SERVICE_CONTRACT_TEXT).setText(contract);
						}
					} else {
						oView.byId(serviceCaseCreation.Ids.WARRANTY_TEXT).setText(warranty);
						oView.byId(serviceCaseCreation.Ids.SERVICE_CONTRACT_TEXT).setText(" ");
					}
				} else if (warranty == " ") {
					jQuery.each(this._Contractdetails, function(i, oItem) {
						if (oItem.Contractcurrency == currency) {
							contract = oItem.Servicecontract + " " + oItem.Servicecontractdescription;
							oView.byId(serviceCaseCreation.Ids.WARRANTY_TEXT).setText(" ");
							oView.byId(serviceCaseCreation.Ids.SERVICE_CONTRACT_TEXT).setText(contract);
						}
					});
				}
			}
			/*start of PCR026357++*/
			else {
				if ((data.Warrantyid == "") && (data.Servicecontract == "")) {
					if (currency == "RMB") {
						var oldEquipment = "",
							oldSrvContract = "",
							oldSrvWarranty = " ";
						//Start of PCR035223 ++
						//jQuery.each(oView.getModel().getData().d.results, function(i, oItem) {
						jQuery.each(vCalData, function(i, oItem) {
						//End of PCR035223 ++
							if ((oItem.Assembly == 'NA') && (oItem.Assemblydesc == 'System' || oItem.Assemblydesc == 'SYSTEM')) {
								if (oItem.Contractcurrency == "RMB") {
									oldEquipment = oItem.Equipmentdescription;
									oldSrvContract = oItem.Servicecontract + " " + oItem.Servicecontractdescription;
									return false; //PCR035223++
								}
							}
						});
						oView.byId(serviceCaseCreation.Ids.TEXT_CHAMBER).setText(oldEquipment);
						oView.byId(serviceCaseCreation.Ids.SERVICE_CONTRACT_TEXT).setText(oldSrvContract);
						oView.byId(serviceCaseCreation.Ids.WARRANTY_TEXT).setText(oldSrvWarranty);
						if ((oldSrvContract == " " || oldSrvContract == "") && (oldSrvWarranty == " " || oldSrvWarranty == "")) {
							oView.byId(serviceCaseCreation.Ids.COMBOBOX_FIXBILLING).setValueState(sap.ui.core.ValueState.Error);
						} else {
							oView.byId(serviceCaseCreation.Ids.COMBOBOX_FIXBILLING).setValueState(sap.ui.core.ValueState.None);
						}
					} else {
						var oldEquipment = "",
							oldSrvContract = " ",
							oldSrvWarranty = "";
						jQuery.each(sap.ui.getCore().getModel("ccServiceCaseCreateModel").getData().d.results, function(i, oItem) {
							if ((oItem.Assembly == 'NA') && (oItem.Assemblydesc == 'System' || oItem.Assemblydesc == 'SYSTEM')) {
								if (oItem.Contractcurrency == "USD" || oItem.Contractcurrency == "" || oItem.Contractcurrency == " ") {
									oldEquipment = oItem.Equipmentdescription;
									oldSrvWarranty = oItem.Warrantyid + " " + oItem.Warrantyiddescription;
									oldSrvContract = oItem.Servicecontract + " " + oItem.Servicecontractdescription;
									return false;   //PCR035223++
								//} else if (oItem.Multicurrencyflag == "X" && ) {      //PCR035223--
								}	else if (oItem.Multicurrencyflag === "X" && oItem.Contractcurrency === currency) {    //PCR035223++
									oldEquipment = oItem.Equipmentdescription;
									oldSrvWarranty = oItem.Warrantyid + " " + oItem.Warrantyiddescription;
									oldSrvContract = oItem.Servicecontract + " " + oItem.Servicecontractdescription;
									return false; //PCR035223++
								}
							}
						});
						if (!(oldSrvWarranty == " " || oldSrvWarranty == "")) {
							oldSrvContract = " ";
						}
						oView.byId(serviceCaseCreation.Ids.TEXT_CHAMBER).setText(oldEquipment);
						oView.byId(serviceCaseCreation.Ids.SERVICE_CONTRACT_TEXT).setText(oldSrvContract);
						oView.byId(serviceCaseCreation.Ids.WARRANTY_TEXT).setText(oldSrvWarranty);
						if (oldSrvContract == " " && oldSrvWarranty == " ") {
							oView.byId(serviceCaseCreation.Ids.COMBOBOX_FIXBILLING).setValueState(sap.ui.core.ValueState.Error);
						} else {
							oView.byId(serviceCaseCreation.Ids.COMBOBOX_FIXBILLING).setValueState(sap.ui.core.ValueState.None);
						}

					}
				}
			}
			/*end of PCR026357++*/

			this.warranty = oView.byId(serviceCaseCreation.Ids.WARRANTY_TEXT).getText();
			this.serviceContract = oView.byId(serviceCaseCreation.Ids.SERVICE_CONTRACT_TEXT).getText();

			if (this.warranty.indexOf("WTY0001") >= 0 || this.warranty.indexOf("WTY0003") >= 0)
				this.showElementsWithIDs([
					serviceCaseCreation.Ids.TIER_FLEX,
				]);
			else
				this.hideElementsWithIDs([
					serviceCaseCreation.Ids.TIER_FLEX,
				]);
		},

		/**
		 * This method is for Success service call of onSubmit or onSubmitTool.
		 * @name handleCustomerToolFetchSucces
		 * @param
		 * @returns
		 */
		handleCustomerToolFetchSuccess: function() {
			var that = this;
			var oView = this.getCurrentView(),
				count,
				contractDetails = [],
				serviceCaseCreateModel = sap.ui.getCore().getModel("ccServiceCaseCreateModel");

			this.destroyDialog();
			oView.setModel(serviceCaseCreateModel);
			var viewdata = serviceCaseCreateModel.getData().d.results[0];
			var equiCombobox = oView.byId(serviceCaseCreation.Ids.COMBOBOX_EQUIPMENT),
				sServicetype = oView.byId(serviceCaseCreation.Ids.SERVICE_TYPE).getSelectedKey(); //CR020942++
			/*start of PCR017289++
			 * clearing value states for the serial num dependant fields
			 */
			oView.byId(serviceCaseCreation.Ids.COMBOBOX_FIXBILLING).setValueState(sap.ui.core.ValueState.None);
			oView.byId(serviceCaseCreation.Ids.COMBOBOX_FIXBILLING).setSelectedKey("");
			oView.byId(serviceCaseCreation.Ids.COMBOBOX_SERVICECLASSIFICATION_CREATE).setSelectedKey("");
			oView.byId(serviceCaseCreation.Ids.CURRENCY_ID).setValueState(sap.ui.core.ValueState.None);
			oView.byId(serviceCaseCreation.Ids.CURRENCY_ID).setSelectedKey("");
			/* end of PCR017289++*/
			equiCombobox.setSelectedKey("");

			if (viewdata) { //PCR017437++
				if (viewdata.ErrorMessage === "") {

					oView.byId(serviceCaseCreation.Ids.ARKLINKCREATE).setEnabled(true); //PCR030996++
					//Filling duplicate model for Customer tool popup
					var _DuplicateCustomertool = {
						d: {
							results: []
						}
					};
					jQuery.each(serviceCaseCreateModel.getData().d.results, function(i, oItem) {
						count = 0;
						jQuery.each(_DuplicateCustomertool.d.results, function(i, oItem1) {
							if ((oItem.Customertoolid == oItem1.Customertoolid || oItem.Serialnumber == oItem1.Serialnumber || oItem.Fabname == oItem1.Fabname) &&
								oItem.Equipment == oItem1.Equipment)
								count++;
						});
						if (count == 0)
							_DuplicateCustomertool.d.results.push(oItem);
					});

					var duplicateCustomertoolModel = new sap.ui.model.json.JSONModel();
					duplicateCustomertoolModel.setData(_DuplicateCustomertool);
					sap.ui.getCore().setModel(duplicateCustomertoolModel, "ccDuplicateCustomertoolModel");

					if (duplicateCustomertoolModel.getData().d.results.length == "1") {
						var _Assemblydetails = {
							d: {
								results: []
							}
						};
						jQuery.each(serviceCaseCreateModel.getData().d.results, function(i, oItem) {
							count = 0;
							jQuery.each(_Assemblydetails.d.results, function(i, oItem1) {
								if (oItem.Assembly == oItem1.Assembly)
									count++;
							});
							if (count == 0) {
								_Assemblydetails.d.results.push(oItem);
							}
						});

						var assemblyDetailModel = new sap.ui.model.json.JSONModel();
						assemblyDetailModel.setData(_Assemblydetails);
						sap.ui.getCore().setModel(assemblyDetailModel, "ccAssemblyDetailModel");
						this.contextPath = "/d/results/0";

						if (assemblyDetailModel.getData().d.results.length != "0") {
							this._sPath = "/d/results/0";
							oView.byId(serviceCaseCreation.Ids.CREATE_CUSTOMER_TOOLID).setValue(viewdata.Customertoolid);
							oView.byId(serviceCaseCreation.Ids.CREATE_SERIAL_NUMBER).setValue(viewdata.Serialnumber);
							oView.byId(serviceCaseCreation.Ids.CREATE_FABID).setValue(viewdata.Fabid);
							equiCombobox.setModel(assemblyDetailModel);
							oView.byId(serviceCaseCreation.Ids.COMBOBOX_EQUIPMENT).setSelectedKey("NA");
							this._sPath = oView.byId(serviceCaseCreation.Ids.COMBOBOX_EQUIPMENT).getSelectedItem().getBindingContext().getPath();
							oView.setModel(assemblyDetailModel);
							oView.bindElement(this._sPath);
							oView.getModel().updateBindings();
							this._Contractdetails = [];

							this._FnClearExitingFiltersAndBindNewData(viewdata); //PCR017437++

							jQuery.each(serviceCaseCreateModel.getData().d.results, function(i, oItem) {
								if (oItem.Assembly == "NA")
									contractDetails.push(oItem);
							});

							this._Contractdetails = contractDetails;
							this.warranty = oView.byId(serviceCaseCreation.Ids.WARRANTY_TEXT).getText();

							if (this.warranty != " ")
								oView.byId(serviceCaseCreation.Ids.SERVICE_CONTRACT_TEXT).setText(" ");

							if (this.warranty.indexOf("WTY0001") >= 0 || this.warranty.indexOf("WTY0003") >= 0)
								this.showElementsWithIDs([serviceCaseCreation.Ids.TIER_FLEX]);
							else
								this.hideElementsWithIDs([serviceCaseCreation.Ids.TIER_FLEX]);

							this.serviceContract = oView.byId(serviceCaseCreation.Ids.SERVICE_CONTRACT_TEXT).getText();
							var mandatoryCheck = this.onMandatoryFieldCheck("change");
						}
						this.Country = viewdata.Soldtocountry;
						if (viewdata.Soldtocountry == "CN") {
							this.showElementsWithIDs([serviceCaseCreation.Ids.CURRENCY_FLEX]);
							//Currency value defaulting and manipulation based on Condition
							if (viewdata.Multicurrencyflag == "X") {
								oView.byId(serviceCaseCreation.Ids.CURRENCY_ID).setEnabled(true);
							} else {
								if (viewdata.Warrantyid == "" && viewdata.Servicecontract == "") {
									oView.byId(serviceCaseCreation.Ids.CURRENCY_ID).setEnabled(true);
								}
								if (viewdata.Warrantyid != "" && viewdata.Servicecontract == "") {
									oView.byId(serviceCaseCreation.Ids.CURRENCY_ID).setEnabled(false);
									oView.byId(serviceCaseCreation.Ids.CURRENCY_ID).setSelectedKey("O 50001140");
								}
								if (viewdata.Servicecontract != "") {
									oView.byId(serviceCaseCreation.Ids.CURRENCY_ID).setEnabled(false);
									if (viewdata.Contractcurrency == "USD") {
										oView.byId(serviceCaseCreation.Ids.CURRENCY_ID).setSelectedKey("O 50001140");
										oView.byId(serviceCaseCreation.Ids.CURRENCY_ID).setValueState("None"); //PCR017289++
									} else if (viewdata.Contractcurrency == "RMB") {
										oView.byId(serviceCaseCreation.Ids.CURRENCY_ID).setSelectedKey("O 50001139");
										oView.byId(serviceCaseCreation.Ids.CURRENCY_ID).setValueState("None"); //PCR017289++
									}
								}
							}
							/*start of PCR016459++*/
							if (oView.byId(serviceCaseCreation.Ids.COMBOBOX_CIDCATEGORIZATION).getSelectedKey() === "07") {
								var currencyCombo = oView.byId(serviceCaseCreation.Ids.CURRENCY_ID);
								currencyCombo.setSelectedKey("O 50001140");
								currencyCombo.setEnabled(false);
								currencyCombo.setValueState("None");
							}
							/*end of PCR016459++*/
						} else {
							//this.showElements = []
							this.hideElements = [serviceCaseCreation.Ids.CURRENCY_FLEX]
							this._toggleElementsAvailability();
						}

						var oCustToolId = oView.byId(serviceCaseCreation.Ids.CREATE_CUSTOMER_TOOLID),
							oSerialNo = oView.byId(serviceCaseCreation.Ids.CREATE_SERIAL_NUMBER),
							oFabId = oView.byId(serviceCaseCreation.Ids.CREATE_FABID);

						if (oCustToolId.getValue() && oCustToolId.getValueState() == "Error")
							oCustToolId.setValueState("None")

						if (oSerialNo.getValue() && oSerialNo.getValueState() == "Error")
							oSerialNo.setValueState("None")

						if (oFabId.getValue() && oFabId.getValueState() == "Error")
							oFabId.setValueState("None")

						/*Begin of PCR020942++ changes*/

						if (sServicetype === "ZCMO") {
							this._fnFetchAssemData(viewdata.Equipment);
						}
						/*Begin of IBase PCR031702++ */
						else {
							this._fnFetchIBaseValid();
						}
						/*End of IBase PCR031702++ */
						/*End of PCR020942++ changes*/

					} else {
						this._customerToolDialog = serviceCaseCreation.fragmentHelper.createDialogFragment(this.getCurrentView().getId(), this,
							"serviceCaseCreation.view.fragments.SubmitTool");
						this._customerToolDialog.setModel(sap.ui.getCore().getModel("ccDuplicateCustomertoolModel"));
						this._customerToolDialog.open();
					}
				} else {
					oView.byId(serviceCaseCreation.Ids.ARKLINKCREATE).setEnabled(false); //PCR030996++
					oView.byId(serviceCaseCreation.Ids.CREATE_CUSTOMER_TOOLID).setValue("");
					oView.byId(serviceCaseCreation.Ids.CREATE_SERIAL_NUMBER).setValue("");
					var sFailureDialogMsg = this.resourceBundle.getText("CreateServiceCase.FailureDialogMsg");
					serviceCaseCreation.fragmentHelper.dialogFragmentContent(this, sFailureDialogMsg, serviceCaseCreation.StandardSAPIcons.ICON_SAP_MSG_ERROR,
						"#cc1919", viewdata.ErrorMessage);
					serviceCaseCreation.fragmentHelper.createDialogFragment(this.getCurrentView().getId(), this,
						"serviceCaseCreation.view.fragments.InfoDialog1").open();
				}
			} //PCR017437++

			if (assemblyDetailModel.getData().d.results.length === 2) { // PCR031702++
				oView.byId(serviceCaseCreation.Ids.COMBOBOX_EQUIPMENT).setSelectedKey("NA"); // PCR031702++
			} else { // PCR031702++
				oView.byId(serviceCaseCreation.Ids.COMBOBOX_EQUIPMENT).setSelectedItem(oView.byId(serviceCaseCreation.Ids.COMBOBOX_EQUIPMENT).getItems()[
					0]); //PCR026357++
				oView.byId(serviceCaseCreation.Ids.COMBOBOX_EQUIPMENT).setValueState(sap.ui.core.ValueState.Error); //PCR026357++
			} // PCR031702++
		},

		/**
		 * This method is for failure service call of onSubmit or onSubmitTool.
		 * @name handleCustomerToolFetchFail
		 * @param oData : Current event parameter
		 * @returns
		 */
		handleCustomerToolFetchFail: function(oData) {
			this.destroyDialog();
			this.getView().byId(serviceCaseCreation.Ids.ARKLINKCREATE).setEnabled(false); //PCR030996++
			var errormessage = oData.getParameter("d").ErrorMessage;
			var sFailureDialogMsg = this.resourceBundle.getText("CreateServiceCase.FailureDialogMsg");
			serviceCaseCreation.fragmentHelper.dialogFragmentContent(this, sFailureDialogMsg, serviceCaseCreation.StandardSAPIcons.ICON_SAP_MSG_ERROR,
				"#cc1919", errormessage);
			serviceCaseCreation.fragmentHelper.createDialogFragment(this.getCurrentView().getId(), this,
				"serviceCaseCreation.view.fragments.InfoDialog1").open();
		},

		/**
		 * This method is called for line item selection from dialog box.  .
		 * @name selectSNBasedCustId
		 * @param oEvent - Cureent Event Parameter
		 * @returns
		 */
		selectSNBasedCustId: function(oEvent) {
			var oSelectedItem = oEvent.getSource();
			var sPath = oSelectedItem.getSelectedItem().getBindingContext().getPath();
			var oView = this.getCurrentView(),
				sServicetype = oView.byId(serviceCaseCreation.Ids.SERVICE_TYPE).getSelectedKey(), //PCR020942++
				_servicecaseDetails = {
					d: {
						results: []
					}
				};
			var duplicateCustomertoolModel = sap.ui.getCore().getModel("ccDuplicateCustomertoolModel"),
				serviceCaseCreateModel = sap.ui.getCore().getModel("ccServiceCaseCreateModel");

			var serialNum = duplicateCustomertoolModel.getProperty(sPath).Serialnumber;
			var fabId = duplicateCustomertoolModel.getProperty(sPath).Fabid;
			var Equipment = duplicateCustomertoolModel.getProperty(sPath).Equipment;

			oView.byId(serviceCaseCreation.Ids.CREATE_CUSTOMER_TOOLID).setValue(serviceCaseCreateModel.getProperty(sPath).Customertoolid);
			oView.byId(serviceCaseCreation.Ids.CREATE_SERIAL_NUMBER).setValue(serialNum);
			oView.byId(serviceCaseCreation.Ids.CREATE_FABID).setValue(fabId);

			jQuery.each(serviceCaseCreateModel.getData().d.results, function(i, oItem) {
				if (oItem.Equipment == Equipment)
					_servicecaseDetails.d.results.push(oItem);
			});

			serviceCaseCreateModel.setData(_servicecaseDetails);
			serviceCaseCreateModel.refresh();

			oView.setModel(serviceCaseCreateModel);
			var viewdata = oView.getModel().getData().d.results[0];
			var equiCombobox = oView.byId(serviceCaseCreation.Ids.COMBOBOX_EQUIPMENT);
			var _Assemblydetails = {
				d: {
					results: []
				}
			};

			jQuery.each(serviceCaseCreateModel.getData().d.results, function(i, oItem) {
				count = 0;
				jQuery.each(_Assemblydetails.d.results, function(i, oItem1) {
					if (oItem.Assembly == oItem1.Assembly)
						count++;
				});
				if (count == 0)
					_Assemblydetails.d.results.push(oItem);
			});

			var assemblyDetailModel = new sap.ui.model.json.JSONModel();
			assemblyDetailModel.setData(_Assemblydetails);
			sap.ui.getCore().setModel(assemblyDetailModel, "ccAssemblyDetailModel");
			this.contextPath = "/d/results/0";
			this._FnClearExitingFiltersAndBindNewData(viewdata); //PCR017437++

			if (assemblyDetailModel.getData().d.results.length != "0") {
				//this._sPath = "/d/results/0";             V02--
				oView.byId(serviceCaseCreation.Ids.CREATE_CUSTOMER_TOOLID).setValue(viewdata.Customertoolid);
				oView.byId(serviceCaseCreation.Ids.CREATE_SERIAL_NUMBER).setValue(viewdata.Serialnumber);
				oView.byId(serviceCaseCreation.Ids.CREATE_FABID).setValue(viewdata.Fabid);
				//oView.bindElement(this.contextPath);        V02--
				//serviceCaseCreateModel.updateBindings();      V02--
				equiCombobox.setModel(assemblyDetailModel);
				oView.byId(serviceCaseCreation.Ids.COMBOBOX_EQUIPMENT).setSelectedKey("NA");
				//Start of V02++
				this._sPath = oView.byId(serviceCaseCreation.Ids.COMBOBOX_EQUIPMENT).getSelectedItem().getBindingContext().getPath();
				oView.setModel(assemblyDetailModel);
				oView.bindElement(this._sPath);
				oView.getModel().updateBindings();
				//End of V02++
				this.warranty = oView.byId(serviceCaseCreation.Ids.WARRANTY_TEXT).getText();

				if (this.warranty != " ")
					oView.byId(serviceCaseCreation.Ids.SERVICE_CONTRACT_TEXT).setText(" ");

				if (this.warranty.indexOf("WTY0001") >= 0 || this.warranty.indexOf("WTY0003") >= 0)
					this.showElementsWithIDs([
						serviceCaseCreation.Ids.TIER_FLEX,
					]);
				else
					this.hideElementsWithIDs([
						serviceCaseCreation.Ids.TIER_FLEX,
					]);

				this.serviceContract = oView.byId(serviceCaseCreation.Ids.SERVICE_CONTRACT_TEXT).getText();
				var mandatoryCheck = this.onMandatoryFieldCheck("change");
			}

			this.Country = viewdata.Soldtocountry;

			if (viewdata.Soldtocountry == "CN") {
				this.showElementsWithIDs([
					serviceCaseCreation.Ids.CURRENCY_FLEX,
				]);

				//Currency value defaulting and manipulation based on Condition
				if (viewdata.Multicurrencyflag == "X")
					oView.byId(serviceCaseCreation.Ids.CURRENCY_ID).setEnabled(true);
				else {
					if (viewdata.Warrantyid == "" && viewdata.Servicecontract == "") {
						oView.byId(serviceCaseCreation.Ids.CURRENCY_ID).setEnabled(true);
					}
					if (viewdata.Warrantyid != "" && viewdata.Servicecontract == "") {
						oView.byId(serviceCaseCreation.Ids.CURRENCY_ID).setEnabled(false);
						oView.byId(serviceCaseCreation.Ids.CURRENCY_ID).setSelectedKey("O 50001140");
					}
					if (viewdata.Servicecontract != "") {
						oView.byId(serviceCaseCreation.Ids.CURRENCY_ID).setEnabled(false);
						if (viewdata.Contractcurrency == "USD") {
							oView.byId(serviceCaseCreation.Ids.CURRENCY_ID).setSelectedKey("O 50001140");
						} else if (viewdata.Contractcurrency == "RMB") {
							oView.byId(serviceCaseCreation.Ids.CURRENCY_ID).setSelectedKey("O 50001139");
						}
					}
				}
				/*start of PCR016459++*/
				if (oView.byId(serviceCaseCreation.Ids.COMBOBOX_CIDCATEGORIZATION).getSelectedKey() === "07") {
					var currencyCombo = oView.byId(serviceCaseCreation.Ids.CURRENCY_ID);
					currencyCombo.setSelectedKey("O 50001140");
					currencyCombo.setEnabled(false);
					currencyCombo.setValueState("None");
				}
				/*end of PCR016459++*/
			}

			var sValueState = (oView.byId(serviceCaseCreation.Ids.CREATE_SERIAL_NUMBER).getValue().length) ? "None" : "Error";
			oView.byId(serviceCaseCreation.Ids.CREATE_SERIAL_NUMBER).setValueState(sValueState);
			var sValueState = (oView.byId(serviceCaseCreation.Ids.CREATE_FABID).getValue().length) ? "None" : "Error";
			oView.byId(serviceCaseCreation.Ids.CREATE_FABID).setValueState(sValueState);

			this.destroyDialog();

			/*Begin of PCR020942++ changes*/

			if (sServicetype === "ZCMO") {
				this._fnFetchAssemData(Equipment);
			}
			/*Begin of IBase PCR031702++ */
			else {
				this._fnFetchIBaseValid();
			}
			/*End of IBase PCR031702++ */
			/*End of PCR020942++ chaanges*/
		},

		/**
		 * This method is to Mandatory Values checking
		 * @name onMandatoryFieldCheck
		 * @param
		 * @returns
		 */
		onMandatoryFieldCheck: function(oTrigger) {
			var view = this.getCurrentView();
			var oSymOneCmbx = view.byId(serviceCaseCreation.Ids.COMBOBOX_CIDSYMPTOM); //PCR020942++
			var aInputElementsRef = [
				view.byId(serviceCaseCreation.Ids.SERVICE_TYPE),
				view.byId(serviceCaseCreation.Ids.CREATE_FABID),
				view.byId(serviceCaseCreation.Ids.START_DATE_DATEPICKER),
				view.byId(serviceCaseCreation.Ids.START_TIME_TIMEPICKER),
				view.byId(serviceCaseCreation.Ids.ASSIGNEDTO_INPUT),
				view.byId(serviceCaseCreation.Ids.PROBLEM_DESCRIPTION),
				view.byId(serviceCaseCreation.Ids.COMBOBOX_EQUIPMENT),
			];

			switch (this.ServiceType) {
				case "ZPMO":
					aInputElementsRef.push(view.byId(serviceCaseCreation.Ids.COMBOBOX_CIDPMTYPE));
					aInputElementsRef.push(view.byId(serviceCaseCreation.Ids.TOOLSTAT_CMBX)); //PCR033903++
					break;

				case "ZPRJ":
					aInputElementsRef.push(view.byId(serviceCaseCreation.Ids.COMBOBOX_CIDCATEGORIZATION));
					aInputElementsRef.push(view.byId(serviceCaseCreation.Ids.TOOLSTAT_CMBX)); //PCR033903++
					break;

				case "ZCMO":
					/*Begin of PCR020942++ changes*/
					if (!oSymOneCmbx.getAggregation("_input").getValue()) {
						oSymOneCmbx.removeStyleClass("inputMenuBorder");
						oSymOneCmbx.addStyleClass("inputMenuValueStateError");
					} else {
						oSymOneCmbx.removeStyleClass("inputMenuValueStateError");
						oSymOneCmbx.addStyleClass("inputMenuBorder");
					}
					/*End of PCR020942++ changes*/

					aInputElementsRef.push(
						// view.byId(serviceCaseCreation.Ids.COMBOBOX_CIDSYMPTOM), //PCR020942--
						view.byId(serviceCaseCreation.Ids.COMBOBOX_CIDFAULT),
						view.byId(serviceCaseCreation.Ids.COMBOBOX_NONCONFIRM),
						view.byId(serviceCaseCreation.Ids.C_MALFUNCSTRTDT_DTPKR), //PCR018422++
						view.byId(serviceCaseCreation.Ids.C_MALFUNCSTRTTM_TMPKR), //PCR018422++
						view.byId(serviceCaseCreation.Ids.ASSEM_CMBX), //PCR020942++
						view.byId(serviceCaseCreation.Ids.TOOLSTAT_CMBX) //PCR020942++
					);
					if (this.warranty != " ") {
						if (this.warranty.indexOf("WTY0001") >= 0 || this.warranty.indexOf("WTY0003") >= 0)
							aInputElementsRef.push(view.byId(serviceCaseCreation.Ids.COMBOBOX_CIDTIER));
					}
					break;

				default:
					break;
			}

			if (this.Country == "CN")
				aInputElementsRef.push(view.byId(serviceCaseCreation.Ids.CURRENCY_ID));

			var aComboBox = [
				// serviceCaseCreation.Ids.COMBOBOX_CIDSYMPTOM, //PCR020942--
				serviceCaseCreation.Ids.COMBOBOX_CIDFAULT,
				serviceCaseCreation.Ids.COMBOBOX_CIDTIER,
				serviceCaseCreation.Ids.COMBOBOX_DELAY,
				serviceCaseCreation.Ids.COMBOBOX_FIXBILLING,
				serviceCaseCreation.Ids.COMBOBOX_SERVICECLASSIFICATION_CREATE,
				serviceCaseCreation.Ids.COMBOBOX_CIDPMTYPE,
				serviceCaseCreation.Ids.COMBOBOX_CIDCATEGORIZATION,
				serviceCaseCreation.Ids.COMBOBOX_FIXBILLING,
				serviceCaseCreation.Ids.COMBOBOX_SERVICECLASSIFICATION_CREATE,
				serviceCaseCreation.Ids.COMBOBOX_EQUIPMENT,
				serviceCaseCreation.Ids.CURRENCY_ID,
				serviceCaseCreation.Ids.COMBOBOX_NONCONFIRM,
			];

			if (this.ServiceType != "ZPRJ") {
				if ((this.serviceContract == " " || this.serviceContract == "") && (this.warranty == " " || this.warranty == "")) { //PCR026357++
					var assContract = view.byId(serviceCaseCreation.Ids.SERVICE_CONTRACT_TEXT).getText(); //PCR026357++
					var assWarranty = view.byId(serviceCaseCreation.Ids.WARRANTY_TEXT).getText(); //PCR026357++
					if ((assContract == " " || assContract == "") && (assWarranty == " " || assWarranty == "")) { //PCR026357++
						aInputElementsRef.push(view.byId(serviceCaseCreation.Ids.COMBOBOX_FIXBILLING));
					}
				}
				var _FixBilling = view.byId(serviceCaseCreation.Ids.COMBOBOX_FIXBILLING).getSelectedKey();

				if (_FixBilling != "")
					aInputElementsRef.push(view.byId(serviceCaseCreation.Ids.COMBOBOX_SERVICECLASSIFICATION_CREATE));
			} else {
				var _category = view.byId(serviceCaseCreation.Ids.COMBOBOX_CIDCATEGORIZATION).getSelectedKey();
				/*Begin of PCR034663++*/
				if(view.byId(serviceCaseCreation.Ids.NSO_LBL).hasStyleClass("asteriskCC"))
					aInputElementsRef.push(view.byId(serviceCaseCreation.Ids.NSO_CMBX));
				
				if(view.byId(serviceCaseCreation.Ids.OPPNO_LBL).hasStyleClass("asteriskCC"))
					aInputElementsRef.push(view.byId(serviceCaseCreation.Ids.INPUT_CUSTPO));
					
				/*End of PCR034663++*/

				switch (_category) {
					case "02":
						aInputElementsRef.push(view.byId(serviceCaseCreation.Ids.COMBOBOX_FIXBILLING));
						break;

					case "03":
						aInputElementsRef.push(view.byId(serviceCaseCreation.Ids.CUST_PO1));
						break;

					case "07":
						aInputElementsRef.push(view.byId(serviceCaseCreation.Ids.INPUT_ASSIGNMENT));
						break;

					case "08":
						aInputElementsRef.push(view.byId(serviceCaseCreation.Ids.COMBOBOX_FIXBILLING));
						break;
						/*start of PCR016664++*/

					case "14":
						aInputElementsRef.push(view.byId(serviceCaseCreation.Ids.INPUT_ASSIGNMENT));
						aInputElementsRef.push(view.byId(serviceCaseCreation.Ids.COMBOBOX_CATEGORY2)); //PCR020161++
						break;
						/*end of PCR016664++*/

					default:
						break;
				}
			}

			var isMandatoryInputFieldCheckSuccess = false,
				isMandatoryFieldCheckSuccess = false;

			isMandatoryInputFieldCheckSuccess = serviceCaseCreation.util.Util.doCompleteInputElementsValidation(aInputElementsRef);

			if (oTrigger === "Create" && isMandatoryInputFieldCheckSuccess) {
				isMandatoryFieldCheckSuccess = serviceCaseCreation.util.Util.doCompleteComboBoxElementsValidation(this, aComboBox);
			}

			return [isMandatoryFieldCheckSuccess, isMandatoryInputFieldCheckSuccess];
		},

		/**
		 * This method is to create Service Order .
		 * @name onCreate
		 * @param
		 * @returns
		 */
		onCreate: function() {
			var _problemDescription = "",
				_dateTime = "",
				_Zone = "",
				_AssignedTo = "",
				_Symptom = "",
				_Fault = "",
				_delayStatus = "",
				_Tier = "",
				_PmType = "",
				_Categorization = "",
				_FixBilling = "",
				_Serviceclassification = "",
				_CustPo = "",
				_Sorg = "",
				_AccCat = "",
				_AccAssignment = "",
				_NonConform = "",
				_WaferScrap = "",
				_Category2 = "",
				/*Begin of PCR027291++*/
				_Category3 = "",
				_Category4 = "",
				_Category2GUID = "",
				_Category3GUID = "",
				_Category4GUID = "",
				_Category4Desc = "",
				_Category3Desc = "",
				_Category2Desc = "",
				_CategorizationGUID = "",
				CategorizationDesc = "",
				/*end of PCR027291++*/
				_serviceContract = "",
				_warrantyId = "",
				_fabId = "",
				flag,
				sAssemkey = "", //PCR020942++
				sToolStatKey = "", //PCR020942++
				majorAssemblyId = "", //PCR026357++
				majorAssemblyDesc = "", //PCR026357++
				majorAssemblyEqp = ""; //PCR026357++

			var view = this.getCurrentView();
			var _Sorg;

			if (this.Country == "CN") {
				_Sorg = view.byId(serviceCaseCreation.Ids.CURRENCY_ID).getSelectedKey();
			} else {
				_Sorg = "";
			}

			/*Begin of PCR020942++ changes*/

			view.byId(serviceCaseCreation.Ids.TOOLSTAT_CMBX).fireChange();
			view.byId(serviceCaseCreation.Ids.ASSEM_CMBX).fireChange();

			/*End of PCR020942++ changes*/

			var mandatoryCheck = this.onMandatoryFieldCheck("Create");
			var isMandatoryFieldCheckSuccess = mandatoryCheck[0];
			var isMandatoryInputFieldCheckSuccess = mandatoryCheck[1];
			var oDateCheck = view.byId(serviceCaseCreation.Ids.START_DATE_DATEPICKER).fireChange({
				value: view.byId(serviceCaseCreation.Ids.START_DATE_DATEPICKER).getValue()
			});

			//Start of PCR018422++ changes
			var oMalFuncDateCheck = view.byId(serviceCaseCreation.Ids.C_MALFUNCSTRTDT_DTPKR).fireChange({
				value: view.byId(serviceCaseCreation.Ids.C_MALFUNCSTRTDT_DTPKR).getValue()
			});

			var bValidDates = true;
			if (this.ServiceType.Servicetype == "ZCMO") {
				bValidDates = (oMalFuncDateCheck.getValueState() === "None" && oDateCheck.getValueState() === "None") ? true : false;
			} else {
				bValidDates = (oDateCheck.getValueState() === "None") ? true : false;
			}
			//End of PCR018422++ changes
			//Start of PCR026357++ changes
			var bValidAssembly = (view.byId(serviceCaseCreation.Ids.COMBOBOX_EQUIPMENT).getSelectedKey() != "") ? true : false;
			if (!bValidAssembly) {
				view.byId(serviceCaseCreation.Ids.COMBOBOX_EQUIPMENT).setValueState(sap.ui.core.ValueState.Error);
			}
			//End of PCR026357++ changes

			if (isMandatoryFieldCheckSuccess[0]) {
				// if (isMandatoryInputFieldCheckSuccess && oDateCheck.getValueState() === "None") { //PCR018422--
				if (isMandatoryInputFieldCheckSuccess && bValidDates && bValidAssembly) { //PCR018422++ //PCR026357++
					/*var sBusyDialogMsg = this.resourceBundle.getText("CreateServiceCase.BusyDialogMsg");
					serviceCaseCreation.fragmentHelper.dialogFragmentContent(this, "", "", "", sBusyDialogMsg);
					serviceCaseCreation.fragmentHelper.createDialogFragment(this.getCurrentView().getId(), this, "serviceCaseCreation.view.fragments.BusyDialog").open();*/ //PCR017285--

					serviceCaseCreation.fragmentHelper.openBusyDialogExt.call(this,
						this.resourceBundle.getText("CreateServiceCase.BusyDialogMsg")); //PCR017285++

					switch (this.ServiceType) {
						case "ZPMO":
							_PmType = view.byId(serviceCaseCreation.Ids.COMBOBOX_CIDPMTYPE).getSelectedKey();
							_FixBilling = view.byId(serviceCaseCreation.Ids.COMBOBOX_FIXBILLING).getSelectedKey();
							_Serviceclassification = view.byId(serviceCaseCreation.Ids.COMBOBOX_SERVICECLASSIFICATION_CREATE).getSelectedKey();
							_CustPo = view.byId(serviceCaseCreation.Ids.INPUT_CUSTPO).getValue();
							majorAssemblyId = view.byId(serviceCaseCreation.Ids.COMBOBOX_EQUIPMENT).getSelectedKey(); //PCR026357++

							/*Begin of Ibase PCR031702++ chnages*/
							if (majorAssemblyId === serviceCaseCreation.constants.MA)
								majorAssemblyDesc = view.byId(serviceCaseCreation.Ids.COMBOBOX_EQUIPMENT)._getSelectedItemText();
							else
								majorAssemblyDesc = view.byId(serviceCaseCreation.Ids.COMBOBOX_EQUIPMENT)._getSelectedItemText().split(/-(.+)/)[1]; //PCR026357++
							/*End of Ibase PCR031702++ chnages*/

							break;

						case "ZPRJ":
							_Categorization = view.byId(serviceCaseCreation.Ids.COMBOBOX_CIDCATEGORIZATION).getSelectedKey();
							_CategorizationGUID = view.byId(serviceCaseCreation.Ids.COMBOBOX_CIDCATEGORIZATION).getSelectedItem().getBindingContext().getObject()
								.KeyValue2; //PCR027291++
							CategorizationDesc = view.byId(serviceCaseCreation.Ids.COMBOBOX_CIDCATEGORIZATION).getSelectedItem().getBindingContext().getObject()
								.KeyValue1; //PCR027291++
							_CustPo = view.byId(serviceCaseCreation.Ids.INPUT_CUSTPO).getValue().trim(); //PCR034663++
							switch (_Categorization) {
								case "02":
									_FixBilling = view.byId(serviceCaseCreation.Ids.COMBOBOX_FIXBILLING).getSelectedKey();
									_Serviceclassification = view.byId(serviceCaseCreation.Ids.COMBOBOX_SERVICECLASSIFICATION_CREATE).getSelectedKey();
									_CustPo = view.byId(serviceCaseCreation.Ids.INPUT_CUSTPO).getValue();
									break;

								case "03":
									_CustPo = view.byId(serviceCaseCreation.Ids.CUST_PO1).getValue();
									_AccAssignment = _CustPo;
									_AccCat = view.byId(serviceCaseCreation.Ids.COMBOBOX_ACC1).getSelectedKey();
									break;
									/*Begin of PCR027291++*/
								case "04":
									_AccCat = view.byId(serviceCaseCreation.Ids.COMBOBOX_ACC).getSelectedKey();
									_AccAssignment = view.byId(serviceCaseCreation.Ids.INPUT_ASSIGNMENT).getValue();
									if (view.byId(serviceCaseCreation.Ids.COMBOBOX_CATEGORY2).getSelectedKey()) {
										_Category2GUID = view.byId(serviceCaseCreation.Ids.COMBOBOX_CATEGORY2).getSelectedItem().getBindingContext().getObject().KeyValue2;
										_Category2 = view.byId(serviceCaseCreation.Ids.COMBOBOX_CATEGORY2).getSelectedKey();
										_Category2Desc = view.byId(serviceCaseCreation.Ids.COMBOBOX_CATEGORY2).getSelectedItem().getBindingContext().getObject().KeyValue1;
									}

									if (view.byId(serviceCaseCreation.Ids.COMBOBOX_CATEGORY3).getSelectedKey()) {
										_Category3 = view.byId(serviceCaseCreation.Ids.COMBOBOX_CATEGORY3).getSelectedKey();
										_Category3GUID = view.byId(serviceCaseCreation.Ids.COMBOBOX_CATEGORY3).getSelectedItem().getBindingContext().getObject().KeyValue2;
										_Category3Desc = view.byId(serviceCaseCreation.Ids.COMBOBOX_CATEGORY3).getSelectedItem().getBindingContext().getObject().KeyValue1;
									}

									if (view.byId(serviceCaseCreation.Ids.COMBOBOX_CATEGORY4).getSelectedKey()) {
										_Category4GUID = view.byId(serviceCaseCreation.Ids.COMBOBOX_CATEGORY4).getSelectedItem().getBindingContext().getObject().KeyValue2;
										_Category4Desc = view.byId(serviceCaseCreation.Ids.COMBOBOX_CATEGORY4).getSelectedItem().getBindingContext().getObject().KeyValue1;
										_Category4 = view.byId(serviceCaseCreation.Ids.COMBOBOX_CATEGORY4).getSelectedKey();
									}
									break;
									/*end of PCR027291++*/
								case "07":
									_AccCat = view.byId(serviceCaseCreation.Ids.COMBOBOX_ACC).getSelectedKey();
									_AccAssignment = view.byId(serviceCaseCreation.Ids.INPUT_ASSIGNMENT).getValue();
									/*Begin of PCR027291++  */
									_Category2 = view.byId(serviceCaseCreation.Ids.COMBOBOX_CATEGORY2).getSelectedKey();
									if (_Category2) {
										_Category2GUID = view.byId(serviceCaseCreation.Ids.COMBOBOX_CATEGORY2).getSelectedItem().getBindingContext().getObject().KeyValue2;
										_Category2Desc = view.byId(serviceCaseCreation.Ids.COMBOBOX_CATEGORY2).getSelectedItem().getBindingContext().getObject().KeyValue1;
									}
									/*end of PCR027291++  */
									break;
								case "08":
									_FixBilling = view.byId(serviceCaseCreation.Ids.COMBOBOX_FIXBILLING).getSelectedKey();
									_Serviceclassification = view.byId(serviceCaseCreation.Ids.COMBOBOX_SERVICECLASSIFICATION_CREATE).getSelectedKey();
									_CustPo = view.byId(serviceCaseCreation.Ids.INPUT_CUSTPO).getValue();
									/*Begin of PCR027291++  */
									_Category2 = view.byId(serviceCaseCreation.Ids.COMBOBOX_CATEGORY2).getSelectedKey();
									if (_Category2) {
										_Category2GUID = view.byId(serviceCaseCreation.Ids.COMBOBOX_CATEGORY2).getSelectedItem().getBindingContext().getObject().KeyValue2;
										_Category2Desc = view.byId(serviceCaseCreation.Ids.COMBOBOX_CATEGORY2).getSelectedItem().getBindingContext().getObject().KeyValue1;
									}
									/*end of PCR027291++  */
									break;
									/* start of PCR016664++ */

								case "14":
									/*Begin of PCR027291++  */
									_Category2 = view.byId(serviceCaseCreation.Ids.COMBOBOX_CATEGORY2).getSelectedKey();
									if (_Category2) {
										_Category2GUID = view.byId(serviceCaseCreation.Ids.COMBOBOX_CATEGORY2).getSelectedItem().getBindingContext().getObject().KeyValue2;
										_Category2Desc = view.byId(serviceCaseCreation.Ids.COMBOBOX_CATEGORY2).getSelectedItem().getBindingContext().getObject().KeyValue1;
									}
									/*end of PCR027291++  */
									_AccCat = view.byId(serviceCaseCreation.Ids.COMBOBOX_ACC).getSelectedKey();
									_AccAssignment = view.byId(serviceCaseCreation.Ids.INPUT_ASSIGNMENT).getValue();
									break;
									/* end of PCR016664++ */

								default:
									break;
							}
							break;

						case "ZCMO":
							_Symptom = view.byId(serviceCaseCreation.Ids.COMBOBOX_CIDSYMPTOM).getParentKey();
							_Fault = view.byId(serviceCaseCreation.Ids.COMBOBOX_CIDFAULT).getSelectedKey();
							_Tier = view.byId(serviceCaseCreation.Ids.COMBOBOX_CIDTIER).getSelectedKey();
							_FixBilling = view.byId(serviceCaseCreation.Ids.COMBOBOX_FIXBILLING).getSelectedKey();
							_Serviceclassification = view.byId(serviceCaseCreation.Ids.COMBOBOX_SERVICECLASSIFICATION_CREATE).getSelectedKey();
							_CustPo = view.byId(serviceCaseCreation.Ids.INPUT_CUSTPO).getValue();
							_NonConform = view.byId(serviceCaseCreation.Ids.COMBOBOX_NONCONFIRM).getSelectedKey();
							_WaferScrap = view.byId(serviceCaseCreation.Ids.INPUT_WAFERSCRAP).getValue();
							sAssemkey = view.byId(serviceCaseCreation.Ids.ASSEM_CMBX).getSelectedKey(); //PCR020942++
							sToolStatKey = view.byId(serviceCaseCreation.Ids.TOOLSTAT_CMBX).getSelectedKey(); //PCR020942++
							majorAssemblyId = view.byId(serviceCaseCreation.Ids.COMBOBOX_EQUIPMENT).getSelectedKey(); //PCR026357++
							/*Begin of Ibase PCR031702++ chnages*/
							if (majorAssemblyId === serviceCaseCreation.constants.MA)
								majorAssemblyDesc = view.byId(serviceCaseCreation.Ids.COMBOBOX_EQUIPMENT)._getSelectedItemText();
							else
								majorAssemblyDesc = view.byId(serviceCaseCreation.Ids.COMBOBOX_EQUIPMENT)._getSelectedItemText().split(/-(.+)/)[1]; //PCR026357++
							/*End of Ibase PCR031702++ chnages*/
							break;

						default:
							break;
					}

					var _date = view.byId(serviceCaseCreation.Ids.START_DATE_DATEPICKER).getDateValue(),
						_time = view.byId(serviceCaseCreation.Ids.START_TIME_TIMEPICKER).getValue(),
						_Zone = view.byId("zone").getText(),
						_AssignedTo = this.Userid,
						_delayStatus = view.byId(serviceCaseCreation.Ids.COMBOBOX_DELAY).getSelectedKey(),
						_problemDescription = view.byId(serviceCaseCreation.Ids.PROBLEM_DESCRIPTION).getValue(),
						_assembly = view.byId(serviceCaseCreation.Ids.COMBOBOX_EQUIPMENT).getSelectedKey();
					var _dateFormat = serviceCaseCreation.formatter.formatter.dateFormatInPost(_date);
					var _timeFormate = _time.substring(0, 2) + _time.substring(3, 5) + "00",
						_dateTime = _dateFormat.concat(_timeFormate);
					var spath = view.getBindingContext().getPath(),
						i = spath.split('/')[3];
					var currentModel = this.getCurrentView().getModel().getData();
					var data = currentModel.d.results[i];
					_fabId = data.Fabid;

					/*Start of PCR018422++ changes; Malfunction Start date and time changes*/
					var sMalfunctionstartdate = (this.ServiceType === "ZCMO") ?
						serviceCaseCreation.formatter.formatter.dateFormatInPost(
							view.byId(serviceCaseCreation.Ids.C_MALFUNCSTRTDT_DTPKR).getDateValue()
						) : "0000-00-00T00:00:00";
					var sMalfunctionstarttime = (this.ServiceType === "ZCMO") ?
						serviceCaseCreation.formatter.formatter.malFuncTimeFormatInPost(
							view.byId(serviceCaseCreation.Ids.C_MALFUNCSTRTTM_TMPKR).getDateValue()
						) : "PT00H00M00S";
					/*End of PCR018422++ changes*/

					if (_FixBilling == "") {
						_serviceContract = data.Servicecontract;
						_warrantyId = data.Warrantyid;
					}

					if (_assembly == "NA" || _assembly == serviceCaseCreation.constants.MA) { // IBase PCR031702++
						_equipment = data.Equipment;
						_serialNumber = data.Serialnumber;
						_customertoolId = data.Customertoolid;
					} else {
						_equipment = _assembly;
						_serialNumber = "";
						_customertoolId = "";
					}
					/*start of PCR026357++*/
					if (this.ServiceType === "ZPMO" || this.ServiceType === "ZCMO") {
						majorAssemblyEqp = data.Equipment;
					}
					if ((this.warranty == " " && this.serviceContract == " ") || (this.warranty == "" && this.serviceContract == "")) {
						var _serviceCaseCreateModel = sap.ui.getCore().getModel("ccServiceCaseCreateModel");
						jQuery.each(_serviceCaseCreateModel.getData().d.results, function(i, oItem) {
							if ((oItem.Assembly == 'NA') && (oItem.Assemblydesc == 'System' || oItem.Assemblydesc == 'SYSTEM')) {
								majorAssemblyEqp = oItem.Equipment;
								_serviceContract = oItem.Servicecontract;
								_warrantyId = oItem.Warrantyid;
								_equipment = oItem.Equipment;
							}
						});
					}
					if (this.serviceContract != " ") {
						_serviceContract = this.serviceContract.slice(0, this.serviceContract.indexOf(" "));
					}
					if (this.warranty != " ") {
						_warrantyId = this.warranty.slice(0, this.warranty.indexOf(" "));
					}
					if (view.byId(serviceCaseCreation.Ids.CURRENCY_ID).getSelectedItem() != null) {
						var currency = view.byId(serviceCaseCreation.Ids.CURRENCY_ID).getSelectedItem().getText();
						if (currency == "USD") {
							var _serviceCaseCreateModel = sap.ui.getCore().getModel("ccServiceCaseCreateModel");
							for (var i = 0; i < _serviceCaseCreateModel.getData().d.results.length; i++) {
								var oItem = _serviceCaseCreateModel.getData().d.results[i];
								if (oItem.Assembly == majorAssemblyId) {
									if (!((oItem.Servicecontract == " " || oItem.Servicecontract == "") && (oItem.Warrantyid == " " || oItem.Warrantyid == ""))) {
										i = _serviceCaseCreateModel.getData().d.results.length;
										break;
									}
								}
								if ((oItem.Assembly == 'NA') && (oItem.Assemblydesc == 'System' || oItem.Assemblydesc == 'SYSTEM')) {
									if (this.ServiceType === "ZCMO") {
										if (oItem.Contractcurrency != "") {
											if (oItem.Contractcurrency == "USD") {
												majorAssemblyEqp = oItem.Equipment;
												_equipment = oItem.Equipment;
											} else if (oItem.Contractcurrency == "RMB") {
												majorAssemblyEqp = oItem.Equipment;
												_equipment = oItem.Equipment;
											}
										} else {
											majorAssemblyEqp = oItem.Equipment;
											_equipment = oItem.Equipment;
										}
									} else {
										majorAssemblyEqp = oItem.Equipment;
										_equipment = oItem.Equipment;
									}
								}
							}
							if (_warrantyId != " ") {
								if (_warrantyId != "") {
									_serviceContract = " ";
								}
							} else {
								_warrantyId = " ";
							}
						} else if (currency == "RMB") {
							var _serviceCaseCreateModel = sap.ui.getCore().getModel("ccServiceCaseCreateModel");
							for (var i = 0; i < _serviceCaseCreateModel.getData().d.results.length; i++) {
								var oItem = _serviceCaseCreateModel.getData().d.results[i];
								if (oItem.Assembly == majorAssemblyId) {
									if (!((oItem.Servicecontract == " " || oItem.Servicecontract == "") && (oItem.Warrantyid == " " || oItem.Warrantyid == ""))) {
										i = _serviceCaseCreateModel.getData().d.results.length;
										break;
									}
								}
								if ((oItem.Assembly == 'NA') && (oItem.Assemblydesc == 'System' || oItem.Assemblydesc == 'SYSTEM')) {
									if (oItem.Contractcurrency != "") {
										if (oItem.Contractcurrency == "RMB") {
											majorAssemblyEqp = oItem.Equipment;
											_equipment = oItem.Equipment;
										}
									} else {
										majorAssemblyEqp = oItem.Equipment;
										_equipment = oItem.Equipment;
									}
								}
							}
							if (_serviceContract != " ") {
								_warrantyId = " ";
							} else {
								_serviceContract = " ";
								_warrantyId = " ";
							}
						}
					} else {
						var _serviceCaseCreateModel = sap.ui.getCore().getModel("ccServiceCaseCreateModel");
						for (var i = 0; i < _serviceCaseCreateModel.getData().d.results.length; i++) {
							var oItem = _serviceCaseCreateModel.getData().d.results[i];
							if (oItem.Assembly == majorAssemblyId) {
								if (!((oItem.Servicecontract == " " || oItem.Servicecontract == "") && (oItem.Warrantyid == " " || oItem.Warrantyid == ""))) {
									i = _serviceCaseCreateModel.getData().d.results.length;
									break;
								}
							}
							if ((oItem.Assembly == 'NA') && (oItem.Assemblydesc == 'System' || oItem.Assemblydesc == 'SYSTEM')) {
								majorAssemblyEqp = oItem.Equipment;
								_equipment = oItem.Equipment;
							}
						}
						if (_warrantyId != " ") {
							if (_warrantyId != "") {
								_serviceContract = " ";
							}
						} else {
							_warrantyId = " ";
						}
					}
					if (majorAssemblyDesc == 'System' && majorAssemblyId == 'NA') {
						majorAssemblyDesc = majorAssemblyDesc.toUpperCase();
					}
					/*end of PCR026357++*/
					
					var sToolStatKey = view.byId(serviceCaseCreation.Ids.TOOLSTAT_CMBX).getSelectedKey(); //PCR033903++

					var updateData = {
						"d": {
							"Servicecasenumber": "",
							"Servicetype": this.ServiceType,
							"Serialnumber": _serialNumber,
							"Customertoolid": _customertoolId,
							"Equipment": _equipment,
							"Soldtoparty": data.Soldtoparty,
							"Fabname": data.Fabname,
							"Problemdescription": _problemDescription.trim(),
							"Startdatetime": _dateTime,
							"TimeZone": _Zone,
							"Assignedto": _AssignedTo.toUpperCase(),
							"Symptom": _Symptom,
							"Fault": _Fault,
							"Delay": _delayStatus,
							"Tier": _Tier,
							"PmtypeCategory": _PmType,
							"Category1": _Categorization,
							"Cat1_GUID": _CategorizationGUID, //PCR027291++
							"Category1Desc": CategorizationDesc, //PCR027291++
							"FixedbillingTm": _FixBilling,
							"Srvclassification": _Serviceclassification,
							"Customerponum": _CustPo.trim(),
							"Salesorg": _Sorg,
							"AcctAssgnCat": _AccCat,
							"AcctAssgn": _AccAssignment,
							"NonConform": _NonConform,
							"WaferScrapCount": _WaferScrap.trim(),
							/*Begin of PCR027291++*/
							"Category2": _Category2,
							"Category3": _Category3,
							"Category4": _Category4,
							"Cat2_GUID": _Category2GUID,
							"Cat3_GUID": _Category3GUID,
							"Cat4_GUID": _Category4GUID,
							"Category2Desc": _Category2Desc,
							"Category3Desc": _Category3Desc,
							"Category4Desc": _Category4Desc,
							/*end of PCR027291++*/
							"Servicecontract": _serviceContract,
							"Warrantyid": _warrantyId,
							"Malfunctionstartdate": sMalfunctionstartdate, //PCR018422++
							"Malfunctionstarttime": sMalfunctionstarttime, //PCR018422++
							"Toolstatus": sToolStatKey, //PCR020942++
							"Assembly": sAssemkey, //PCR020942++
							/*Begin of PCR027779++*/
							"AsmblyStatus": view.byId(serviceCaseCreation.Ids.ASSEMBLY_STAT).getSelectedKey(),
							"CustToolStatus": view.byId(serviceCaseCreation.Ids.CUSTOMER_STAT).getSelectedKey(),
							"ExpDelDate": serviceCaseCreation.formatter.formatter.dateFormatInPost(view.byId(serviceCaseCreation.Ids.EXPECTED_DEL).getDateValue()),
							// "InternalNotes":view.byId(serviceCaseCreation.Ids.INTERNAL_NOTES).getValue(), //PCR030427--
							// "ExternalNotes":view.byId(serviceCaseCreation.Ids.EXTERNAL_NOTES).getValue(), //PCR030427--
							"CustContact": view.byId(serviceCaseCreation.Ids.CUST_CONT_PERS).getValue(),
							/*end of PCR027779++*/
							"SOW_ID": view.byId(serviceCaseCreation.Ids.SOW_ID).getValue(), //PCR029992++
							"MAJASMBLY_DESC": majorAssemblyDesc, //PCR026357++
							"MAJASMBLY_EQUI": majorAssemblyId, //PCR026357++
							"ORIG_EQUI": majorAssemblyEqp, //PCR026357++
							"ZzprjNso" : view.byId(serviceCaseCreation.Ids.NSO_CMBX).getSelectedKey() //PCR034663++
						}
					};

					var self = this;
					self.finishoDataModelregistartionProcessWithParams(
						serviceCaseCreation.util.EventTriggers.SERVICE_CASES_UPDATE_SUCCESS, "handleServiceCaseCreateSuccess",
						serviceCaseCreation.util.EventTriggers.SERVICE_CASES_UPDATE_FAIL, "handleServiceCaseCreateFail",
						serviceCaseCreation.util.ServiceConfigConstants.serviceCaseEntitySet, serviceCaseCreation.util.ServiceConfigConstants.post,
						updateData, "", "", serviceCaseCreation.util.EventTriggers.TRIGGER_SERVICE_CASES_UPDATE
					);
				} else {
					var msgToastText = this.resourceBundle.getText("CreateServiceCase.messageToastText");
					MessageToast.show(msgToastText);
				}
			} else {
				var msgToastField = this.resourceBundle.getText("CreateServiceCase.messageToasField");
				MessageToast.show(msgToastField);
			}
		},

		/**
		 * This method is to open Info Dialog .
		 * @name onInfoDialog1
		 * @param
		 * @returns
		 */
		onInfoDialog1: function() {
			this.destroyDialog();
		},

		/**
		 * This method is to service case creation success
		 * @name handleServiceCaseCreateSuccess
		 * @param oData - Current event parameter
		 * @returns
		 */

		handleServiceCaseCreateSuccess: function(oData) {
			var sSuccesDialogMsg = this.resourceBundle.getText("CreateServiceCase.SuccesDialogMsg");
			var ServiceNum = oData.getParameter("d").Servicecasenumber;
			this.destroyDialog();

			serviceCaseCreation.fragmentHelper.dialogFragmentContent(this, sSuccesDialogMsg, serviceCaseCreation.StandardSAPIcons.ICON_SAP_MSG_SUCCESS,
				"#bada71", "Service Case " + ServiceNum + " has been Created");
			serviceCaseCreation.fragmentHelper.createDialogFragment(this.getCurrentView().getId(), this,
				"serviceCaseCreation.view.fragments.InfoDialog").open();
		},

		/**
		 * This method is to service case creation fail
		 * @name handleServiceCaseCreateFail
		 * @param oData-Current Event Parameter
		 * @returns
		 */
		handleServiceCaseCreateFail: function(oData) {
			this.destroyDialog();
			var sFailureDialogMsg = this.resourceBundle.getText("CreateServiceCase.FailureDialogMsg");
			var errormessage = oData.getParameter("d").ErrorMessage;

			serviceCaseCreation.fragmentHelper.dialogFragmentContent(this, sFailureDialogMsg, serviceCaseCreation.StandardSAPIcons.ICON_SAP_MSG_ERROR,
				"#cc1919", errormessage);
			serviceCaseCreation.fragmentHelper.createDialogFragment(this.getCurrentView().getId(), this,
				"serviceCaseCreation.view.fragments.InfoDialog").open();
		},

		/**
		 * This method is to open Info Dialog .
		 * @name onInfoDialog
		 * @param oEvent-Current Event Parameter
		 * @returns
		 */
		onInfoDialog: function(oEvent) {
			this.destroyDialog();

			var sBusyDialogMsg = this.resourceBundle.getText("CreateServiceCase.BusyDialogMsg");
			serviceCaseCreation.fragmentHelper.dialogFragmentContent(this, "", "", "", sBusyDialogMsg);
			this._busyDialog = serviceCaseCreation.fragmentHelper.createDialogFragment(this.getCurrentView().getId(), this,
				"serviceCaseCreation.view.fragments.BusyDialog");
			/*this._busyDialog.open();
			var _enitySet = serviceCaseCreation.util.ServiceConfigConstants.SserviceCaseEntitySet;

			this.finishoDataModelregistartionProcessWithParams(
				serviceCaseCreation.util.EventTriggers.SERVICE_CASES_SEARCH_SUCCESS,
				"handleMasterListResetSuccess",
				serviceCaseCreation.util.EventTriggers.SERVICE_CASES_SEARCH_FAIL,
				"handleMasterListResetFail",
				_enitySet,
				serviceCaseCreation.util.ServiceConfigConstants.get,
				"",
				"",
				"",
				serviceCaseCreation.util.EventTriggers.TRIGGER_SERVICE_CASES_SEARCH_READ);PCR033903--*/
			this.handleMasterListResetSuccess();//PCR033903++
		},

		/**
		 * This method is to success call of Master List .
		 * @name handleMasterListResetSuccess
		 * @param
		 * @returns
		 */
		handleMasterListResetSuccess: function() {
			//this.destroyDialog(); PCR033903--
			sap.ui.getCore().byId(serviceCaseCreation.Ids.APP_PAGE).byId(serviceCaseCreation.Ids.FIORI_CONTENT).addStyleClass("svcCreate");//PCR033903++
			sap.ui.getCore().byId(serviceCaseCreation.Ids.APP_PAGE).byId(serviceCaseCreation.Ids.FIORI_CONTENT).setMode(sap.m.SplitAppMode.StretchCompressMode);
			//this.getRouter().navTo("serviceCreatetoMaster");  PCR033903--
			this.getRouter().navTo("serviceCreatetoMasterReset"); //PCR033903++
		},

		/**
		 * This method is to failure call of Master List .
		 * @name handleMasterListResetFail
		 * @param
		 * @returns
		 */
		handleMasterListResetFail: function() {
			this.destroyDialog();
			sap.ui.getCore().byId(serviceCaseCreation.Ids.APP_PAGE).byId(serviceCaseCreation.Ids.FIORI_CONTENT).addStyleClass("svcCreate");//PCR033903++
			sap.ui.getCore().byId(serviceCaseCreation.Ids.APP_PAGE).byId(serviceCaseCreation.Ids.FIORI_CONTENT).setMode(sap.m.SplitAppMode.StretchCompressMode);
			this.getRouter().navTo("serviceCreatetoMaster");
		},

		/**
		 * This method called when user click on Cancel button and change the visibility of Buttons.
		 * @name onCancel
		 * @param
		 * @returns
		 */
		onCancel: function() {
			sap.ui.getCore().byId(serviceCaseCreation.Ids.APP_PAGE).byId(serviceCaseCreation.Ids.FIORI_CONTENT).addStyleClass("svcCreate");//PCR033903++
			sap.ui.getCore().byId(serviceCaseCreation.Ids.APP_PAGE).byId(serviceCaseCreation.Ids.FIORI_CONTENT).setMode(sap.m.SplitAppMode.StretchCompressMode);
			this.getRouter().navTo("serviceCreatetoMaster");
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
		 * This method is to close dialog fragment to searching assigned person .
		 * @name onCancelAssignedTo
		 * @param
		 * @returns
		 */
		onCancelAssignedTo: function() {
			this.destroyDialog();
		},

		/**
		 * This method is called on ok click on the assigned to fragment .
		 * @name onAssignedTo
		 * @param
		 * @returns
		 */
		onAssignedTo: function() {
			var oView = this.getView(),
				sUserId = oView.byId(serviceCaseCreation.Ids.USERID_INPUT).getValue(),
				sFirstName = oView.byId(serviceCaseCreation.Ids.FIRST_NAME_INPUT).getValue().trim().replace(/ /g, "%20"),
				sLastName = oView.byId(serviceCaseCreation.Ids.LAST_NAME_INPUT).getValue().trim().replace(/ /g, "%20"),
				sAsnMessageToast = this.resourceBundle.getText("CreateServiceCase.AssignMessageToast");

			if (sFirstName || sLastName || sUserId) {
				this.destroyDialog();

				var sBusyDialogMsg = this.resourceBundle.getText("CreateServiceCase.BusyDialogMsg");
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
					aEntitySet[0],
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
				var sMessageToast = this.resourceBundle.getText("CreateServiceCase.MessageToast");
				MessageToast.show(sMessageToast);
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
		 * This method is to select line item for assigning service case .
		 * @name onSelectAssignedName
		 * @param oEvent-Current Event Parameter
		 * @returns
		 */
		onSelectAssignedName: function(oEvent) {
			var oView = this.getView();
			var oTable = oView.byId(serviceCaseCreation.Ids.ASSIGNED_SEARCH_RESULT_TABLE);
			var assigned = oView.byId(serviceCaseCreation.Ids.ASSIGNEDTO_INPUT);

			if (oTable.getSelectedItem()) {
				var firstName = oTable.getSelectedItem().getBindingContext().getProperty("Firstname");
				var lastName = oTable.getSelectedItem().getBindingContext().getProperty("Lastname");
				this.Userid = oTable.getSelectedItem().getBindingContext().getProperty("Userid");
				assigned.setValue(firstName + " " + lastName);
				this.assignName = firstName + " " + lastName;
			}

			if (assigned.getValue())
				assigned.setValueState("None");
			else
				assigned.setValueState("Error");

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

		/* =========================================================== */
		/* begin: internal methods                                     */
		/* =========================================================== */

		/**
		 * This method is to hide and show the elements with ID's
		 * @name _toggleElementsAvailability
		 * @param
		 * @returns
		 */
		_toggleElementsAvailability: function() {
			this.hideElementsWithIDs(this.hideElements);
			this.showElementsWithIDs(this.showElements);
		},

		/**
		 * This method is to clear the selected key for the elements.
		 * @name clearKeyValueswithIds
		 * @param
		 * @returns
		 */
		clearKeyValueswithIds: function(aElementIDs) {
			var oView = this.getView();

			for (var elementID in aElementIDs)
				oView.byId(aElementIDs[elementID]).setSelectedKey("");
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

			switch (selKey) {
				case "02":
				case "03":
				case "04":
				case "05":
				case "06":
					this.showElements = [
						serviceCaseCreation.Ids.CATEGORY3_FLEX
					]
					this.hideElements = [
						serviceCaseCreation.Ids.CATEGORY4_FLEX
					]
					break;
				default:
					this.showElements = [

					];
					this.hideElements = [
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

			//var fnStyleClass = (selKey === "14") ? "addStyleClass" : "removeStyleClass";
			//oView.byId(serviceCaseCreation.Ids.CAT_TWO_LBL)[fnStyleClass]("asteriskCC");
			//oView.byId(serviceCaseCreation.Ids.COMBOBOX_CATEGORY2).setValueState("None");

			if (aCatagory3.length > 0) {
				var catagory3Model = new sap.ui.model.json.JSONModel();

				catagory3Model.setData(aCatagory3);
				oView.byId(serviceCaseCreation.Ids.COMBOBOX_CATEGORY3).setSelectedKey("");
				oView.byId(serviceCaseCreation.Ids.COMBOBOX_CATEGORY3).setModel(catagory3Model);
			}

			this._toggleElementsAvailability();
		},

		/**
		 * This method is for checking value state category 3
		 * @name onChangeCat3
		 * @param oEvent-Current Event Parameter
		 * @returns
		 */
		onChangeCat3: function(oEvent) {
			var oView = this.getView();
			var sValueState = (oEvent.getSource().getValue().length) ? "None" : "Error";
			oEvent.getSource().setValueState(sValueState);
			var selKey = oEvent.getSource().getSelectedKey();
			var sGuidkey = oEvent.getSource().getSelectedItem().getBindingContext().getObject().KeyValue2;

			switch (selKey) {
				case "02":
				case "03":
				case "04":
				case "05":
				case "06":
					this.showElements = [
						serviceCaseCreation.Ids.CATEGORY4_FLEX
					]
					this.hideElements = [

					]
					break;
				default:
					this.showElements = [

					];
					this.hideElements = [
						serviceCaseCreation.Ids.CATEGORY4_FLEX
					]
					break;
			}

			/*
			 * setting Values of category4 based on category 3*/
			var aCatagory4 = [];
			jQuery.each(sap.ui.getCore().getModel("ccMasterListModel").getData().masterListSets.category4, function(i, item) {
				if (item.ParentGuidKey == selKey && sGuidkey == item.KeyValue3) //PCR027291++ added sGuidkey ==item.KeyValue3
					aCatagory4.push(item)
			});

			//var fnStyleClass = (selKey === "14") ? "addStyleClass" : "removeStyleClass";
			//oView.byId(serviceCaseCreation.Ids.CAT_TWO_LBL)[fnStyleClass]("asteriskCC");
			//oView.byId(serviceCaseCreation.Ids.COMBOBOX_CATEGORY2).setValueState("None");

			if (aCatagory4.length > 0) {
				var catagory4Model = new sap.ui.model.json.JSONModel();

				catagory4Model.setData(aCatagory4);
				oView.byId(serviceCaseCreation.Ids.COMBOBOX_CATEGORY4).setSelectedKey("");
				oView.byId(serviceCaseCreation.Ids.COMBOBOX_CATEGORY4).setModel(catagory4Model);
			}

			this._toggleElementsAvailability();
		},
		/* end of PCR027291++ */
		/**
		 * This method will help to identify the route pattern when navigate to Service Order view .
		 * @name _onAttachRouteMatched
		 * @param oEvent- Current event parameter
		 * @returns
		 */
		_onAttachRouteMatched: function(oEvent) {
			if (oEvent.getParameter("name") === "serviceCreate" || oEvent.getParameter("name") === "serviceCreateWithSrvType") { //PCR032539++; added || oEvent.getParameter("name") === "serviceCreateWithSrvType"
				var sSrvTyp = oEvent.getParameter("arguments").ServiceType; //PCR032539++
				sSrvTyp = sSrvTyp ? sSrvTyp : "ZCMO"; //PCR032539++
				this._Contractdetails = [];
				this._Assemblydetails = [];
				this.warranty = "";
				this._oSymLevels = {}; //PCR017437++
				/* for making the app full screen */
				sap.ui.getCore().byId(serviceCaseCreation.Ids.APP_PAGE).byId(serviceCaseCreation.Ids.FIORI_CONTENT).setMode(sap.m.SplitAppMode.HideMode)
				sap.ui.getCore().byId(serviceCaseCreation.Ids.APP_PAGE).byId(serviceCaseCreation.Ids.FIORI_CONTENT).removeStyleClass("svcCreate");//PCR033903++
				var oView = this.getCurrentView();
				this.contextPath = this._sPath = "";
				oView.byId(serviceCaseCreation.Ids.COMBOBOX_CIDSYMPTOM).rerender(); //PCR020942++
				oView.byId(serviceCaseCreation.Ids.START_DATE_DATEPICKER).setDisplayFormat("dd-MMM-yyyy");
				var masterListModel = sap.ui.getCore().getModel("ccMasterListModel");
				oView.byId(serviceCaseCreation.Ids.COMBOBOX_DELAY).setModel(masterListModel);
				oView.byId(serviceCaseCreation.Ids.COMBOBOX_CIDSYMPTOM).setModel(masterListModel);
				oView.byId(serviceCaseCreation.Ids.COMBOBOX_CIDCATEGORIZATION).setModel(masterListModel);
				oView.byId(serviceCaseCreation.Ids.COMBOBOX_CIDTIER).setModel(masterListModel);
				oView.byId(serviceCaseCreation.Ids.COMBOBOX_FIXBILLING).setModel(masterListModel);
				oView.byId(serviceCaseCreation.Ids.COMBOBOX_SERVICECLASSIFICATION_CREATE).setModel(masterListModel);
				oView.byId(serviceCaseCreation.Ids.COMBOBOX_CIDPMTYPE).setModel(masterListModel);
				oView.byId(serviceCaseCreation.Ids.COMBOBOX_ACC).setModel(masterListModel);
				oView.byId(serviceCaseCreation.Ids.COMBOBOX_ACC1).setModel(masterListModel);
				oView.byId(serviceCaseCreation.Ids.COMBOBOX_NONCONFIRM).setModel(masterListModel);
				oView.byId(serviceCaseCreation.Ids.COMBOBOX_CATEGORY2).setModel(masterListModel);
				oView.byId(serviceCaseCreation.Ids.TOOLSTAT_CMBX).setModel(masterListModel); //PCR020942++
				oView.byId(serviceCaseCreation.Ids.ASSEMBLY_STAT).setModel(masterListModel); //PCR027779++
				oView.byId(serviceCaseCreation.Ids.CUSTOMER_STAT).setModel(masterListModel); //PCR027779++
				oView.byId(serviceCaseCreation.Ids.NSO_CMBX).setModel(masterListModel); //PCR034663++

				var that = this;
				jQuery.each(this.aLabels, function(i, oItem) {
					that.getView().byId(oItem).addStyleClass("asteriskCC");
				});

				this.clearElementsWithIDs([
					serviceCaseCreation.Ids.ASSIGNEDTO_INPUT,
					serviceCaseCreation.Ids.INPUT_CUSTPO,
					serviceCaseCreation.Ids.CREATE_FABID,
					serviceCaseCreation.Ids.PROBLEM_DESCRIPTION,
					serviceCaseCreation.Ids.CREATE_SERIAL_NUMBER,
					serviceCaseCreation.Ids.SERVICE_TYPE,
					serviceCaseCreation.Ids.CREATE_CUSTOMER_TOOLID,
					serviceCaseCreation.Ids.START_DATE_DATEPICKER,
					serviceCaseCreation.Ids.START_TIME_TIMEPICKER,
					serviceCaseCreation.Ids.COMBOBOX_DELAY,
					// serviceCaseCreation.Ids.COMBOBOX_CIDSYMPTOM, //PCR020942--
					serviceCaseCreation.Ids.COMBOBOX_CIDFAULT,
					serviceCaseCreation.Ids.COMBOBOX_CIDTIER,
					serviceCaseCreation.Ids.COMBOBOX_CIDCATEGORIZATION,
					serviceCaseCreation.Ids.COMBOBOX_FIXBILLING,
					serviceCaseCreation.Ids.COMBOBOX_SERVICECLASSIFICATION_CREATE,
					serviceCaseCreation.Ids.COMBOBOX_CIDPMTYPE,
					serviceCaseCreation.Ids.INPUT_CUSTPO,
					serviceCaseCreation.Ids.CURRENCY_ID,
					serviceCaseCreation.Ids.COMBOBOX_ACC,
					serviceCaseCreation.Ids.INPUT_ASSIGNMENT,
					serviceCaseCreation.Ids.INPUT_WAFERSCRAP,
					serviceCaseCreation.Ids.COMBOBOX_CATEGORY2,
					serviceCaseCreation.Ids.TOOLSTAT_CMBX, //PCR020942++
					serviceCaseCreation.Ids.ASSEM_CMBX, //PCR020942++
					serviceCaseCreation.Ids.C_MALFUNCSTRTDT_DTPKR, //PCR018422++
					serviceCaseCreation.Ids.C_MALFUNCSTRTTM_TMPKR, //PCR018422++
					/*Begin of PCR027779++*/
					serviceCaseCreation.Ids.EXPECTED_DEL,
					serviceCaseCreation.Ids.CUST_CONT_PERS,
					/*End of PCR027779++*/
					serviceCaseCreation.Ids.INPUT_CUSTPO, //PCR034663++
				]);

				this.clearKeyValueswithIds([
					serviceCaseCreation.Ids.COMBOBOX_DELAY,
					// serviceCaseCreation.Ids.COMBOBOX_CIDSYMPTOM, //PCR020942--
					serviceCaseCreation.Ids.COMBOBOX_CIDFAULT,
					serviceCaseCreation.Ids.COMBOBOX_CIDTIER,
					serviceCaseCreation.Ids.COMBOBOX_CIDCATEGORIZATION,
					serviceCaseCreation.Ids.COMBOBOX_FIXBILLING,
					serviceCaseCreation.Ids.COMBOBOX_SERVICECLASSIFICATION_CREATE,
					serviceCaseCreation.Ids.COMBOBOX_CIDPMTYPE,
					serviceCaseCreation.Ids.CURRENCY_ID,
					serviceCaseCreation.Ids.COMBOBOX_ACC,
					serviceCaseCreation.Ids.COMBOBOX_EQUIPMENT,
					serviceCaseCreation.Ids.TOOLSTAT_CMBX, //PCR020942++
					serviceCaseCreation.Ids.ASSEM_CMBX, //PCR020942++
					/*Begin of PCR027779++*/
					serviceCaseCreation.Ids.ASSEMBLY_STAT,
					serviceCaseCreation.Ids.CUSTOMER_STAT,
					/*End of PCR027779++*/
					/*Begin of PCR027291++*/
					serviceCaseCreation.Ids.COMBOBOX_CATEGORY3,
					serviceCaseCreation.Ids.COMBOBOX_CATEGORY4,
					/*End of PCR027291++*/
					serviceCaseCreation.Ids.NSO_CMBX //PCR034663++
				]);

				this.setErrorStateNoneForElementsWithIDs([
					serviceCaseCreation.Ids.ASSIGNEDTO_INPUT,
					serviceCaseCreation.Ids.PROBLEM_DESCRIPTION,
					serviceCaseCreation.Ids.START_DATE_DATEPICKER,
					serviceCaseCreation.Ids.CREATE_SERIAL_NUMBER,
					serviceCaseCreation.Ids.CREATE_FABID,
					// serviceCaseCreation.Ids.COMBOBOX_CIDSYMPTOM, //PCR020942--
					serviceCaseCreation.Ids.COMBOBOX_CIDFAULT,
					serviceCaseCreation.Ids.COMBOBOX_CIDPMTYPE,
					serviceCaseCreation.Ids.COMBOBOX_CIDCATEGORIZATION,
					serviceCaseCreation.Ids.COMBOBOX_EQUIPMENT,
					serviceCaseCreation.Ids.CREATE_CUSTOMER_TOOLID,
					serviceCaseCreation.Ids.CURRENCY_ID,
					serviceCaseCreation.Ids.COMBOBOX_ACC,
					serviceCaseCreation.Ids.INPUT_ASSIGNMENT,
					serviceCaseCreation.Ids.COMBOBOX_NONCONFIRM,
					serviceCaseCreation.Ids.COMBOBOX_FIXBILLING,
					serviceCaseCreation.Ids.TOOLSTAT_CMBX, //PCR020942++
					serviceCaseCreation.Ids.ASSEM_CMBX, //PCR020942++
					serviceCaseCreation.Ids.C_MALFUNCSTRTDT_DTPKR, //PCR018422++
					serviceCaseCreation.Ids.C_MALFUNCSTRTTM_TMPKR, //PCR018422++
					serviceCaseCreation.Ids.NSO_CMBX, //PCR034663++
					serviceCaseCreation.Ids.INPUT_CUSTPO //PCR034663++
				]);

				var serviceCaseCreateModel = new sap.ui.model.json.JSONModel();
				sap.ui.getCore().setModel(serviceCaseCreateModel, "ccServiceCaseCreateModel");
				oView.setModel(sap.ui.getCore().getModel("ccServiceCaseCreateModel"));
				
				// Start of PCR032539++ Changes
				
				oView.byId(serviceCaseCreation.Ids.SERVICE_TYPE).setSelectedKey(sSrvTyp);
				// oView.byId(serviceCaseCreation.Ids.SERVICE_TYPE).setSelectedKey("ZCMO");
				
				oView.byId(serviceCaseCreation.Ids.COMBOBOX_NONCONFIRM).setSelectedKey("STD");
				// this.ServiceType = "ZCMO";
				this.ServiceType = sSrvTyp;
				
				// End of PCR032539++ Changes

				//for corrective maintenace dont show categorization field but remaining fields need to show
				this.showElements = [
					serviceCaseCreation.Ids.CATEGORY_GRID,
					serviceCaseCreation.Ids.CATEGORY_TOOLBAR,
					serviceCaseCreation.Ids.SYMPTOM_FLEX,
					serviceCaseCreation.Ids.FAULT_FLEX,
					serviceCaseCreation.Ids.CUST_LBL,
					serviceCaseCreation.Ids.SERVICECLASSIFICATION_FLEX,
					serviceCaseCreation.Ids.PAID_SERVICE_GRID,
					serviceCaseCreation.Ids.FIXBILL_FLEX,
					serviceCaseCreation.Ids.INPUT_CUSTPO_FLEX,
					serviceCaseCreation.Ids.TOOLBAR_CONTRACT,
					serviceCaseCreation.Ids.GRID_CONTRACT,
					serviceCaseCreation.Ids.CONFIRM_FLEX,
					serviceCaseCreation.Ids.WAFER_FLEX,
					serviceCaseCreation.Ids.NSO_FLXBX, //PCR034663++
				]

				this.hideElements = [
					serviceCaseCreation.Ids.TIER_FLEX,
					serviceCaseCreation.Ids.CATEGORIZATION_FLEX,
					serviceCaseCreation.Ids.CURRENCY_FLEX,
					serviceCaseCreation.Ids.PM_TYPE_FLEX,
					//serviceCaseCreation.Ids.PM_FLEX,            //PCR016459
					//serviceCaseCreation.Ids.CATEGORY_TOOLBAR1,      //PCR016459
					serviceCaseCreation.Ids.OPPNO_LBL,
					serviceCaseCreation.Ids.ACC_FLEX,
					serviceCaseCreation.Ids.ACC_ASSIGN_FLEX,
					serviceCaseCreation.Ids.PAID_GRID1,
					serviceCaseCreation.Ids.CUST_PO_FLEX1,
					serviceCaseCreation.Ids.ACC_FLEX1,
					serviceCaseCreation.Ids.CATEGORY2_FLEX,
					serviceCaseCreation.Ids.CATEGORY3_FLEX, //PCR027291++
					serviceCaseCreation.Ids.CATEGORY4_FLEX //PCR027291++
				]

				this._toggleElementsAvailability();
				this.oppPlaceholder = oView.getModel("i18n").getResourceBundle().getText("CreateServiceCase.EnterOpportunityNumber");
				this.custPoPlaceholder = oView.getModel("i18n").getResourceBundle().getText("CreateServiceCase.EnterCustomerPONumber");
				oView.byId(serviceCaseCreation.Ids.INPUT_CUSTPO).setPlaceholder(this.custPoPlaceholder);

				if (this.assignName)
					oView.byId(serviceCaseCreation.Ids.ASSIGNEDTO_INPUT).setValue(this.assignName);

				//Changed as part of Case INC02750204 on 13 June 2017
				//Should allow current,past and future date

				var date = new Date(),
					oStartDateDatePicker = oView.byId(serviceCaseCreation.Ids.START_DATE_DATEPICKER);
				oStartDateDatePicker.setDateValue(date);

				/*Begin of PCR020942++ changes*/

				var oSymOneCmbx = oView.byId(serviceCaseCreation.Ids.COMBOBOX_CIDSYMPTOM);
				oSymOneCmbx.removeStyleClass("inputMenuValueStateError");
				oSymOneCmbx.addStyleClass("inputMenuBorder");

				oSymOneCmbx.getAggregation("_input").setValue("");
				oSymOneCmbx.setArrParentFilers([]);
				oSymOneCmbx.setParentKey("");

				/*End of PCR020942++ changes*/

				/*this._oDate = new Date(date.toDateString());
				//Changed as part of Case INC02720654 on 02 June 2017 PCR014506
				//Should not allow future dates
				//Setting max date as current date thereby preventing future dates
				oStartDateDatePicker.setMaxDate(date);*/

				var date1 = new Date();
				oView.byId(serviceCaseCreation.Ids.START_TIME_TIMEPICKER).setDateValue(date1);
				oView.byId(serviceCaseCreation.Ids.CREATE_SERIAL_NUMBER).setEnabled(true);
				oView.byId(serviceCaseCreation.Ids.CREATE_CUSTOMER_TOOLID).setEnabled(true);
				oView.byId(serviceCaseCreation.Ids.CREATE_FABID).setEnabled(true);
			}
			this.byId(serviceCaseCreation.Ids.PAGE_ID).scrollTo(0);
			/*Begin of PCR034663++*/
			this.getView().byId(serviceCaseCreation.Ids.NSO_CMBX).setEnabled(false);
			this.getView().byId(serviceCaseCreation.Ids.NSO_LBL).removeStyleClass("asteriskCC");
			this.getView().byId(serviceCaseCreation.Ids.OPPNO_LBL).removeStyleClass("asteriskCC");
			/*End of PCR034663++*/

			// Start of PCR032539++ Changes

			if (sSrvTyp) {
				oView.byId(serviceCaseCreation.Ids.SERVICE_TYPE).fireSelectionChange();
			}

			// End of PCR032539++ Changes
		},

		/***************** PCR017437++ change start *****************/

		/**
		 * An internal method to bind data to Symptom level fields.
		 * @name _fnFilterSymptomLevelsBindings
		 * @param {Object} oContext - Current Context
		 * @returns
		 */
		_fnFilterSymptomLevelsBindings: function(oContext) {
			serviceCaseCreation.util.Util.filterSymptomLevelsBindings.call(this, oContext, "NavToSymptoms", serviceCaseCreation.Ids.COMBOBOX_CIDSYMPTOM);

		},

		/**
		 * An internal method to call a method to clear Bindings and filters of Symptom level fields .
		 * @name _FnClearExitingFiltersAndBindNewData
		 * @param {Object} oContext - Current Context
		 * @returns
		 */
		_FnClearExitingFiltersAndBindNewData: function(oContext) {
			var oView = this.getCurrentView();
			var oSymOneCmbx = oView.byId(serviceCaseCreation.Ids.COMBOBOX_CIDSYMPTOM); //PCR020942++

			if (this.getCurrentView().byId(serviceCaseCreation.Ids.SERVICE_TYPE).getSelectedKey() === "ZCMO") {
				/*Begin of PCR020942++ changes*/

				/*serviceCaseCreation.util.Util.clearSympLevelElementsBindings.call(this, [serviceCaseCreation.Ids.COMBOBOX_CIDFAULT,
				  serviceCaseCreation.Ids.COMBOBOX_CIDSYMPTOM
				]);

				serviceCaseCreation.util.Util.filterSymptomLevelsBindings.call(this, oContext, "NavToSymptoms", serviceCaseCreation.Ids.COMBOBOX_CIDSYMPTOM);*/

				serviceCaseCreation.util.Util.clearSympLevelElementsBindings.call(this, [
					serviceCaseCreation.Ids.COMBOBOX_CIDFAULT
				]);

				var aSymOneFilter = serviceCaseCreation.util.Util.filterSymptomLevelsBindings.call(this, oContext, "NavToSymptoms");
				oSymOneCmbx.setArrParentFilers(aSymOneFilter);

				/*End of PCR020942++ changes*/
			}
		},

		/**
		 * An internal method to clear Bindings and filters of Symptom level fields .
		 * @name _fnClearSympLevelElementsBindings
		 * @param
		 * @returns
		 */
		_fnClearSympLevelElementsBindings: function() {
			serviceCaseCreation.util.Util.clearSympLevelElementsBindings.call(this, [serviceCaseCreation.Ids.COMBOBOX_CIDFAULT,
				// serviceCaseCreation.Ids.COMBOBOX_CIDSYMPTOM, //PCR020942--
			]);
		},

		/***************** PCR017437++ change end *****************/

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
		 * Event handler for InputMenu control - parent selection change.
		 * @name onSymLevelOneSelectionChange
		 * @param {Object} oEvent - event handler object
		 */
		onSymLevelOneSelectionChange: function(oEvent) {
			var aSymLevelTwoElement = [
				serviceCaseCreation.Ids.COMBOBOX_CIDFAULT
			];
			var oSymOneCmbx = this.byId(serviceCaseCreation.Ids.COMBOBOX_CIDSYMPTOM),
				oSymTwoCmbx = this.byId(serviceCaseCreation.Ids.COMBOBOX_CIDFAULT);
			var oSymOne = oEvent.getParameter("oParent");
			var aChildFil;

			if (Object.keys(oSymOne).length) {
				this.sServiceType = "ZCMO";
				serviceCaseCreation.util.Util._fnSetSymLevelsFieldsData.call(this,
					oSymOne.GuidKey,
					serviceCaseCreation.Ids.COMBOBOX_CIDFAULT,
					Object.keys(oSymOne).length > 2                                                                                                                                  //PCR035464++
				);
				aChildFil = serviceCaseCreation.util.Util.filterSymptomLevelTwoBindings.call(this,
					oSymOne.KeyValue1,
					serviceCaseCreation.Ids.COMBOBOX_CIDFAULT,
					"onCreate"
				);
				oSymOneCmbx.setArrChildFilters([
					new Filter({
						filters: aChildFil ? aChildFil : [],
						and: false
					}),
					new Filter("ParentGuidKey", FilterOperator.EQ, oSymOne.GuidKey)
				]);
				serviceCaseCreation.util.Util.filterSymptomLevelTwoBindings.call(this,
					oSymOne.KeyValue1,
					serviceCaseCreation.Ids.COMBOBOX_CIDFAULT,
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
				oSymTwoCmbx = this.byId(serviceCaseCreation.Ids.COMBOBOX_CIDFAULT);

			serviceCaseCreation.util.Util.filterSymptomLevelTwoBindings.call(this,
				oSymLev.oParent.KeyValue1,
				serviceCaseCreation.Ids.COMBOBOX_CIDFAULT,
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
			var view = this.getView();
			var oModel = sap.ui.getCore().getModel("ccServiceCaseCreateModel");

			var equipment = "",
				equipmentdesc = "",
				singquo = "'";
			equipment = view.byId(serviceCaseCreation.Ids.COMBOBOX_EQUIPMENT).getSelectedKey();
			if (equipment)
				equipmentdesc = view.byId(serviceCaseCreation.Ids.COMBOBOX_EQUIPMENT)._getSelectedItemText().split(/-(.+)/)[1];

			var surlParams = serviceCaseCreation.Constants.ARKEQUIP + singquo + oModel.getData().d.results[0].Equipment + singquo +
				serviceCaseCreation.Constants.ARKSN + singquo + oModel.getData().d.results[0].Serialnumber + singquo +
				serviceCaseCreation.Constants.ARKT1 + singquo + oModel.getData().d.results[0].Equipment + singquo +
				serviceCaseCreation.Constants.ARKMAJASS + singquo + equipmentdesc + singquo +
				serviceCaseCreation.Constants.ARKMAJASSID + singquo + equipment + singquo;

			if (sap.ui.getCore().getModel("ccARKModel").getData().d.EvArkUrl)
				sap.m.URLHelper.redirect(sap.ui.getCore().getModel("ccARKModel").getData().d.EvArkUrl + surlParams, true);
			else
				MessageToast.show(sap.ui.getCore().getModel("ccARKModel").getData().d.EvError);
		},
		/*End of PCR030996++*/

		/* Begin of IBASE PCR031702++ */
		/**
		 * This method will open Input field/Pop up to take user inputs based on scenario's.
		 * @name onPressSuggestionButton
		 * @param {Object} oEvent - event handler object
		 */
		onPressSuggestionButton: function(oEvent) {
			var cust = oEvent.getSource().data("buttonCust"),
				assembly = oEvent.getSource().data("buttonAssm"),
				position = oEvent.getSource().data("buttonPos"),
				oView = this.getView();
			this.oIbaseModel = this.getOwnerComponent().getModel(serviceCaseCreation.constants.IBaseModel);

			if (cust) {
				this.oIbaseModel.setProperty("/custSuggest", true);
				this.oIbaseModel.setProperty("/custSuggestBtn", false);

			} else if (assembly) {
				this._openAssemblyDialog();
				this._getIbaseStructure(true);
				this.oIbaseModel.setProperty("/newAssemblyPanel", true);
				this.oIbaseModel.setProperty("/newPositionColumn", false);
				sap.ui.getCore().byId(serviceCaseCreation.Ids.IBASE_DIALOG_ADDASSEMBLY).setTitle(this.resourceBundle.getText(
					"IBase.NewAssemblyTitle"));
				sap.ui.getCore().byId(serviceCaseCreation.Ids.IBASE_DLGBTN_POSCHG).setVisible(true);
				sap.ui.getCore().byId(serviceCaseCreation.Ids.IBASE_DLGBTN_POSCHG_CANCEL).setVisible(false);
				sap.ui.getCore().byId(serviceCaseCreation.Ids.IBASE_SEL_OBJECTTYPE).setSelectedKey("");
				this.onObjectTypeChange();

			} else if (position) {
				this._getIbaseStructure(false);
				this._openAssemblyDialog();
				this.oIbaseModel.setProperty("/newAssemblyPanel", false);
				this.oIbaseModel.setProperty("/newPositionColumn", true);
				sap.ui.getCore().byId(serviceCaseCreation.Ids.IBASE_DIALOG_ADDASSEMBLY).setTitle(this.resourceBundle.getText(
					"IBase.ChangePositionTitle"));
				sap.ui.getCore().byId(serviceCaseCreation.Ids.IBASE_DLGBTN_POSCHG).setVisible(false);
				sap.ui.getCore().byId(serviceCaseCreation.Ids.IBASE_DLGBTN_POSCHG_CANCEL).setVisible(false);

			}

		},
		/**
		 * This method is to fetch Ibase Chamber Structure and Positions.
		 * @name _getIbaseStructure
		 * @param asmbly - holds boolean value
		 * @returns
		 */
		_getIbaseStructure: function(asmbly) {
			var oServiceCaseModel = sap.ui.getCore().getModel("ccServiceCaseCreateModel"),
				sEquipment = oServiceCaseModel.getData().d.results[0].Equipment,
				sSerial = oServiceCaseModel.getData().d.results[0].Serialnumber,
				sPbg = oServiceCaseModel.getData().d.results[0].Pbg;
			this.oIbaseModel.setProperty("/iBaseUrl", true);

			this.oServiceCaseModel = new serviceCaseCreation.model.SvcCreateCoreModel(this);
			this.oServiceCaseModel.attachserviceCaseCreationEventWithEventName(serviceCaseCreation.util.EventTriggers.IBASE_ASSEMBLYPOSITION_READ_SUCCESS,
				jQuery.proxy(this.handleIbaseAssemblyPositionSuccess), this);
			this.oServiceCaseModel.attachserviceCaseCreationEventWithEventName(serviceCaseCreation.util.EventTriggers.IBASE_ASSEMBLYPOSITION_READ_FAIL,
				jQuery.proxy(this.handleIbaseAssemblyPositionFail), this);
			this.oServiceCaseModel.addBatchOperation(serviceCaseCreation.util.ServiceConfigConstants.assemblyPositionList +
				"?IvFilter=%27%27&SerialNumber=%27" + sSerial + "%27&ToolId=%27" + sEquipment + "%27&MaterialNumber=%27%27",
				serviceCaseCreation.util.ServiceConfigConstants.get, "", "", "");
			this.oServiceCaseModel.addBatchOperation(serviceCaseCreation.util.ServiceConfigConstants.chamberPositionSet +
				"?$filter=SerialNumber%20eq%20%27" + sSerial + "%27%20and%20ToolId%20eq%20%27" + sEquipment +
				"%27%20and%20MaterialNumber%20eq%20%27%27%20and%20IvOnlyChamber%20eq%20%27X%27",
				serviceCaseCreation.util.ServiceConfigConstants.get, "", "", "");

			if (asmbly) {
				this.oServiceCaseModel.addBatchOperation(serviceCaseCreation.util.ServiceConfigConstants.assemblyDropdownSet +
					"?$expand=Nav_CharName/Nav_CharValuesSet&$filter=IvPbg%20eq%20%27" + sPbg + "%27",
					serviceCaseCreation.util.ServiceConfigConstants.get, "", "", "");

			}
			this.oServiceCaseModel.fireserviceCaseCreationEventWithEventName(serviceCaseCreation.util.EventTriggers.TRIGGER_IBASE_ASSEMBLYPOSITION_READ);

		},
		/**
		 * This method is for Success service call of onPressSuggestionButton.
		 * @name handleIbaseAssemblyPositionSuccess
		 * @param
		 * @returns
		 */
		handleIbaseAssemblyPositionSuccess: function() {
			this.oIbaseModel.setProperty("/iBaseUrl", false);

			var oNewPosListModel = sap.ui.getCore().getModel(serviceCaseCreation.constants.ibaseNewPosListModel);
			var oChamberSetModel = sap.ui.getCore().getModel(serviceCaseCreation.constants.ibaseChamberSetModel);
			var oIbaseDropdownModel = sap.ui.getCore().getModel(serviceCaseCreation.constants.ibaseDropDownModel);

			if (oNewPosListModel) {
				this._newAssemblyDialog.setModel(oNewPosListModel, serviceCaseCreation.constants.ibaseNewPosListModel);
			}
			if (oChamberSetModel) {
				this._newAssemblyDialog.setModel(oChamberSetModel, serviceCaseCreation.constants.ibaseChamberSetModel);
				if (!this.oIbaseModel.getProperty("/newAssemblyPanel")) {
					this._newAssemblyDialog.setBusy(false);
				}

			}
			if (oIbaseDropdownModel) {
				this._newAssemblyDialog.setModel(oIbaseDropdownModel, serviceCaseCreation.constants.ibaseDropDownModel);
				this._newAssemblyDialog.setBusy(false);
			}
		},

		/**
		 * This method is for Success service call of onPressSuggestionButton.
		 * @name handleIbaseAssemblyPositionFail
		 * @param oData
		 * @returns
		 */
		handleIbaseAssemblyPositionFail: function(oData) {
			this.oIbaseModel.setProperty("/iBaseUrl", false);

			var message = oData.getParameter('d').ErrorMessage;
			MessageBox.error(message);
			this._newAssemblyDialog.setBusy(false);
		},
		/**
		 * This method will open the Assembly Fragment.
		 * @name _openAssemblyDialog
		 */
		_openAssemblyDialog: function() {
			if (this._newAssemblyDialog === null || typeof this._newAssemblyDialog === undefined || this._newAssemblyDialog === undefined) {
				this._newAssemblyDialog = sap.ui.xmlfragment(serviceCaseCreation.constants.FragmentAddNewAssembly, this);
			}

			this.getView().addDependent(this._newAssemblyDialog);
			this._newAssemblyDialog.open();
			this._newAssemblyDialog.setBusy(true);
			this.oMsgBar = sap.ui.getCore().byId(serviceCaseCreation.Ids.IBASE_POS_MSG_STRIP);
			this.oMsgBar.setVisible(false);

		},

		/**
		 * This method will close the error message in position popup.
		 * @name onCloseMsgBar
		 */
		onCloseMsgBar: function() {
			this.oMsgBar.setVisible(false);
		},

		/**
		 * This method will cancel the inputs for Ibase.
		 * @name onPressSuggestionCancelButton
		 * @param {Object} oEvent - event handler object
		 */
		onPressSuggestionCancelButton: function(oEvent) {
			var cust = oEvent.getSource().data("buttonCancelCust");
			oView = this.getView();
			this.oIbaseModel = this.getOwnerComponent().getModel(serviceCaseCreation.constants.IBaseModel);
			if (cust) {
				oView.byId(serviceCaseCreation.Ids.IBASE_INP_CUSTTOOLID).setValueState(this.resourceBundle.getText("IBase.None"));
				oView.byId(serviceCaseCreation.Ids.IBASE_INP_CUSTTOOLID).setValue("");
				this.oIbaseModel.setProperty("/custSuggest", false);
				this.oIbaseModel.setProperty("/custSuggestBtn", true);
			}

		},

		/**
		 * This method will Save the Ibase inputs to Backend.
		 * @name onPressSuggestionSaveButton
		 * @param {Object} oEvent - event handler object
		 */
		onPressSuggestionSaveButton: function(oEvent) {
			var cust = oEvent.getSource().data("buttonSaveCust");
			oView = this.getView();
			if (cust) {
				this.oIbaseModel.setProperty("/iBaseUrl", true);
				var oServiceCaseModel = sap.ui.getCore().getModel(serviceCaseCreation.constants.ccServiceCaseCreateModel);
				var sEquipment = oServiceCaseModel.getData().d.results[0].Equipment;
				var sSerial = oServiceCaseModel.getData().d.results[0].Serialnumber;
				var sFab = oServiceCaseModel.getData().d.results[0].Fabid;
				var sNewCustToolId = oView.byId(serviceCaseCreation.Ids.IBASE_INP_CUSTTOOLID).getValue();
				var sOldCustToolId = oView.byId(serviceCaseCreation.Ids.CREATE_CUSTOMER_TOOLID).getValue();
				var payload = {
					"ToolId": sEquipment,
					"FunctionalLocation": sFab,
					"IvRequestor": "",
					"SerialNumber": sSerial,
					"MaterialNumber": "",
					"EvError": "",
					"EvMessage": "",
					"Nav_UpdCustomerToolIDSet": [{
						"AssemblyNumber": "",
						"FieldName": serviceCaseCreation.constants.CustToolId,
						"FieldOldValue": sOldCustToolId,
						"FieldNewValue": sNewCustToolId
					}]
				};
				if (sNewCustToolId) {
					oView.byId(serviceCaseCreation.Ids.IBASE_INP_CUSTTOOLID).setValueState(this.resourceBundle.getText("IBase.None"));
					oView.byId(serviceCaseCreation.Ids.IBASE_INP_CUSTTOOLID).setBusy(true);

					this.finishoDataModelregistartionProcessWithParams(
						serviceCaseCreation.util.EventTriggers.IBASE_CUSTTOOLID_UPDATE_SUCCESS,
						"handleIbaseCustToolUpdateSuccess",
						serviceCaseCreation.util.EventTriggers.IBASE_CUSTTOOLID_UPDATE_FAIL,
						"handleIbaseCustToolUpdateFail",
						serviceCaseCreation.util.ServiceConfigConstants.updateCustToolId,
						serviceCaseCreation.util.ServiceConfigConstants.post,
						payload, "", "",
						serviceCaseCreation.util.EventTriggers.TRIGGER_IBASE_CUSTTOOLID_UPDATE
					);

				} else {
					oView.byId(serviceCaseCreation.Ids.IBASE_INP_CUSTTOOLID).setValueState(this.resourceBundle.getText("IBase.Error"));
				}
			}
		},

		/**
		 * This method is for Success service call of onPressSuggestionSaveButton or.
		 * @name handleIbaseCustToolUpdateSuccess
		 * @param oData
		 * @returns
		 */
		handleIbaseCustToolUpdateSuccess: function(oData) {
			var oView = this.getView();
			this.oIbaseModel.setProperty("/iBaseUrl", false);

			var sError = (oData.getParameter("d").EvError === "X" ? true : false);
			var sMessage = oData.getParameter("d").EvMessage;
			oView.byId(serviceCaseCreation.Ids.IBASE_INP_CUSTTOOLID).setBusy(false);

			if (sError) {
				oView.byId(serviceCaseCreation.Ids.IBASE_INP_CUSTTOOLID).setValueState(this.resourceBundle.getText("IBase.Error"));
				MessageBox.error(sMessage);
			} else {
				MessageBox.success(sMessage);
				oView.byId(serviceCaseCreation.Ids.IBASE_INP_CUSTTOOLID).setValue("");
				this.oIbaseModel.setProperty("/custSuggest", false);
				this.oIbaseModel.setProperty("/custSuggestBtn", true);
			}
		},

		/**
		 * This method is for Failure service call of onPressSuggestionSaveButton.
		 * @name handleIbaseCustToolUpdateFail
		 * @param oData
		 * @returns
		 */
		handleIbaseCustToolUpdateFail: function(oData) {

			var oView = this.getView();
			this.oIbaseModel.setProperty("/iBaseUrl", false);
			oView.byId(serviceCaseCreation.Ids.IBASE_INP_CUSTTOOLID).setBusy(false);

			var sMessage = oData.getParameter("d").ErrorMessage;
			MessageBox.error(sMessage);
		},

		/**
		 * This method will close the New Assembly Fragment.
		 * @name onNewAssemblyDialogClose
		 */
		onNewAssemblyDialogClose: function() {
			this._newAssemblyDialog.close();
		},

		/**
		 * This method will allow the user to change chamber positions.
		 * @name onDialogChangePosition
		 */
		onDialogChangePosition: function() {
			this.oIbaseModel.setProperty("/newPositionColumn", true);
			sap.ui.getCore().byId(serviceCaseCreation.Ids.IBASE_DLGBTN_POSCHG).setVisible(false);
			sap.ui.getCore().byId(serviceCaseCreation.Ids.IBASE_DLGBTN_POSCHG_CANCEL).setVisible(true);

		},
		/**
		 * This method will cancel the position change scenario.
		 * @name onDialogChangePositionCancel
		 */
		onDialogChangePositionCancel: function() {
			this.oIbaseModel.setProperty("/newPositionColumn", false);
			sap.ui.getCore().byId(serviceCaseCreation.Ids.IBASE_DLGBTN_POSCHG).setVisible(true);
			sap.ui.getCore().byId(serviceCaseCreation.Ids.IBASE_DLGBTN_POSCHG_CANCEL).setVisible(false);

			var oChamberSetModel = sap.ui.getCore().getModel(serviceCaseCreation.constants.ibaseChamberSetModel),
				oLocalData = oChamberSetModel.getData().d.results;
			jQuery.each(oLocalData, function(i, oItem) {
				oItem.NewPos = "";
			});

			var data = {
				d: {
					results: oLocalData
				}
			};
			oChamberSetModel.setData(data);
		},

		/**
		 * This method will submit the New Assembly details/ chamber position change request to ibase.
		 * @name onNewAssemblyDialogSubmit
		 */
		onNewAssemblyDialogSubmit: function() {
			this.onCloseMsgBar();
			var oChamberSetModel = sap.ui.getCore().getModel(serviceCaseCreation.constants.ibaseChamberSetModel),
				oLocalData = oChamberSetModel.getData().d.results,
				oServiceCaseModel = sap.ui.getCore().getModel(serviceCaseCreation.constants.ccServiceCaseCreateModel),
				sEquipment = oServiceCaseModel.getData().d.results[0].Equipment,
				sFab = oServiceCaseModel.getData().d.results[0].Fabid,
				sSerial = oServiceCaseModel.getData().d.results[0].Serialnumber,
				oAsmblPosSet = [],
				isNewAssembly = this.oIbaseModel.getProperty("/newAssemblyPanel");

			var aTestPos = [];
			var iCount = 0;

			jQuery.each(oLocalData, function(i, oItem) {
				if (oItem.NewPos) {
					aTestPos.push(oItem.NewPos);
					iCount++;
				} else {
					aTestPos.push(oItem.Heqnr);
				}

				var oItemDetail = {
					"AssemblyNumber": oItem.Equnr,
					"FieldName": serviceCaseCreation.constants.Posnr,
					"FieldOldValue": oItem.Heqnr,
					"FieldNewValue": oItem.NewPos
				};
				oAsmblPosSet.push(oItemDetail);
			});

			if (isNewAssembly) {
				var sObjectType = sap.ui.getCore().byId(serviceCaseCreation.Ids.IBASE_SEL_OBJECTTYPE).getSelectedKey();
				var bCombo = this.setValueStateForKeyElementsWithIDs([serviceCaseCreation.Ids.IBASE_SEL_OBJECTTYPE]);
				if (bCombo) {
					this.oMsgBar.setText(this.resourceBundle.getText("IBase.ObjectTypeValidationMsg"));
					this.oMsgBar.setType(this.resourceBundle.getText("IBase.Error"));
					this.oMsgBar.setVisible(true);
					return;
				}

				switch (sObjectType) {

					case serviceCaseCreation.constants.ObjTypeChamber:
						var sGotCode = sap.ui.getCore().byId(serviceCaseCreation.Ids.IBASE_INP_GOTCODE).getValue(),
							sGotCodeDesc = sap.ui.getCore().byId(serviceCaseCreation.Ids.IBASE_INP_GOTCODEDESC).getValue(),
							sPosition = sap.ui.getCore().byId(serviceCaseCreation.Ids.IBASE_SEL_POSITION).getSelectedKey();

						bCombo = this.setValueStateForKeyElementsWithIDs([serviceCaseCreation.Ids.IBASE_SEL_POSITION]);
						var bInput = this.setValueStateForInputElementsWithIDs([serviceCaseCreation.Ids.IBASE_INP_GOTCODE]);

						if (bInput || bCombo) {
							this.oMsgBar.setText(this.resourceBundle.getText("IBase.MandatoryFieldValidationMsg"));
							this.oMsgBar.setType(this.resourceBundle.getText("IBase.Error"));
							this.oMsgBar.setVisible(true);
							return;
						} else {
							aTestPos.push(sPosition);
						}

						var oPayload = {
							"ToolId": sEquipment,
							"SerialNumber": sSerial,
							"FunctionalLocation": sFab,
							"MaterialNumber": "",
							"Eqart": sObjectType,
							"EvError": "",
							"IvRequestor": "",
							"EvMessage": "",
							"Nav_Add_Asmbl_DetailsSet": [{
								"CharName": serviceCaseCreation.constants.Posnr,
								"CharValue": sPosition
							}, {
								"CharName": serviceCaseCreation.constants.GotCode,
								"CharValue": sGotCode
							}, {
								"CharName": serviceCaseCreation.constants.GotCodeDesc,
								"CharValue": sGotCodeDesc
							}],
							"IB_ChangeDetailsSet": oAsmblPosSet
						};
						break;

					case serviceCaseCreation.constants.ObjTypeCleaner:
						var sCleanerType = sap.ui.getCore().byId(serviceCaseCreation.Ids.IBASE_CMB_CLEANERTYPE).getSelectedKey();
						bCombo = this.setValueStateForKeyElementsWithIDs([serviceCaseCreation.Ids.IBASE_CMB_CLEANERTYPE]);
						if (bCombo) {
							this.oMsgBar.setText(this.resourceBundle.getText("IBase.MandatoryFieldValidationMsg"));
							this.oMsgBar.setType(this.resourceBundle.getText("IBase.Error"));
							this.oMsgBar.setVisible(true);
							return;
						}
						oPayload = {
							"ToolId": sEquipment,
							"SerialNumber": sSerial,
							"FunctionalLocation": sFab,
							"MaterialNumber": "",
							"Eqart": sObjectType,
							"EvError": "",
							"IvRequestor": "",
							"EvMessage": "",
							"Nav_Add_Asmbl_DetailsSet": [{
								"CharName": serviceCaseCreation.constants.CleanerType,
								"CharValue": sCleanerType
							}],
							"IB_ChangeDetailsSet": oAsmblPosSet
						};

						break;

					case serviceCaseCreation.constants.ObjTypePolisher:
						var sPolishingHead = sap.ui.getCore().byId(serviceCaseCreation.Ids.IBASE_CMB_POLISHINGHEAD).getSelectedKey(),
							sPlaten1 = sap.ui.getCore().byId(serviceCaseCreation.Ids.IBASE_CMB_PLATEN1INSITUMETROLOGY).getSelectedKey(),
							sPlaten2 = sap.ui.getCore().byId(serviceCaseCreation.Ids.IBASE_CMB_PLATEN2INSITUMETROLOGY).getSelectedKey(),
							sPlaten3 = sap.ui.getCore().byId(serviceCaseCreation.Ids.IBASE_CMB_PLATEN3INSITUMETROLOGY).getSelectedKey(),
							sPlaten1Pad = sap.ui.getCore().byId(serviceCaseCreation.Ids.IBASE_CMB_PLATEN1PAD).getSelectedKey(),
							sPlaten2Pad = sap.ui.getCore().byId(serviceCaseCreation.Ids.IBASE_CMB_PLATEN2PAD).getSelectedKey(),
							sPlaten3Pad = sap.ui.getCore().byId(serviceCaseCreation.Ids.IBASE_CMB_PLATEN3PAD).getSelectedKey();

						bCombo = this.setValueStateForKeyElementsWithIDs([serviceCaseCreation.Ids.IBASE_CMB_POLISHINGHEAD]);
						if (bCombo) {
							this.oMsgBar.setText(this.resourceBundle.getText("IBase.MandatoryFieldValidationMsg"));
							this.oMsgBar.setType(this.resourceBundle.getText("IBase.Error"));
							this.oMsgBar.setVisible(true);
							return;
						}

						oPayload = {
							"ToolId": sEquipment,
							"SerialNumber": sSerial,
							"FunctionalLocation": sFab,
							"MaterialNumber": "",
							"Eqart": sObjectType,
							"EvError": "",
							"IvRequestor": "",
							"EvMessage": "",
							"Nav_Add_Asmbl_DetailsSet": [{
								"CharName": serviceCaseCreation.constants.PolishingHead,
								"CharValue": sPolishingHead
							}, {
								"CharName": serviceCaseCreation.constants.Platen1Pad,
								"CharValue": sPlaten1Pad
							}, {
								"CharName": serviceCaseCreation.constants.Platen2Pad,
								"CharValue": sPlaten2Pad
							}, {
								"CharName": serviceCaseCreation.constants.Platen3Pad,
								"CharValue": sPlaten3Pad
							}, {
								"CharName": serviceCaseCreation.constants.Platen1Insitumetrology,
								"CharValue": sPlaten1
							}, {
								"CharName": serviceCaseCreation.constants.Platen2Insitumetrology,
								"CharValue": sPlaten2
							}, {
								"CharName": serviceCaseCreation.constants.Platen3Insitumetrology,
								"CharValue": sPlaten3
							}],
							"IB_ChangeDetailsSet": oAsmblPosSet
						};
						break;

					case serviceCaseCreation.constants.ObjTypeMetrology:
						var sInlineMetrology = sap.ui.getCore().byId(serviceCaseCreation.Ids.IBASE_CMB_INLINEMETROLOGY).getSelectedKey(),
							sPlaten1 = sap.ui.getCore().byId(serviceCaseCreation.Ids.IBASE_CMB_PLATEN1INSITUMETROLOGY).getSelectedKey(),
							sPlaten2 = sap.ui.getCore().byId(serviceCaseCreation.Ids.IBASE_CMB_PLATEN2INSITUMETROLOGY).getSelectedKey(),
							sPlaten3 = sap.ui.getCore().byId(serviceCaseCreation.Ids.IBASE_CMB_PLATEN3INSITUMETROLOGY).getSelectedKey();

						oPayload = {
							"ToolId": sEquipment,
							"SerialNumber": sSerial,
							"FunctionalLocation": sFab,
							"MaterialNumber": "",
							"Eqart": sObjectType,
							"EvError": "",
							"IvRequestor": "",
							"EvMessage": "",
							"Nav_Add_Asmbl_DetailsSet": [{
								"CharName": serviceCaseCreation.constants.InlineMetrology,
								"CharValue": sInlineMetrology
							}, {
								"CharName": serviceCaseCreation.constants.Platen1Insitumetrology,
								"CharValue": sPlaten1
							}, {
								"CharName": serviceCaseCreation.constants.Platen2Insitumetrology,
								"CharValue": sPlaten2
							}, {
								"CharName": serviceCaseCreation.constants.Platen3Insitumetrology,
								"CharValue": sPlaten3
							}],
							"IB_ChangeDetailsSet": oAsmblPosSet
						};
						break;

					default:
						break;
				}

				var aDuplicate = this._checkPosDuplicacy(aTestPos);
				if (aDuplicate.length > 0) {
					if (this.oIbaseModel.getProperty("/newPositionColumn")) {
						this.oMsgBar.setText(this.resourceBundle.getText("IBase.LblPosition") + " " + aDuplicate[0] + " " + this.resourceBundle.getText(
							"IBase.PosOccupiedMsg"));
					} else {
						this.oMsgBar.setText(this.resourceBundle.getText("IBase.LblPosition") + " " + aDuplicate[0] + " " + this.resourceBundle.getText(
							"IBase.PosOccupiedMsg"));
						sap.ui.getCore().byId(serviceCaseCreation.Ids.IBASE_SEL_POSITION).setValueState(sap.ui.core.ValueState.Error);
					}
					this.oMsgBar.setType(this.resourceBundle.getText("IBase.Error"));
					this.oMsgBar.setVisible(true);
					return;
				}

				this.oIbaseModel.setProperty("/iBaseUrl", true);
				this._newAssemblyDialog.setBusy(true);
				this.finishoDataModelregistartionProcessWithParams(
					serviceCaseCreation.util.EventTriggers.IBASE_POSITION_UPDATE_SUCCESS,
					"handleIbasePositionUpdateSuccess",
					serviceCaseCreation.util.EventTriggers.IBASE_POSITION_UPDATE_FAIL,
					"handleIbasePositionUpdateFail",
					serviceCaseCreation.util.ServiceConfigConstants.addNewAssembly,
					serviceCaseCreation.util.ServiceConfigConstants.post,
					oPayload, "", "",
					serviceCaseCreation.util.EventTriggers.TRIGGER_IBASE_POSITION_UPDATE
				);

			} else {

				if (iCount === 0) {
					this.oMsgBar.setText(this.resourceBundle.getText("IBase.PosInputValidationMsg"));
					this.oMsgBar.setType(this.resourceBundle.getText("IBase.Error"));
					this.oMsgBar.setVisible(true);
					return;
				}

				var aDuplicate = this._checkPosDuplicacy(aTestPos);
				if (aDuplicate.length > 0) {
					this.oMsgBar.setText(this.resourceBundle.getText("IBase.LblPosition") + " " + aDuplicate[0] + " " + this.resourceBundle.getText(
						"IBase.DuplicatePosValidationMsg"));
					this.oMsgBar.setType(this.resourceBundle.getText("IBase.Error"));
					this.oMsgBar.setVisible(true);
					return;
				}

				var oPayload = {
					"ToolId": sEquipment,
					"FunctionalLocation": sFab,
					"SerialNumber": sSerial,
					"MaterialNumber": "",
					"EvError": "",
					"IvRequestor": "",
					"EvMessage": "",
					"Nav_UpdAsmblPosSet": oAsmblPosSet
				};

				this.oIbaseModel.setProperty("/iBaseUrl", true);
				this._newAssemblyDialog.setBusy(true);
				this.finishoDataModelregistartionProcessWithParams(
					serviceCaseCreation.util.EventTriggers.IBASE_POSITION_UPDATE_SUCCESS,
					"handleIbasePositionUpdateSuccess",
					serviceCaseCreation.util.EventTriggers.IBASE_POSITION_UPDATE_FAIL,
					"handleIbasePositionUpdateFail",
					serviceCaseCreation.util.ServiceConfigConstants.updateChamberPositionSet,
					serviceCaseCreation.util.ServiceConfigConstants.post,
					oPayload, "", "",
					serviceCaseCreation.util.EventTriggers.TRIGGER_IBASE_POSITION_UPDATE
				);
			}
		},

		/**
		 * This method is to check duplicacy in new Positions.
		 * @name _checkPosDuplicacy
		 * @param aTestPos
		 * @returns aDuplicate
		 */
		_checkPosDuplicacy: function(aTestPos) {
			var aDuplicate = [];
			jQuery.each(aTestPos, function(i, oItem) {
				for (var j = 0; j < aTestPos.length; j++) {
					if (i !== j) {
						if (oItem === aTestPos[j]) {
							aDuplicate.push(aTestPos[j]);
						}
					}
				}
			});
			return aDuplicate;

		},

		/**
		 * This method is for Success service call of onNewAssemblyDialogSubmit.
		 * @name handleIbasePositionUpdateSuccess
		 * @param oData
		 * @returns
		 */
		handleIbasePositionUpdateSuccess: function(oData) {
			var oView = this.getView(),
				that = this;
			this.oIbaseModel.setProperty("/iBaseUrl", false);

			var sError = (oData.getParameter("d").EvError === "X" ? true : false),
				sMessage = oData.getParameter("d").EvMessage;

			if (sError) {
				this._newAssemblyDialog.setBusy(false);
				this.oMsgBar.setText(sMessage);
				this.oMsgBar.setType(this.resourceBundle.getText("IBase.Error"));
				this.oMsgBar.setVisible(true);

			} else {

				this._getIbaseStructure(false);
				this.oMsgBar.setText(sMessage);
				this.oMsgBar.setType(this.resourceBundle.getText("IBase.Success"));
				this.oMsgBar.setVisible(true);
				if (this.oIbaseModel.getProperty("/newAssemblyPanel")) {
					sap.ui.getCore().byId(serviceCaseCreation.Ids.IBASE_SEL_OBJECTTYPE).setSelectedKey("");
					this.onObjectTypeChange();
				}

			}
		},

		/**
		 * This method is for Failure service call of onNewAssemblyDialogSubmit.
		 * @name handleIbasePositionUpdateFail
		 * @param oData
		 * @returns
		 */
		handleIbasePositionUpdateFail: function(oData) {

			var oView = this.getView();
			this.oIbaseModel.setProperty("/iBaseUrl", false);

			this._newAssemblyDialog.setBusy(false);
			var sMessage = oData.getParameter("d").ErrorMessage;
			MessageBox.error(sMessage);
		},

		/**
		 * This method is to reset the Ibase Model Properties.
		 * @name _resetIbaseModel
		 * @returns
		 */
		_resetIbaseModel: function() {
			var oIbaseModel = this.getOwnerComponent().getModel(serviceCaseCreation.constants.IBaseModel);
			oIbaseModel.setProperty("/iBaseUrl", false);
			oIbaseModel.setProperty("/iBaseValid", false);
			oIbaseModel.setProperty("/custSuggestBtn", false);
			oIbaseModel.setProperty("/custSuggest", false);
			oIbaseModel.setProperty("/assmSuggestBtn", false);
			oIbaseModel.setProperty("/posSuggestBtn", false);
			oIbaseModel.setProperty("/newPositionColumn", false);
			oIbaseModel.setProperty("/classChamber", false);

		},

		/**
		 * This method is to set Value State of the field.
		 * @name onIbComboBoxChange
		 * @param oEvent
		 * @returns
		 */
		onIbComboBoxChange: function(oEvent) {

			var sSelectedItem = oEvent.getSource().getProperty('selectedKey');
			if (sSelectedItem)
				oEvent.getSource().setValueState(serviceCaseCreation.constants.None);
		},

		/**
		 * This method is to hide/unhide the input fields based on object type selection.
		 * @name onObjectTypeChange
		 * @param oEvent
		 * @returns
		 */
		onObjectTypeChange: function(oEvent) {
			if (oEvent) {
				var sSelectedItem = oEvent.getSource().getProperty('selectedKey');
			} else {
				sSelectedItem = sap.ui.getCore().byId(serviceCaseCreation.Ids.IBASE_SEL_OBJECTTYPE).getSelectedKey();
			}
			var aInputIds = [
				serviceCaseCreation.Ids.IBASE_INP_GOTCODE,
				serviceCaseCreation.Ids.IBASE_INP_GOTCODEDESC
			];

			var aComboIds = [
				serviceCaseCreation.Ids.IBASE_CMB_CLEANERTYPE,
				serviceCaseCreation.Ids.IBASE_SEL_POSITION,
				serviceCaseCreation.Ids.IBASE_CMB_INLINEMETROLOGY,
				serviceCaseCreation.Ids.IBASE_CMB_PLATEN1INSITUMETROLOGY,
				serviceCaseCreation.Ids.IBASE_CMB_PLATEN2INSITUMETROLOGY,
				serviceCaseCreation.Ids.IBASE_CMB_PLATEN3INSITUMETROLOGY,
				serviceCaseCreation.Ids.IBASE_CMB_POLISHINGHEAD,
				serviceCaseCreation.Ids.IBASE_CMB_PLATEN1PAD,
				serviceCaseCreation.Ids.IBASE_CMB_PLATEN2PAD,
				serviceCaseCreation.Ids.IBASE_CMB_PLATEN3PAD
			];

			this._resetElementsWithIDs(aInputIds);
			this._resetKeyValueswithIds(aComboIds);

			switch (sSelectedItem) {
				case serviceCaseCreation.constants.ObjTypeChamber:
					this.oIbaseModel.setProperty("/classChamber", true);
					this.oIbaseModel.setProperty("/classCleaner", false);
					this.oIbaseModel.setProperty("/classMetrology", false);
					this.oIbaseModel.setProperty("/classPolisher", false);
					this.setValueStateForKeyElementsWithIDs([serviceCaseCreation.Ids.IBASE_SEL_OBJECTTYPE]);

					break;

				case serviceCaseCreation.constants.ObjTypeCleaner:
					this.oIbaseModel.setProperty("/classChamber", false);
					this.oIbaseModel.setProperty("/classCleaner", true);
					this.oIbaseModel.setProperty("/classMetrology", false);
					this.oIbaseModel.setProperty("/classPolisher", false);
					this.setValueStateForKeyElementsWithIDs([serviceCaseCreation.Ids.IBASE_SEL_OBJECTTYPE]);

					break;

				case serviceCaseCreation.constants.ObjTypeMetrology:
					this.oIbaseModel.setProperty("/classChamber", false);
					this.oIbaseModel.setProperty("/classCleaner", false);
					this.oIbaseModel.setProperty("/classMetrology", true);
					this.oIbaseModel.setProperty("/classPolisher", false);
					this.setValueStateForKeyElementsWithIDs([serviceCaseCreation.Ids.IBASE_SEL_OBJECTTYPE]);

					break;

				case serviceCaseCreation.constants.ObjTypePolisher:
					this.oIbaseModel.setProperty("/classChamber", false);
					this.oIbaseModel.setProperty("/classCleaner", false);
					this.oIbaseModel.setProperty("/classMetrology", false);
					this.oIbaseModel.setProperty("/classPolisher", true);
					this.setValueStateForKeyElementsWithIDs([serviceCaseCreation.Ids.IBASE_SEL_OBJECTTYPE]);

					break;

				default:
					this.oIbaseModel.setProperty("/classChamber", false);
					this.oIbaseModel.setProperty("/classCleaner", false);
					this.oIbaseModel.setProperty("/classMetrology", false);
					this.oIbaseModel.setProperty("/classPolisher", false);

					break;

			}

		},

		/**
		 * This method will clear the input of the fields.
		 * @name _resetElementsWithIDs
		 * @param [elements] array - aElementIDs
		 * @returns
		 */
		_resetElementsWithIDs: function(aElementIDs) {
			for (var elementID in aElementIDs) {
				sap.ui.getCore().byId(aElementIDs[elementID]).setValue("");
				sap.ui.getCore().byId(aElementIDs[elementID]).setValueState(sap.ui.core.ValueState.None);
			}
		},

		/**
		 * This method is to clear the selected key for the elements.
		 * @name _resetKeyValueswithIds
		 * @param [elements] array - aElementIDs
		 * @returns
		 */
		_resetKeyValueswithIds: function(aElementIDs) {
			for (var elementID in aElementIDs) {
				sap.ui.getCore().byId(aElementIDs[elementID]).setSelectedKey("");
				sap.ui.getCore().byId(aElementIDs[elementID]).setValueState(sap.ui.core.ValueState.None);
			}
		},

		/**
		 * This method is to format Missing Assembly description in combobox.
		 * @name _formatMissingAssembly
		 * @param equiCombobox
		 * @returns
		 */
		_formatMissingAssembly: function(equiCombobox) {
			var oIbaseModel = this.getOwnerComponent().getModel(serviceCaseCreation.constants.IBaseModel);
			var bValid = oIbaseModel.getProperty("/iBaseValid");

			jQuery.each(equiCombobox.getList().getAggregation('items'), function(i, oItem) {
				if (oItem.getProperty('key') === serviceCaseCreation.constants.MA) {
					if (bValid) {
						oItem.setProperty('text', oItem.getProperty('text').slice(3));
					} else {
						equiCombobox.getModel().getData().d.results.splice(i, 1);
						this.getModel().refresh();
						equiCombobox.setSelectedKey("");
					}
				}

			});
		},

		/**
		 * This method is to open the Got Code Search Dialog.
		 * @name onGotCodeValueHelp
		 * @param oEvt- Current Event Parameter
		 * @returns
		 */
		onGotCodeValueHelp: function(oEvt) {
			if (this._gotCodeSearchDialog === null || typeof this._gotCodeSearchDialog === undefined || this._gotCodeSearchDialog === undefined) {
				this._gotCodeSearchDialog = sap.ui.xmlfragment(serviceCaseCreation.constants.FragmentGotCodeSearch, this);
			}

			this.getView().addDependent(this._gotCodeSearchDialog);
			this._gotCodeSearchDialog.open();
			sap.ui.getCore().byId(serviceCaseCreation.Ids.IBASE_GOTCODE_MSG_STRIP).setVisible(false);
			sap.ui.getCore().byId(serviceCaseCreation.Ids.IBASE_DLG_SEARCHFIELD).setValue("");
			if (sap.ui.getCore().getModel(serviceCaseCreation.constants.ibaseGotCodeModel)) {
				sap.ui.getCore().getModel(serviceCaseCreation.constants.ibaseGotCodeModel).setData(null);
			}

		},

		/**
		 * This method is to search the got code.
		 * @name onGotCodeSearch
		 * @param oEvent- Current Event Parameter
		 * @returns
		 */
		onGotCodeSearch: function(oEvent) {
			sap.ui.getCore().byId(serviceCaseCreation.Ids.IBASE_GOTCODE_MSG_STRIP).setVisible(false);
			var sInput = oEvent.getParameter("query").trim().replace(/ /g, "%20");
			if (sInput === "") {
				sap.ui.getCore().getModel(serviceCaseCreation.constants.ibaseGotCodeModel).setData(null);
				return;
			}
			this.oIbaseModel.setProperty("/iBaseUrl", true);
			this._gotCodeSearchDialog.setBusy(true);
			var aEntitySet = serviceCaseCreation.util.ServiceConfigConstants.gotCodeListSet + "?$filter=IvSearchTerm%20eq%20%27" + sInput +
				"%27";
			this.finishoDataModelregistartionProcessWithParams(
				serviceCaseCreation.util.EventTriggers.IBASE_GOTCODE_READ_SUCCESS,
				"handleIbaseGotCodeReadSuccess",
				serviceCaseCreation.util.EventTriggers.IBASE_GOTCODE_READ_FAIL,
				"handleIbaseGotCodeReadFail",
				aEntitySet,
				serviceCaseCreation.util.ServiceConfigConstants.get,
				"", "", "",
				serviceCaseCreation.util.EventTriggers.TRIGGER_IBASE_GOTCODE_READ
			);
		},

		/**
		 * This method is for Success service call of onGotCodeSearch.
		 * @name handleIbaseGotCodeReadSuccess
		 * @param oData
		 * @returns
		 */
		handleIbaseGotCodeReadSuccess: function(oData) {
			this.oIbaseModel.setProperty("/iBaseUrl", false);

			var oGotCodeListModel = sap.ui.getCore().getModel(serviceCaseCreation.constants.ibaseGotCodeModel);
			var iLength = oGotCodeListModel.getData().d.results.length;
			this._gotCodeSearchDialog.setModel(oGotCodeListModel, serviceCaseCreation.constants.ibaseGotCodeModel);
			if (iLength === 0) {
				sap.ui.getCore().byId(serviceCaseCreation.Ids.IBASE_GOTCODE_MSG_STRIP).setText(this.resourceBundle.getText("IBase.NoRecordsFound"));
				sap.ui.getCore().byId(serviceCaseCreation.Ids.IBASE_GOTCODE_MSG_STRIP).setType(this.resourceBundle.getText("IBase.Warning"));
			} else {
				sap.ui.getCore().byId(serviceCaseCreation.Ids.IBASE_GOTCODE_MSG_STRIP).setText(iLength + " " + this.resourceBundle.getText(
					"IBase.RecordsFound"));
				sap.ui.getCore().byId(serviceCaseCreation.Ids.IBASE_GOTCODE_MSG_STRIP).setType(this.resourceBundle.getText("IBase.Success"));
			}
			sap.ui.getCore().byId(serviceCaseCreation.Ids.IBASE_GOTCODE_MSG_STRIP).setVisible(true);
			this._gotCodeSearchDialog.setBusy(false);
		},

		/**
		 * This method is for Failure service call of onGotCodeSearch.
		 * @name handleIbaseGotCodeReadFail
		 * @param oData
		 * @returns
		 */
		handleIbaseGotCodeReadFail: function(oData) {
			this.oIbaseModel.setProperty("/iBaseUrl", false);

			var message = oData.getParameter('d').ErrorMessage;
			sap.ui.getCore().byId(serviceCaseCreation.Ids.IBASE_GOTCODE_MSG_STRIP).setText(message);
			sap.ui.getCore().byId(serviceCaseCreation.Ids.IBASE_GOTCODE_MSG_STRIP).setType(this.resourceBundle.getText("IBase.Error"));
			sap.ui.getCore().byId(serviceCaseCreation.Ids.IBASE_GOTCODE_MSG_STRIP).setVisible(true);
			this._gotCodeSearchDialog.setBusy(false);
		},

		/**
		 * This method triggers when user select any got code from the list.
		 * @name onGotCodeSelect
		 * @param oEvent- Current Event Parameter
		 * @returns
		 */
		onGotCodeSelect: function(oEvent) {
			var sPath = oEvent.getSource().getSelectedItem().getBindingContextPath();
			var oObject = sap.ui.getCore().getModel(serviceCaseCreation.constants.ibaseGotCodeModel).getObject(sPath);
			sap.ui.getCore().byId(serviceCaseCreation.Ids.IBASE_INP_GOTCODEDESC).setValue(oObject.GotCodeDesc);
			sap.ui.getCore().byId(serviceCaseCreation.Ids.IBASE_INP_GOTCODE).setValue(oObject.GotCode);
			sap.ui.getCore().byId(serviceCaseCreation.Ids.IBASE_INP_GOTCODE).setValueState(sap.ui.core.ValueState.None);
			this._gotCodeSearchDialog.close();
		},

		/**
		 * This method is to close the Got Code Search Dilaog.
		 * @name onGotCodeSearchDialogClose
		 * @param
		 * @returns
		 */
		onGotCodeSearchDialogClose: function() {
			this._gotCodeSearchDialog.close();
		},

		/* End of IBASE PCR031702++ */
		
		/* Begin of  PCR034663++ */
		
		/**
		 * This method validates the opportunity no
		 * @name onCustPoValidation
		 * @param
		 * @returns
		 */
		onCustPoValidation: function() {
			var mandatoryCheck = this.onMandatoryFieldCheck("Create");
			var isMandatoryFieldCheckSuccess = mandatoryCheck[0];
			var isMandatoryInputFieldCheckSuccess = mandatoryCheck[1];
			var view = this.getView();
			var oDateCheck = view.byId(serviceCaseCreation.Ids.START_DATE_DATEPICKER).fireChange({
				value: view.byId(serviceCaseCreation.Ids.START_DATE_DATEPICKER).getValue()
			});

			
			var oMalFuncDateCheck = view.byId(serviceCaseCreation.Ids.C_MALFUNCSTRTDT_DTPKR).fireChange({
				value: view.byId(serviceCaseCreation.Ids.C_MALFUNCSTRTDT_DTPKR).getValue()
			});

			var bValidDates = true;
			if (this.ServiceType.Servicetype == "ZCMO") {
				bValidDates = (oMalFuncDateCheck.getValueState() === "None" && oDateCheck.getValueState() === "None") ? true : false;
			} else {
				bValidDates = (oDateCheck.getValueState() === "None") ? true : false;
			}
			
			var bValidAssembly = (view.byId(serviceCaseCreation.Ids.COMBOBOX_EQUIPMENT).getSelectedKey() != "") ? true : false;
			if (!bValidAssembly) {
				view.byId(serviceCaseCreation.Ids.COMBOBOX_EQUIPMENT).setValueState(sap.ui.core.ValueState.Error);
			}
			

			if (isMandatoryFieldCheckSuccess[0]) {				
				if (isMandatoryInputFieldCheckSuccess && bValidDates && bValidAssembly) {
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
							that.getView().byId(serviceCaseCreation.Ids.INPUT_CUSTPO).setValueState("Error");
							MessageBox.error(result.EvError);
							} else {
								that.getView().byId(serviceCaseCreation.Ids.INPUT_CUSTPO).setValueState("None");
								that.onCreate();
							}
						};
						if(that.getView().byId(serviceCaseCreation.Ids.INPUT_CUSTPO).getValue())
							oDataModel.read("/" + "OppotunityValidationSet('"+that.getView().byId(serviceCaseCreation.Ids.INPUT_CUSTPO).getValue().trim()+"')", { success: CustPosuccess});
						else
							this.onMandatoryFieldCheck("Create");
					} else {
						this.onCreate();
					}
				}
			}
			else {
				var msgToastField = this.resourceBundle.getText("CreateServiceCase.messageToasField");
				MessageToast.show(msgToastField);
			}
			
		},
		
		/**
		 * This method calls when NSO got changed
		 * @name onNsochange
		 * @param oEvent- Current Event Parameter
		 * @returns
		 */		
		onNsochange: function(evt) {
			this.getView().byId(serviceCaseCreation.Ids.INPUT_CUSTPO).setValue("");
			if(this.getView().byId(serviceCaseCreation.Ids.NSO_CMBX).getSelectedKey() === "YES") {
				this.showElementsWithIDs([serviceCaseCreation.Ids.INPUT_CUSTPO_FLEX]);
				this.getView().byId(serviceCaseCreation.Ids.OPPNO_LBL).addStyleClass("asteriskCC");
				this.getView().byId(serviceCaseCreation.Ids.INPUT_CUSTPO).setMaxLength(10);				
				this.getView().byId(serviceCaseCreation.Ids.OPPNO_LBL).setText(this.resourceBundle.getText("CreateServiceCase.OpportunityNo"));
			} else {
				if(this.bnsoFlg && this.getView().byId(serviceCaseCreation.Ids.COMBOBOX_CIDCATEGORIZATION).getSelectedKey() !==	"08" && this.getView().byId(serviceCaseCreation.Ids.COMBOBOX_CIDCATEGORIZATION).getSelectedKey() !==	"02")
				this.hideElementsWithIDs([serviceCaseCreation.Ids.INPUT_CUSTPO_FLEX]);
				this.getView().byId(serviceCaseCreation.Ids.OPPNO_LBL).removeStyleClass("asteriskCC");
				this.getView().byId(serviceCaseCreation.Ids.INPUT_CUSTPO).setMaxLength(0);
				this.getView().byId(serviceCaseCreation.Ids.OPPNO_LBL).setText(this.resourceBundle.getText("CreateServiceCase.Project/OpportunityNo"));
			}
			
			if(this.getView().byId(serviceCaseCreation.Ids.NSO_CMBX).getSelectedKey()  !== "YES") {
				if(this.bnsoFlg && this.getView().byId(serviceCaseCreation.Ids.COMBOBOX_CIDCATEGORIZATION).getSelectedKey() !==	"08" && this.getView().byId(serviceCaseCreation.Ids.COMBOBOX_CIDCATEGORIZATION).getSelectedKey() !==	"02")
					this.hideElementsWithIDs([serviceCaseCreation.Ids.INPUT_CUSTPO_FLEX]);
				this.getView().byId(serviceCaseCreation.Ids.NSO_CMBX).setValueState("None");
				this.getView().byId(serviceCaseCreation.Ids.INPUT_CUSTPO).setValueState("None");
				this.getView().byId(serviceCaseCreation.Ids.OPPNO_LBL).setText(this.resourceBundle.getText("CreateServiceCase.Project/OpportunityNo"));
			}		
		}
		
		/* End of  PCR034663++ */

	});

	return serviceCaseCreateController;

});