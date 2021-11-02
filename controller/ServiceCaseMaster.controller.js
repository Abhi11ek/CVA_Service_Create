/**
 * This class holds methods for Service Case Master.
 *
 * @class
 * @public
 * @author Siva Prasad Paruchuri
 * @since 13 November 2016
 * @extends sap.ui.core.mvc.Controller
 * @name serviceCaseCreation.controller.ServiceCaseMaster
 ** ------------------------------------------------------------------------------------*
 * Modifications.                                                                       *
 * -------------                                                                        *
 * Ver.No    Date        Author  	  PCR No.           Description of change           *
 * ------ ---------- --------------- ----------  ---------------------------------------*
 * V00    13/10/2016   Siva Prasad														*
 *          		  Prachuri/Alok   PCR012146    initial version						*
 *                     (X087050)                                                        *
 *                                                                                      *
 * V01    14/07/2017  Vimal Pandu     PCR015574    Cross App Navigation Changes 		*
 *                     (X087924)														*
 * V02    08/11/2017    X087924       PCRXXXXXX    Timeout Error Handling				*
 * V03    10/11/2017    X087924       PCR016459    Persistent Filters and Sort  		*
 * V04    30/11/2017    X087924       PCR016664    Removing busy dialog for initial		*
 *                          					   Service Call 						*
 ****************************************************************************************
 ****************************************************************************************
 *  Date        Author  		PCR No.     	Description of change           		*
 ************	********  		**********  	*****************************************
 * 02/13/2018   X087924 		PCR017437   	Technology and PBG changes and      	*
 *                  							Category fields data bindings			*
 * 04/02/2018   X087924 		PCR018322   	Service Cases reset change to refresh	*
 *                      						Category fields data bindings 			*
 * 08/02/2018   X087924 		PCR018422   	Pass Down Notes and Attachment Tabs 	*
 *												changes									*
 * 08/31/2020   X0108534		PCR030996   	ARK URL						    		*
 * 12/01/2020   Vimal Pandu		PCR032539   	PSE Sprint 10 changes		    		*
 * 03/08/2021   Vimal Pandu		PCR034266   	PSE Creation app bug fix	    		*
 ****************************************************************************************/
 
sap.ui.define([
	'jquery.sap.global',
	'sap/m/MessageToast',
	'serviceCaseCreation/controller/BaseController',
	'sap/ui/model/Filter',
	'sap/ui/model/Sorter',
	'sap/ui/core/Control',
	'sap/ui/model/FilterOperator',
	'serviceCaseCreation/model/SvcCreateCoreModel'
], function(jQuery, MessageToast, Controller, Filter, Sorter, Control, oFilterOperator, SvcConfCreateModel) {

	var that;
	var serviceCaseMasterController = Controller.extend("serviceCaseCreation.controller.ServiceCaseMaster", {

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf serviceCaseCreation.controller.Login
		 */
		onInit: function() {
			/*Cross App Navigation
			 * PCR
			 * V01++*/

			var sComponentId = sap.ui.component(sap.ui.core.Component.getOwnerIdFor(this.getView()));
			if (sComponentId.getComponentData())
				this._sStartupParameters = sComponentId.getComponentData().startupParameters;

			/*--------*/

			this.bSortFlag = true;
			this.bRouteFlag = true;
			this.sSorter = "Servicecasenumber";
			this.sCustomerToolIdSorter = "Customertoolid";
			this.sServiceCaseType = "Servicetypedesc";
			this.sSerialNumber = "SerialNumber"
			that = this;
			that.aSearchFilter = [];
			that.aCategoryFilter = [];
			that.oFilter = [];

			/*PCR016664++ start*/
			var oServiceCasesList = this.getCurrentView().byId(serviceCaseCreation.Ids.MASTER_LIST);
			this._aAdvSearchFields = [
				serviceCaseCreation.Ids.TOOL_NUMBER_INPUT,
				serviceCaseCreation.Ids.SERIAL_NUMBER_INPUT,
				serviceCaseCreation.Ids.SERVICE_CASE_NUMBER_INPUT,
				serviceCaseCreation.Ids.EMPOLYEE_ID_INPUT,
				serviceCaseCreation.Ids.OPPORTUNITY_NUMER_INPUT,
				serviceCaseCreation.Ids.LEGACY_NUMBER_INPUT
			];
			this.toggleAvailability([serviceCaseCreation.Ids.SORT_BTN, serviceCaseCreation.Ids.FILTER_BTN,
				serviceCaseCreation.Ids.RESET_BTN, serviceCaseCreation.Ids.RESET_LIST_BTN
			], false);
			/*PCR016664++ end*/

			this.resourceBundle = this.getComponent().getModel("i18n").getResourceBundle();
			that.mGroupFunctions = {
				Customertoolid: function(oContext) {
					that.groupByProperty = true;
					var id = oContext.getProperty("Customertoolid");
					return {
						key: id,
						text: id
					};
				},

				Servicetypedesc: function(oContext) {
					that.groupByProperty = false;
					var id = oContext.getProperty("Servicetypedesc");
					return {
						key: id,
						text: id
					};
				}
			}
 
			var iCounter = 0;

			this.getCurrentView().addEventDelegate({
				onAfterShow: function() {
					if (!iCounter) {
						++iCounter;

						oServiceCasesList.setBusyIndicatorDelay(0); //PCR016664++
						oServiceCasesList.setBusy(true); //PCR016664++

						/*that._oBusyDialog = new sap.m.BusyDialog();
						that._oBusyDialog.setText(that.resourceBundle.getText("Dashboard.BusyDialogMsg"));
						that._oBusyDialog.open();*/

						//Removing date range code V01--
						/*this._oToday = serviceCaseCreation.formatter.formatter.dateFormatInPost(new Date());
						this._oPreviousDate = new Date();
						this._oPreviousDate.setDate(this._oPreviousDate.getDate() - 7);
						this._oPreviousDate = serviceCaseCreation.formatter.formatter.dateFormatInPost(this._oPreviousDate);*/

						this.oServiceCaseModel = new serviceCaseCreation.model.SvcCreateCoreModel(this);
						this.oServiceCaseModel.attachserviceCaseCreationEventWithEventName(serviceCaseCreation.util.EventTriggers.SERVICE_CASES_READ_SUCCESS,
							jQuery.proxy(this.handleServiceCaseFetchSuccess), this);
						this.oServiceCaseModel.addBatchOperation(serviceCaseCreation.util.ServiceConfigConstants.masterListSet, serviceCaseCreation.util
							.ServiceConfigConstants.get, "", "", "");
						this.oServiceCaseModel.attachserviceCaseCreationEventWithEventName(serviceCaseCreation.util.EventTriggers.SERVICE_CASES_READ_FAIL,
							jQuery.proxy(this.handleServiceCaseFetchError), this);
						//this.oServiceCaseModel.addBatchOperation(serviceCaseCreation.util.ServiceConfigConstants.SserviceCaseEntitySet+"&$filter=ToDate%20eq%20%27"+this._oToday+"%27%20and%20FromDate%20eq%20%27"+this._oPreviousDate+"%27",serviceCaseCreation.util.ServiceConfigConstants.get, "", "", ""); //V01--
						//this.oServiceCaseModel.addBatchOperation(serviceCaseCreation.util.ServiceConfigConstants.SserviceCaseEntitySet,serviceCaseCreation.util.ServiceConfigConstants.get, "", "", ""); //V01++
						/*Cross App Navigation
						 * PCR
						 * V01++*/

						if (this._sStartupParameters) {
							var sQuery = (this._sStartupParameters.hasOwnProperty("serviceOrder")) ? serviceCaseCreation.util.ServiceConfigConstants.SserviceCaseEntitySet +
								"&$filter=Servicecasenumber%20eq%20" + "%27" + this._sStartupParameters.serviceOrder[0] + "%27" : serviceCaseCreation.util.ServiceConfigConstants
								.SserviceCaseEntitySet;

							this.oServiceCaseModel.addBatchOperation(sQuery, serviceCaseCreation.util.ServiceConfigConstants.get, "", "", "");
						} else {
							this.oServiceCaseModel.addBatchOperation(serviceCaseCreation.util.ServiceConfigConstants.SserviceCaseEntitySet,
								serviceCaseCreation.util.ServiceConfigConstants.get, "", "", "");
						}
						/*Begin of PCR030996++*/
						this.oServiceCaseModel.addBatchOperation(serviceCaseCreation.util.ServiceConfigConstants.ArkUrlSet + "('')",
							serviceCaseCreation.util.ServiceConfigConstants.get, "", "", "");
						/*End of PCR030996++*/
						/*--------*/

						this.oServiceCaseModel.fireserviceCaseCreationEventWithEventName(serviceCaseCreation.util.EventTriggers.TRIGGER_SERVICE_CASES_READ);
					}
				}.bind(this)
			});

			/*PCR016459++ changes start*/
			serviceCaseCreation.util.Util.validateAndExecutePersistFilters.call(this, serviceCaseCreation.Ids.MASTER_LIST, "ServiceCases");
			/*PCR016459++ changes end*/

			//Start of PCR032539++ changes

			that._iCount = 0;

			sap.ui.getCore().getEventBus().subscribe("pseOrderCreate", "data", function(channel, event, oData) {
				that._fnValidatePseOrderCreation(oData.bOrderCreated);
			}, this);

			this._fnGetRoleAuth();

			//End of PCR032539++ changes

			sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(this._onAttachRouteMatched, this);
			// this.getRouter().attachBypassed(this.onBypassed, this); //V01++ //PCR032539--
		},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf serviceCaseCreation.controller.Main
		 */
		onExit: function() {
			sap.ui.getCore().setModel(null, "ccMasterListModel");
			sap.ui.getCore().setModel(null, "ccServiceCaseModel");
			sap.ui.getCore().setModel(null, "ccServiceOrderModel"); //PCR018322++
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		onNavToFLPHomeBtnPress: function() {
			var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
			oCrossAppNavigator.toExternal({
				target: {
					semanticObject: "#"
				}
			});
		},

		//Start of PCR032539-- changes

		/*V01++
		Cross App navigation changes*/

		/**
		 * This method to remove the selections of the
		 * service cases list if an invalid route is triggered.
		 * @name onBypassed
		 * @param
		 * @returns
		 */
		/*onBypassed: function() {
			this.getCurrentView().byId(serviceCaseCreation.Ids.MASTER_LIST).removeSelections(true);
		},*/

		/*-------------------*/

		//End of PCR032539-- changes

		/**
		 * This method is the success response of service call of serviceCaseList.
		 * @name handleServiceCaseFetchSuccess
		 * @param reponse data
		 * @returns
		 */
		handleServiceCaseFetchSuccess: function(odata) {
			if (sap.ui.getCore().getModel("ccServiceCaseModel") && sap.ui.getCore().getModel("ccMasterListModel")) {
				//this._fnDestroyBusyDialog(this); //PCR016664--
				this.getCurrentView().byId(serviceCaseCreation.Ids.MASTER_LIST).setBusy(false); //PCR016664++
				serviceCaseCreation.controller.BaseController.prototype.setGlobalComponentModel.call(this, "ccServiceCaseModel");
				serviceCaseCreation.controller.BaseController.prototype.setComponentModelToCurrentViewModel.call(this);

				//Start of PCR018422++ changes
				var oMasterListModel = this.getModelFromCore("ccMasterListModel");
				oMasterListModel.getData().aExeServEmpSrvOrd = [];
				oMasterListModel.getData().aPsdnLogSrvOrd = [];
				oMasterListModel.getData().aAttachmentsSrvOrd = [];
				//End of PCR018422++ changes

				/* V03
				 * PCR016459++
				 * Persistent Filters and Sorters changes start*/

				var oSettingsModel = sap.ui.getCore().getModel("SettingsModel");
				if (oSettingsModel) {
					if (this._sStartupParameters) {
						if (!oSettingsModel.getData().hasOwnProperty("ServiceCases") || this._sStartupParameters.serviceOrder)
							this._fnSelectFirstItem();
					} else {
						this._fnSelectFirstItem(); //PCR016664++
					}
				} else if (!oSettingsModel) {
					this._fnSelectFirstItem();
				}

				/*-------------------------------------------------*/
				//this._fnSelectFirstItem(); //PCR016459--
			}
		},

		/**
		 * This method is the error response of service call of serviceCaseList.
		 * @name handleServiceCaseFetchFail
		 * @param oError : Holds the response data
		 * @returns
		 */
		handleServiceCaseFetchError: function(oErrorResponse) {
			//this._fnDestroyBusyDialog(this); //PCR016664--
			//if (!oError.ErrorMessage.match("Request aborted"))      //PCR016664--
			//serviceCaseCreation.fragmentHelper.handleErrorResponseDialog(this, oData); //V02++    //PCR016664--

			/*Start of PCR016664++*/
			var oError = oErrorResponse.getParameter("d");
			if (oError) {
				this._iErrorCount += 1;
				if (this._iErrorCount % 2 === 0) {
					return;
				} else if (this._iErrorCount === 1 && oError.hasOwnProperty("ErrorMessage")) {
					this.getCurrentView().byId(serviceCaseCreation.Ids.MASTER_LIST).setBusy(false);
					if (!oError.ErrorMessage.match("Request aborted")) {
						serviceCaseCreation.fragmentHelper.handleErrorResponseDialog(this, oErrorResponse);
					}
				}
			}
			/*End of PCR016664++*/
		},

		/* V02++
		 * Timeout Error Handling */

		/**
		 * This method will close the infoDialog
		 * @name onInfoDialog
		 * @param
		 * @returns
		 */
		onInfoDialog: function(oEvent) {
			this.destroyDialog();

			if ((!jQuery.device.is.phone) && !this._oAdvSearchDialog && (!sap.ui.getCore().getModel("ccServiceCaseModel") || !sap.ui.getCore().getModel(
					"ccMasterListModel"))) //PCR016664++
				this.getRouter().getTargets().display("NoServiceCaseAvailable"); //PCR016664++
		},

		/*------------------------*/

		/**
		 * This method is called when data updated in view(list), Logic implemented to select first item
		 * by default in Master details view
		 * @name onUpdateFinished
		 * @param
		 * @returns
		 */
		onUpdateFinished: function(oEvent) {
			var oView = this.getCurrentView(),
				bEnabled,
				sOrderList = this.getCurrentView().byId(serviceCaseCreation.Ids.MASTER_LIST),
				sOrderListItems = sOrderList.getItems();

			if (sOrderList.getBinding("items").isLengthFinal()) {
				this.getCurrentView().byId("dashboardTitle").setText("Case Creation (" + oEvent.getParameter("total") + ")");
				//PCR016664++
				sOrderList.setBusy(false);
				if (!sOrderListItems.length) {
					sOrderList.setNoDataText("No Service Cases Available");
				} //PCR016664++
			}

			/*start of PCR016664++*/
			bEnabled = false;
			var bEnableFLTR_Sort = false;

			if (sap.ui.getCore().getModel("ccServiceCaseModel") && sap.ui.getCore().getModel("ccMasterListModel")) {
				bEnabled = true;
				bEnableFLTR_Sort = (sOrderListItems.length) ? true : false;
			}
			this.toggleAvailability([serviceCaseCreation.Ids.RESET_BTN, serviceCaseCreation.Ids.RESET_LIST_BTN], bEnabled)
			this.toggleAvailability([serviceCaseCreation.Ids.SORT_BTN, serviceCaseCreation.Ids.FILTER_BTN], bEnableFLTR_Sort);
			/*end of PCR016664++*/

			/*//PCR016459--
			 * Persistent Filters and Sorters
			 * 
			 * if(!jQuery.device.is.phone ) { //Auto navigation to first item is only for Desktop not for Mobile
	 			  if(sOrderListItems.length)
				    bEnabled = true;
				  else
				    bEnabled = false;
				  oView.byId(serviceCaseCreation.Ids.SORT_BTN).setEnabled(bEnabled);
				  oView.byId(serviceCaseCreation.Ids.FILTER_BTN).setEnabled(bEnabled);
			}*/
		},
		/**
		 * This method is to handle the search event in dashboard (master) page .
		 * @name handleSearch
		 * @param evt - Holds the current event of search
		 * @returns
		 */
		handleSearch: function() {
			that.aSearchFilter = [];
			var sSearchString = this.getCurrentView().byId(serviceCaseCreation.Ids.SEARCH_FIELD).getValue(),
				oBinding = this.getCurrentView().byId(serviceCaseCreation.Ids.MASTER_LIST).getBinding("items");

			if (sSearchString.length) {
				that.oServiceCaseSearchFilter = new Filter(this.sSorter, sap.ui.model.FilterOperator.Contains, sSearchString);
				that.oCustToolIdSearchFilter = new Filter(this.sCustomerToolIdSorter, sap.ui.model.FilterOperator.Contains, sSearchString);
				that.oSerialNumberSearchFilter = new Filter(this.sSerialNumber, sap.ui.model.FilterOperator.Contains, sSearchString);
				that.aSearchFilter.push(that.oServiceCaseSearchFilter);
				that.aSearchFilter.push(that.oCustToolIdSearchFilter);
				that.aSearchFilter.push(that.oSerialNumberSearchFilter);
				that._bindingfunction();
			} else
				that._bindingfunction();
		},

		/**
		 * This method is for refreshing the list Items.
		 * @name onSearchFieldAutoRefresh
		 * @param
		 * @returns
		 */
		onSearchFieldAutoRefresh: function() {
			this.handleSearch();
		},

		/**
		 * This method is to go to create service case page.
		 * @name onCreate
		 * @param
		 * @returns
		 */
		onCreate: function(oEvent) {
			//Start of PCR032539++ changes
			var oAuthModel = that.getOwnerComponent().getModel("authmodel"),
				oAuth = oAuthModel.getData();

			if (oAuth.ASGRoleInd && oAuth.PSERole) {
				if (!this._oPopover) {
					this._oPopover = sap.ui.xmlfragment("serviceCaseCreation.view.fragments.ServiceType", this);
					this.getView().addDependent(this._oPopover);
				}

				this._oPopover.openBy(oEvent.getSource());
			} else if (oAuth.ASGRoleInd) {
				this.getRouter().navTo("serviceCreate");
			} else {
				this.onPressNavToPSECreate();
			}

			// this.getRouter().navTo("serviceCreate");
			// onCreate: function() {
			//End of PCR032539++ changes
		},

		/**
		 * This method is for handling the change of select in master list ,it navigates us to Service Order page.
		 * @name onSelectionChange
		 * @param oEvent - Holds the current event for selection change
		 * @returns
		 */
		onSelectionChange: function(oEvent) {
			var sPath;

			if (jQuery.device.is.phone)
				sPath = oEvent.getSource().getBindingContextPath();
			else
				sPath = this.getCurrentView().byId(serviceCaseCreation.Ids.MASTER_LIST).getSelectedItem().getBindingContext().getPath();

			//Start of PCR032539++ changes	
			//Start of PCR034266++ changes
			var oListItem = jQuery.device.is.phone ? oEvent.getSource() : oEvent.getSource().getSelectedItem();
			var oCntx = oListItem.getBindingContext().getObject();

			// var oCntx = oEvent.getSource().getSelectedItem().getBindingContext().getObject();
			//End of PCR034266++ changes
			var bNavToPSE = oCntx.Servicetypedesc === "Project" && oCntx.PSECaseFlag;

			if (bNavToPSE) {
				this.getRouter().navTo("pseProjectOrder", {
					ServiceCase: oCntx.Servicecasenumber
				});
				return;
			}

			//End of PCR032539++ changes	

			sPath = sPath.split('/')[3];
			this.getRouter().navTo("serviceOrder", {
				ServiceCasePath: sPath
			});
		},

		/***********************************PCR016664 start**********************************************************/

		/**
		 * This method is for advance search in master page , it navigates to Advance Search page .
		 * @name dashboardAdvanceSearch
		 * @param
		 * @returns
		 */

		onAdvanceSearch: function() {
			//this.getRouter().navTo("advanceSearch"); //PCR016664--
			this._oAdvSearchDialog = serviceCaseCreation.fragmentHelper.createDialogFragment(this.getCurrentView().getId(), this,
				"serviceCaseCreation.view.fragments.advanceSearch");

			this._oAdvSearchDialog.open();
		},

		/**
		 * This method is to open dialog fragment to searching assigned person .
		 * @name assignedPerson
		 * @param 
		 * @returns 
		 */
		assignedPerson: function() {
			var oAdvSearchNavCon = this.getCurrentView().byId(serviceCaseCreation.Ids.ADV_SEARC_NAV_CONT),
				oAssignedToPage = this.getCurrentView().byId(serviceCaseCreation.Ids.ADV_SEARCH_ASSIGNEDTO);

			oAdvSearchNavCon.to(oAssignedToPage);
		},

		/**
		 * This method will navigate back to the previous views in the adv. search fragment.
		 * @name onUserDetailsNavBack
		 * @param 
		 * @returns 
		 */
		onUserDetailsNavBack: function() {
			var oAdvSearchNavCon = this.getCurrentView().byId(serviceCaseCreation.Ids.ADV_SEARC_NAV_CONT);
			oAdvSearchNavCon.back();
		},

		/**
		 * This method is the method triggered when the user clicks 'OK' of the value help fragment 'Assigned To'   .
		 * @name onAssignedTo
		 * @param 
		 * @returns 
		 */
		onAssignedTo: function() {
			var oView = this.getView(),
				sUserId = oView.byId(serviceCaseCreation.Ids.USERID_INPUT).getValue(),
				sFirstName = oView.byId(serviceCaseCreation.Ids.FIRST_NAME_INPUT).getValue().trim().replace(/ /g, "%20"),
				sLastName = oView.byId(serviceCaseCreation.Ids.LAST_NAME_INPUT).getValue().trim().replace(/ /g, "%20");

			if (sFirstName || sLastName || sUserId) {
				this._oAdvSearchDialog.setBusyIndicatorDelay(0);
				this._oAdvSearchDialog.setBusy(true);

				var sQuery = serviceCaseCreation.util.ServiceConfigConstants.CaseCreationCEUserHelpSet + "?$filter=Firstname%20eq%20%27" +
					sFirstName + "%27%20and%20Lastname%20eq%20%27" + sLastName + "%27%20and%20Userid%20eq%20%27" + sUserId + "%27";

				this.finishoDataModelregistartionProcessWithParams(serviceCaseCreation.util.EventTriggers.CASE_CREATION_USER_HELP_SUCCESS,
					"handleCEinputSuccess",
					serviceCaseCreation.util.EventTriggers.CASE_CREATION_USER_HELP_FAIL,
					"handleCEinputFail",
					sQuery,
					serviceCaseCreation.util.ServiceConfigConstants.get, "", "", "", serviceCaseCreation.util.EventTriggers.TRIGGER_CASE_CREATION_USER_HELP_READ
				);
			} else {
				MessageToast.show(this.resourceBundle.getText("AdvanceSearch.AsnMessageToast"));
			}
		},

		/**
		 * This method is success callback function of the service call when the user clicks 'OK' of the value help fragment 'Assigned To'   .
		 * @name handleCEinputSuccess
		 * @param 
		 * @returns 
		 */
		handleCEinputSuccess: function() {
			this._oAdvSearchDialog.setBusy(false);

			var oView = this.getCurrentView();
			var bEnableEmployeeListOkBtn = false;
			var ceHelpModel = sap.ui.getCore().getModel("ccUserHelpListModel");

			if (ceHelpModel.getData().d.results.length) {
				var oAdvSearchNavCon = this.getCurrentView().byId(serviceCaseCreation.Ids.ADV_SEARC_NAV_CONT),
					oAssignedToResultPage = this.getCurrentView().byId(serviceCaseCreation.Ids.ADV_SEARCH_ASSIGNEDTO_RESULTS);
				oAdvSearchNavCon.to(oAssignedToResultPage);
				oAssignedToResultPage.setModel(ceHelpModel);
				if (ceHelpModel.getData().d.results.length === 1) {
					var oTable = this.getView().byId(serviceCaseCreation.Ids.ADV_SEARCH_RESULTS_TABLE)
					oTable.setSelectedItem(oTable.getItems()[0], true);
					bEnableEmployeeListOkBtn = true;
				}
				oView.byId(serviceCaseCreation.Ids.EMP_RESULTS_OK_BTN).setEnabled(bEnableEmployeeListOkBtn);
			} else {
				MessageToast.show(this.resourceBundle.getText("AdvanceSearch.MessageToast"));
			}
		},

		/**
		 * This method is error callback function of the service call when the user clicks 'OK' of the value help fragment 'Assigned To'   .
		 * @name handleCEinputFail
		 * @param 
		 * @returns 
		 */
		handleCEinputFail: function(oData) {
			this._oAdvSearchDialog.setBusy(false);
			this.destroyDialog();
			var sFailureDialogMsg = this.resourceBundle.getText("AdvanceSearch.FailureDialogMsg");

			serviceCaseCreation.fragmentHelper.dialogFragmentContent(this, sFailureDialogMsg, serviceCaseCreation.StandardSAPIcons.ICON_SAP_MSG_ERROR,
				"#cc1919",
				oData.getParameter("d").ErrorMessage);
			serviceCaseCreation.fragmentHelper.createDialogFragment(this.getCurrentView().getId(), this,
				"serviceCaseCreation.view.fragments.InfoDialog").open();
		},

		/**
		 * This method is to close dialog fragment to searching assigned person .
		 * @name onAssignedToResultSelectionChange
		 * @param oEvent - Current event parameter
		 * @returns 
		 */
		onAssignedToResultSelectionChange: function(oEvent) {
			var oSelectedItem = oEvent.getSource();
			var sPath = oSelectedItem.getSelectedItem().getBindingContext().getPath();

			this.getCurrentView().byId(serviceCaseCreation.Ids.EMP_RESULTS_OK_BTN).setEnabled(true);
			this._oAssignedToSelectedItem = oSelectedItem.getModel().getProperty(sPath);
		},

		/**
		 * This method is to select line item for assigning service case .
		 * @name onSelectAssignedName
		 * @param oEvent - Current Event Parameter
		 * @returns 
		 */
		onSelectAssignedName: function(oEvent) {
			var oView = this.getCurrentView(),
				oEmployeeId = this.getCurrentView().byId(serviceCaseCreation.Ids.EMPOLYEE_ID_INPUT),
				oTable = this.getView().byId(serviceCaseCreation.Ids.ADV_SEARCH_RESULTS_TABLE);

			if (oTable.getSelectedItem()) {
				var sFirstName = oTable.getSelectedItem().getBindingContext().getProperty("Firstname");
				var sLastName = oTable.getSelectedItem().getBindingContext().getProperty("Lastname");
				this._sUserID = oTable.getSelectedItem().getBindingContext().getProperty("Userid");
				var oAdvSearchNavCon = this.getCurrentView().byId(serviceCaseCreation.Ids.ADV_SEARC_NAV_CONT),
					oAdvSearchPage = this.getCurrentView().byId(serviceCaseCreation.Ids.ADV_SEARCH_CONT_SEARCHVIEW);
				oAdvSearchNavCon.backToPage(oAdvSearchNavCon.getInitialPage());
				oEmployeeId.setValue(sFirstName + " " + sLastName);
			}
		},

		/**
		 * This method is to validate the enter Serive Case number is of typer number.
		 * @name handleNumberInputValue
		 * @param {Object} oEvent - event handler object
		 * @returns 
		 */
		handleNumberInputValue: function(oEvent) {
			var rAlphabetRegex = /^[0-9*]*$/,
				oAdvanceSearchNumberElement = oEvent.oSource,
				sNumber = oAdvanceSearchNumberElement.getValue();

			if (!rAlphabetRegex.test(sNumber.substr(-1)))
				oAdvanceSearchNumberElement.setValue(sNumber.replace(sNumber.substr(-1), ""));
		},

		/**
		 * This method if for handling advance search in master view.
		 * @name onAdvanceSearchDashboard
		 * @param {Object} oEvent - Current event Parameter 
		 * @returns 
		 */
		onAdvanceSearchDashboard: function(oEvent) {
			var oInputs = new Object(),
				aInputData = [];

			for (var i = 0; i < this._aAdvSearchFields.length; i++) {
				oInputs[this._aAdvSearchFields[i]] = this.getCurrentView().byId(this._aAdvSearchFields[i]).getValue().toUpperCase().trim().replace(
					/ /g, "");
				if (oInputs[this._aAdvSearchFields[i]])
					aInputData.push(oInputs[this._aAdvSearchFields[i]]);
			}

			if (aInputData.length) {
				var sAdvanceSearchQuery = serviceCaseCreation.util.ServiceConfigConstants.SserviceCaseEntitySet + "&$filter=CreatedBy%20eq%20%27" +
					this._sUserID +
					"%27%20and%20Servicecasenumber%20eq%20" + "%27" + oInputs[serviceCaseCreation.Ids.SERVICE_CASE_NUMBER_INPUT] + "%27" +
					"%20and%20Serialnumber%20eq%20" + "%27" + oInputs[serviceCaseCreation.Ids.SERIAL_NUMBER_INPUT] + "%27" +
					"%20and%20Customertoolid%20eq%20" + "%27" + oInputs[serviceCaseCreation.Ids.TOOL_NUMBER_INPUT] + "%27" +
					"%20and%20LegacyOrdNo%20eq%20" + "%27" + oInputs[serviceCaseCreation.Ids.LEGACY_NUMBER_INPUT] + "%27" +
					"%20and%20OpportunityNo%20eq%20" + "%27" + oInputs[serviceCaseCreation.Ids.OPPORTUNITY_NUMER_INPUT] + "%27"; //V01++
				this._oAdvSearchDialog.setBusyIndicatorDelay(0);
				this._oAdvSearchDialog.setBusy(true);
				this._AdvanceSearch(sAdvanceSearchQuery);
			} else {
				MessageToast.show(this.resourceBundle.getText("AdvanceSearch.AsnMessageToast"));
			}
		},

		/**
		 * This method is a success call back function for advance search service call.
		 * @name handleAdvanceSearchSuccess
		 * @param {Object} oData - success response
		 * @returns 
		 */
		handleAdvanceSearchSuccess: function(oData) {
			this.destroyDialog();

			this.getCurrentView().byId(serviceCaseCreation.Ids.SRV_CASE_MASTER).scrollTo(0);
			this._navFromAdanceSearch("advanceSearchtoMain");
		},

		/**
		 * This method helps in navigating back to the respective view.
		 * @name _navFromAdanceSearch
		 * @param 
		 * @returns 
		 */
		_navFromAdanceSearch: function(sRoute) {
			var oServiceCaseModel = sap.ui.getCore().getModel("ccServiceCaseModel");

			if (oServiceCaseModel) {
				if (oServiceCaseModel.getData().d.results.length) {
					this.getCurrentView().byId(serviceCaseCreation.Ids.MASTER_LIST).setModel(oServiceCaseModel);
					this.getRouter().navTo(sRoute)
				} else {
					this.getRouter().navTo("noServiceCaseAvailable");
				}
			}
		},

		/**
		 * This method is a error call back function of Labor and Part details confirmation.
		 * @name handleCaseConfirmationError
		 * @param oData - Current event Parameter
		 * @returns 
		 */
		handleAdvanceSearchError: function(oData) {
			this.destroyDialog();

			this.getCurrentView().byId(serviceCaseCreation.Ids.MASTER_LIST).setBusy(false);
			var sFailureDialogMsg = this.resourceBundle.getText("AdvanceSearch.FailureDialogMsg");
			serviceCaseCreation.fragmentHelper.dialogFragmentContent(this, sFailureDialogMsg, serviceCaseCreation.StandardSAPIcons.ICON_SAP_MSG_ERROR,
				"#cc1919",
				oData.getParameter("d").ErrorMessage);
			serviceCaseCreation.fragmentHelper.createDialogFragment(this.getCurrentView().getId(), this,
				"serviceCaseCreation.view.fragments.InfoDialog").open();
		},

		/**
		 * This method is called for advance search service call.
		 * @name _AdvanceSearch
		 * @param sAdvanceSearchQuery - Current event  Parameter
		 * @returns 
		 */
		_AdvanceSearch: function(sAdvanceSearchQuery) {
			if (sap.ui.getCore().getModel("ccServiceCaseModel") && sap.ui.getCore().getModel("ccMasterListModel")) {
				this.finishoDataModelregistartionProcessWithParams(serviceCaseCreation.util.EventTriggers.SERVICE_CASES_SEARCH_SUCCESS,
					"handleAdvanceSearchSuccess", serviceCaseCreation.util.EventTriggers.SERVICE_CASES_SEARCH_FAIL,
					"handleAdvanceSearchError", sAdvanceSearchQuery,
					serviceCaseCreation.util.ServiceConfigConstants.get, "", "", "",
					serviceCaseCreation.util.EventTriggers.TRIGGER_SERVICE_CASES_SEARCH_READ);
			} else {
				if (this.oServiceCaseModel) {
					if (this.oServiceCaseModel.hasOwnProperty("_oDataModel")) {
						var oDataModel = this.oServiceCaseModel._oDataModel;
						if (oDataModel.hasOwnProperty("aPendingRequestHandles")) {
							var aPendingRequestHandles = oDataModel.aPendingRequestHandles;
							for (var oReq in aPendingRequestHandles)
								aPendingRequestHandles[oReq].abort();
						}
					}
				}

				this.getCurrentView().byId(serviceCaseCreation.Ids.MASTER_LIST).setBusy(true);

				this.oServiceCaseModel = new serviceCaseCreation.model.SvcCreateCoreModel(this);
				this.oServiceCaseModel.attachserviceCaseCreationEventWithEventName(serviceCaseCreation.util.EventTriggers.SERVICE_CASES_READ_SUCCESS,
					jQuery.proxy(this.handleAdvSearchMasterServiceCaseFetchSuccess), this);
				this.oServiceCaseModel.addBatchOperation(serviceCaseCreation.util.ServiceConfigConstants.masterListSet, serviceCaseCreation.util.ServiceConfigConstants
					.get, "", "", "");
				this.oServiceCaseModel.attachserviceCaseCreationEventWithEventName(serviceCaseCreation.util.EventTriggers.SERVICE_CASES_READ_FAIL,
					jQuery.proxy(this.handleAdvanceSearchError), this);
				this.oServiceCaseModel.addBatchOperation(sAdvanceSearchQuery, serviceCaseCreation.util.ServiceConfigConstants.get, "", "", "");
				this.oServiceCaseModel.fireserviceCaseCreationEventWithEventName(serviceCaseCreation.util.EventTriggers.TRIGGER_SERVICE_CASES_READ);
			}
		},

		handleAdvSearchMasterServiceCaseFetchSuccess: function() {
			this.destroyDialog();
			this.handleServiceCaseFetchSuccess();
		},

		/**
		 * An internal method to navigate to Service Case Details.
		 * @name _fnHandleResetRoute
		 * @param
		 * @returns
		 */
		_fnHandleResetRoute: function(sContext) {
			var sCurrentRoutePattern = sap.ui.core.routing.HashChanger.getInstance().getHash(),
				sRouteName = "serviceOrder";

			if (sCurrentRoutePattern)
				sRouteName = (sCurrentRoutePattern.split("/")[0] === "ServiceOrder") ? "resetMasterList" : sRouteName; //PCR016664++
			/*sRouteName = (sCurrentRoutePattern.split("/")[2] === "ServiceOrderDetails") ? "resetMasterList" : sRouteName;*/
			this.getRouter().navTo(sRouteName, {
				ServiceCasePath: sContext
			}, true);
		},

		/***********************************PCR016664 end**********************************************************/

		/**
		 * This method is to reset the Master list items
		 * @name _resetMasterList
		 * @param
		 * @returns
		 */
		_resetMasterList: function() {
			var that = this;
			this.bOnGroupBy = false;
			this.bRouteFlag = true;
			that.aSearchFilter = [];
			that.aCategoryFilter = [];
			serviceCaseCreation.util.Util.DeleteDesiredPersistFilterQuery.call(this, "ServiceCases"); /*PCR016459++*/
			var oBinding = this.getCurrentView().byId(serviceCaseCreation.Ids.MASTER_LIST).getBinding("items");

			if (oBinding) {
				oBinding.filter([]);
				this._onlistSort(this.sSorter, true, "");
			}

			this.destroyDialog();
			var sBusyDialogMsg = this.resourceBundle.getText("Dashboard.BusyDialogMsg");
			serviceCaseCreation.fragmentHelper.dialogFragmentContent(this, "", "", "", sBusyDialogMsg);
			this._busyDialog = serviceCaseCreation.fragmentHelper.createDialogFragment(this.getCurrentView().getId(), this,
				"serviceCaseCreation.view.fragments.BusyDialog");
			this._busyDialog.open();
			this.bRouteFlag = true;

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
				serviceCaseCreation.util.EventTriggers.TRIGGER_SERVICE_CASES_SEARCH_READ
			);
		},

		/**
		 * This method is success callback function to Reset Master List  .
		 * @name handleMasterListResetSuccess
		 * @param
		 * @returns
		 */
		handleMasterListResetSuccess: function() {
			this.destroyDialog();

			serviceCaseCreation.controller.BaseController.prototype.setGlobalComponentModel.call(this, "ccServiceCaseModel");
			serviceCaseCreation.controller.BaseController.prototype.setComponentModelToCurrentViewModel.call(this);
			var sOrderList = this.getCurrentView().byId(serviceCaseCreation.Ids.MASTER_LIST);
			this.getCurrentView().byId(serviceCaseCreation.Ids.MASTER_LIST).setModel(sap.ui.getCore().getModel("ccServiceCaseModel"));
			var oServiceCaseModel = sap.ui.getCore().getModel("ccServiceCaseModel");
			sOrderList.setModel(oServiceCaseModel);

			var oFirstItem = this.getCurrentView().byId(serviceCaseCreation.Ids.MASTER_LIST).getItems()[0];
			this.getCurrentView().byId(serviceCaseCreation.Ids.SRV_CASE_MASTER).scrollTo(0); //PCR016664++

			//start of PCR018322++ changes
			if (this.getModelFromCore("ccServiceOrderModel")) {
				sap.ui.getCore().setModel(null, "ccServiceOrderModel");
			}
			//end of PCR018322++ changes

			if (oFirstItem) {
				if (oFirstItem.getBindingContext().getPath() && !jQuery.device.is.phone) {
					var sPath = oFirstItem.getBindingContext().getPath().split("/")[3];
					//this.getRouter().navTo("resetMasterList", {ServiceCasePath : sPath}); //PCR016664--
					
					//Start of PCR032539++ changes
					
					var oCntx = oServiceCaseModel.getProperty("/d/results/" + this.firstIemPath);

					if (oCntx.Servicetypedesc === "Project" && oCntx.PSECaseFlag) {
						this.getRouter().navTo("pseProjectOrder", {
							ServiceCase: oCntx.Servicecasenumber
						});
					} else {
						this._fnHandleResetRoute(sPath); //PCR016664++
					}
					
					//End of PCR032539++ changes
					if (!sOrderList.getSelectedItems().length) {
						sOrderList.setSelectedItem(sOrderList.getItems()[0], true);
					}
				} else {
					if (jQuery.device.is.phone) //PCR032466--; removed !
						this.getRouter().navTo("serviceCaseMaster")
				}
			} else {
				this.getRouter().navTo("noServiceCaseAvailable")
			}
		},

		/**
		 * This method is failure callback function to Reset Master List  .
		 * @name handleMasterListResetFail
		 * @param
		 * @returns
		 */
		handleMasterListResetFail: function() {
			this.destroyDialog();
		},

		onCancelSearch: function() {
			this.destroyDialog();
		},

		/**
		 * This method is to sort the list
		 * @name onSort
		 * @param oEvent - Holds the current event for sorting
		 * @returns
		 */
		onSort: function(oEvent) {
			var bDescending = (this.bDescending) ? false : true;
			var vGroup = (that.groupByProperty) ? that.mGroupFunctions[this.sCustomerToolIdSorter] : that.mGroupFunctions[this.sServiceCaseType];
			var eventName = (this.bOnGroupBy) ? "customerToolIdSort" : "serviceCaseSort";

			switch (eventName) {
				case "customerToolIdSort":
					if (this.groupFlag && that.groupByProperty) {
						this.groupFlag = false;
						this._onlistSort(this.sCustomerToolIdSorter, bDescending, vGroup);
					} else if (this.groupFlag) {
						this.groupFlag = false;
						this._onlistSort(this.sServiceCaseType, bDescending, vGroup);
					} else {
						this.groupFlag = true;
						bDescending = (bDescending == false) ? true : false;

						(that.groupByProperty) ? this._onlistSort(this.sCustomerToolIdSorter, bDescending, vGroup):
							this._onlistSort(this.sServiceCaseType, bDescending, vGroup);
					}
					break;

				case "serviceCaseSort":
					if (this.bSortFlag == true) {
						this.bSortFlag = false;
						this._onlistSort(this.sSorter, false, "");
					} else {
						this.bSortFlag = true;
						this._onlistSort(this.sSorter, true, "");
					}
					serviceCaseCreation.util.Util.setPersistentFilters.call(this, "ServiceCases", "Sort", this.bSortFlag); /*PCR016459++*/
					break;

				default:
					break;
			}
		},

		/**
		 * This method is to do filter operation in master list(DashBoard page).
		 * @name onFilter
		 * @param oEvent - Holds the current event of filtering
		 * @returns
		 */
		onFilter: function(oEvent) {
			/*PCR016459++ changes start*/
			//this.createDialog(this, "serviceCaseCreation.view.fragments.FilterSettingsFragment").open("filter");
			var oView = this.getCurrentView(); //PCR016664++
			this._oViewSettingsDialog = serviceCaseCreation.fragmentHelper.createDialogFragment(oView.getId(), this,
				"serviceCaseCreation.view.fragments.FilterSettingsFragment"); //PCR016664++
			serviceCaseCreation.util.Util.validateAndCheckViewSettingsFilterItems.call(this, this._oViewSettingsDialog, "ServiceCases");
			this._oViewSettingsDialog.open("filter");
			/*PCR016459++ changes end*/

			//this._VSDclearFilterBtnStyle(); //PCR016664--

			oView.byId(this._oViewSettingsDialog.getId() + serviceCaseCreation.Ids.FIL_SET_RESET_BTN).setText(this.resourceBundle.getText(
				"viewSettingsDialog.clearFilters")); //PCR016664++
			oView.byId(this._oViewSettingsDialog.getId() + serviceCaseCreation.Ids.FIL_SET_RESET_BTN_IMG).addStyleClass(
				"filterSettingDialogResetFilterIcon"); //PCR016664++
			oView.byId(this._oViewSettingsDialog.getId() + serviceCaseCreation.Ids.FIL_SET_GRPLIST).addStyleClass(
				"filterSettingDialogResetFilterIcon"); //PCR016664++
		},

		/**
		 * Method for handling confirmation of filter dialog.
		 * @name onConfirmFilterSettingDialog
		 * @param oEvent - Holds the current event of confirmation dialog
		 * @returns
		 */
		onConfirmFilterSettingDialog: function(oEvent) {
			var that = this; /*PCR016459++*/
			that.aCategoryFilter = [];
			var mParams = oEvent.getParameters(),
				sSortPath, vGroup, aSplit, sFilterPath, sOperator, sValue1,
				sValue2, oFilter,
				oBinding = this.getCurrentView().byId(serviceCaseCreation.Ids.MASTER_LIST).getBinding("items");
			var aFilterQueries = []; /*PCR016459++*/
			var oServiceCaseModel = sap.ui.getCore().getModel("ccServiceCaseModel"); /*PCR016459++*/

			if (mParams.groupItem) {
				sSortPath = mParams.groupItem.getKey();
				this.bDescending = mParams.groupDescending;
				vGroup = that.mGroupFunctions[sSortPath];
				this._onlistSort(sSortPath, this.bDescending, vGroup);
				this.groupFlag = true;
				this.bOnGroupBy = true;
			} else {
				this.bOnGroupBy = false;
				this._onlistSort(this.sSorter, true, "");
			}

			if (mParams.filterItems.length > 0) {
				var aFilterItems = mParams.filterItems;
				var oFilter;
				for (var sFilterItem in aFilterItems) {
					var oItem = aFilterItems[sFilterItem];
					/*if(oItem.getKey() === "none") {
					  oBinding.filter([]);
					}*/
					/*PCR016459--*/
					if (oItem.getKey() === "Other") { /*PCR016459++ start*/
						serviceCaseCreation.util.Util.getOtherFilterItems.call(this, that.aCategoryFilter);
						if (!that.aCategoryFilter.length)
							that.aCategoryFilter.push(new Filter([]));
						aFilterQueries.push("Other"); /*PCR016459++ end*/
					} else {
						aSplit = oItem.getKey().split("___");
						sFilterPath = aSplit[0];
						sOperator = aSplit[1];
						sValue1 = aSplit[2];
						sValue2 = aSplit[3];
						oFilter = new Filter(sFilterPath, sOperator, sValue1, sValue2);
						that.aCategoryFilter.push(oFilter);
						aFilterQueries.push(sValue1); /*PCR016459++*/
					}
				}
				that._bindingfunction();
			} else {
				//that._bindingfunction(); //PCR016459++
				var aBindingFilter = (that.aSearchFilter.length) ? [new sap.ui.model.Filter([new Filter(that.aSearchFilter)], true)] : []; /*PCR016459++*/
				oBinding.filter(aBindingFilter); /*PCR016459++*/
			}

			serviceCaseCreation.util.Util.setPersistentFilters.call(this, "ServiceCases", "Filter", aFilterQueries); /*PCR016459++*/
			this.destroyDialog(); //PCR016664++
		},

		/* =========================================================== */
		/* begin: internal methods                                     */
		/* =========================================================== */

		/**
		 * This method is to sort the list.
		 * @name _onlistSort
		 * @param {Object} sorter - Sorter parameter
		 * @param {Object} order - asc or dsc order
		 * @param {Object} groupBy - groupby template
		 */
		_onlistSort: function(sorter, order, groupBy) {
			var oSorter,
				oBinding = this.getCurrentView().byId(serviceCaseCreation.Ids.MASTER_LIST).getBinding("items"),
				oSorter = new Sorter(sorter, order, groupBy);

			oBinding.sort(oSorter);
			this.bSortFlag = order;
		},

		/**
		 * Method for resetting of service order list.
		 * @name _bindingfunction
		 * @param
		 * @returns
		 */
		_bindingfunction: function() {
			var oBinding = this.getCurrentView().byId(serviceCaseCreation.Ids.MASTER_LIST).getBinding("items");
			var vSearchFilterPush = new Filter(that.aSearchFilter);
			var vCategoryFilterPush = new Filter(that.aCategoryFilter);
			var aRefilter = [];

			if (that.aSearchFilter.length)
				aRefilter.push(vSearchFilterPush);

			if (that.aCategoryFilter.length)
				aRefilter.push(vCategoryFilterPush);

			if (aRefilter.length == 0)
				oBinding.filter([])
			else {
				oBinding.filter([new sap.ui.model.Filter(aRefilter, true)]);
			}
		},

		//PCR016664-- start

		/**
		 * Method for resetting of service order list.
		 * @name _VSDclearFilterBtnStyle
		 * @param
		 * @returns
		 */
		/*
	    _VSDclearFilterBtnStyle : function() {
	    	sap.ui.getCore().byId("filterSettingsDialog-resetbutton").setText("Clear Filters");
	    	sap.ui.getCore().byId("filterSettingsDialog-resetbutton-img").addStyleClass("filterSettingDialogResetFilterIcon");
	    },*/

		/**
		 * This method is to detach busy dialog from the view and destroy it.
		 * @name _fnDestroyBusyDialog
		 * @param {Object} oController - current controller reference
		 * @returns
		 */
		/* 
	    _fnDestroyBusyDialog : function(oController) {
	    	var oView = oController.getView(),
	    	oBusyDialog = oController._oBusyDialog;

	    	if(oBusyDialog) {
	        	oBusyDialog.close();
	        	oView && oView.removeDependent(oBusyDialog);
	        	oBusyDialog.destroy(true);
	        	oBusyDialog = null;
	    	}
	    },*/
		//PCR016664-- end

		/**
		 * An internal method to select first item in the list and navigate to Service Case Details.
		 * @name _fnSelectFirstItem
		 * @param
		 * @returns
		 */
		_fnSelectFirstItem: function() {
			var oView = this.getCurrentView(),
				sOrderList = oView.byId(serviceCaseCreation.Ids.MASTER_LIST),
				sOrderListItems = sOrderList.getItems();

			//if(!jQuery.device.is.phone) {
			if (sOrderListItems.length) {
				this._sFirstItemContext = sPath = sOrderListItems[0].getBindingContext().getPath().split("/")[3];

				var oCntx = sOrderListItems[0].getBindingContext().getObject(); //PCR032539++
				var bNavToPse = oCntx.Servicetypedesc === "Project" && oCntx.PSECaseFlag; //PCR032539++

				if (jQuery.device.is.phone && this._sStartupParameters) { //V01++
					if (this._sStartupParameters.serviceOrder) { //V01++
						//Start of PCR032539++ changes
						if (bNavToPse) {
							this.getRouter().navTo("pseProjectOrder", {
								ServiceCase: oCntx.Servicecasenumber
							});
						} else {
							//End of PCR032539++ changes	
							this.getRouter().navTo("serviceOrder", {
								ServiceCasePath: this._sFirstItemContext
							});
						} //PCR032539++
					}
				} else if (!jQuery.device.is.phone) { //V01++
					if (!sOrderList.getSelectedItems().length)
						sOrderList.setSelectedItem(sOrderListItems[0], true);

					//Start of PCR032539++ changes
					if (bNavToPse) {
						this.getRouter().navTo("pseProjectOrder", {
							ServiceCase: oCntx.Servicecasenumber
						});
					} else {
						//End of PCR032539++ changes	
						this.getRouter().navTo("serviceOrder", {
							ServiceCasePath: this._sFirstItemContext
						}); //V01++ 
					} //PCR032539++
				}
			} else {
				if (!jQuery.device.is.phone) //V01++
					this.getRouter().getTargets().display("NoServiceCaseAvailable"); //V01++
				/*this.getRouter().getTargets().display("noServiceCaseAvailable");*/ //V01--
			}
			//}
		},

		/**
		 * This method is for routing.
		 * @name _onAttachRouteMatched
		 * @param
		 * @returns
		 */
		_onAttachRouteMatched: function(oEvent) {
			this._sUserID = "", this._iErrorCount = 0; //PCR016664++
			var SorderstList = this.getCurrentView().byId(serviceCaseCreation.Ids.MASTER_LIST),
				aItems = SorderstList.getItems(),
				oServiceCaseModel = sap.ui.getCore().getModel("ccServiceCaseModel"),
				aSorderstListItemsContextPath = [],
				bItemState = true;

			var sServiceCasePath = oEvent.getParameter("arguments").ServiceCasePath; //PCR032539++
			this.firstIemPath = sServiceCasePath ? sServiceCasePath : "0"; //PCR032539++

			if ((aItems.length > 0 && (oEvent.getParameter("name") === "serviceOrder" || oEvent.getParameter("name") === "resetMasterList") &&
					!jQuery.device.is.phone)) {

				for (var i = 0; i < aItems.length; i++) {
					var sSVCContext = aItems[i].getBindingContext();

					if (sSVCContext) {
						if (sSVCContext.getPath() === "/d/results/" + oEvent.getParameter("arguments").ServiceCasePath) {
							this.selectedItem = aItems[i];
							aSorderstListItemsContextPath.push(sSVCContext.getPath());
						}
					}
				}

				//if(aSorderstListItemsContextPath.indexOf("/d/results/" + oEvent.getParameter("arguments").ServiceCasePath)  < 0) { //V01--
				if (aSorderstListItemsContextPath.indexOf("/d/results/" + oEvent.getParameter("arguments").ServiceCasePath) === -1) { //V01++
					this.getRouter().getTargets().display("NoServiceCaseAvailable");
					this.selectedItem = (!this.selectedItem) ? aItems[0] : this.selectedItem;
					bItemState = false;
				}

				SorderstList.setSelectedItem(this.selectedItem, bItemState);

				//Start of PCR032539++ changes

				var oCntx = oServiceCaseModel.getProperty("/d/results/" + this.firstIemPath);

				if (oCntx.Servicetypedesc === "Project" && oCntx.PSECaseFlag && oEvent.getParameter("name") === "resetMasterList") {
					this.getRouter().navTo("pseProjectOrder", {
						ServiceCase: oCntx.Servicecasenumber
					});
				}

				//End of PCR032539++ changes

				this.bRouteFlag = false;
			} else if (oEvent.getParameter("name") === "advanceSearchtoMain" || oEvent.getParameter("name") === "noServiceCaseAvailable") {
				var oSettingsModel = sap.ui.getCore().getModel("SettingsModel");

				if (oSettingsModel)
					serviceCaseCreation.util.Util.DeleteDesiredPersistFilterQuery.call(this, "ServiceCases"); /*PCR016459++*/

				if (oServiceCaseModel) {
					SorderstList.setModel(oServiceCaseModel);
					this._fnSelectFirstItem();
					this.bOnGroupBy = false;
					this.bSortFlag = true;
				}

				if (!(aItems.length) && !jQuery.device.is.phone)
					this.getRouter().navTo("noServiceCaseAvailable");
			} else if (oEvent.getParameter("name") === "serviceCreatetoMaster") {
				this.getCurrentView().byId(serviceCaseCreation.Ids.MASTER_LIST).setModel(sap.ui.getCore().getModel("ccServiceCaseModel"));

				if (!jQuery.device.is.phone)
					this._fnSelectFirstItem();
				
			 } else if (oEvent.getParameter("name") === "serviceCreatetoMasterCancel") {
				if (!jQuery.device.is.phone)
					this.getRouter().navTo("serviceOrder", {
						ServiceCasePath: this.firstIemPath
					});
			} else if ((oEvent.getParameter("name") === "serviceOrder") && !jQuery.device.is.phone)
				this.getRouter().navTo("serviceCaseMaster");
		},

		//Start of PCR032539++ changes

		/**
		 * This method is for navigating to AGS Order Creation.
		 * @name onPressNavToAGSCreate
		 */
		onPressNavToAGSCreate: function(oEvent) {
			var oBtn = oEvent.getSource(),
				sBtnRef = oBtn.data("ServiceType");

			this.getRouter().navTo("serviceCreateWithSrvType", {
				ServiceType: sBtnRef
			});
		},

		/**
		 * This method is for navigating to PSE Project Order Creation.
		 * @name onPressNavToPSECreate
		 */
		onPressNavToPSECreate: function() {
			this.getView().getParent().getParent().setMode(sap.m.SplitAppMode.HideMode);
			this.getRouter().navTo("pseProjectOrderCreate");
		},

		/**
		 * Event handler to validate PSE Project Order Creation.
		 * @name _fnValidatePseOrderCreation
		 */
		_fnValidatePseOrderCreation: function(bOrderCreated) {
			this.getView().getParent().getParent().setMode(sap.m.SplitAppMode.StretchCompressMode);

			if (bOrderCreated) {
				// Start of PCR034266++ changes
				if (jQuery.device.is.phone) {
					that.getRouter().navTo("serviceCaseMaster");
				} else {
				// End of PCR034266++ changes
					that.getRouter().navTo("resetMasterList", {ServiceCasePath: "0"});
				} //PCR034266++
				
				jQuery.sap.delayedCall(1500, that, function () {
					that._resetMasterList();
				});
			} else {
				that.getRouter().navTo("serviceCreatetoMasterCancel");
			}
		},

		/**
		 * Event handler to validate PSE Project Order Creation Role.
		 * @name _fnGetRoleAuth
		 */
		_fnGetRoleAuth: function() {
			var oModel = new sap.ui.model.odata.v2.ODataModel({
				serviceUrl: serviceCaseCreation.util.ServiceConfigConstants.getServiceCasesInfoURL
			});
			var that = this;

			oModel.read("/APGRoleSet('')", {
				method: "GET",
				success: function(oData) {
					var oAuthModel = new sap.ui.model.json.JSONModel(oData);
					that.getOwnerComponent().setModel(oAuthModel, "authmodel");
				},
				error: function() {

				}
			});
		}

		//End of PCR032539++ changes

	});

	return serviceCaseMasterController;

});