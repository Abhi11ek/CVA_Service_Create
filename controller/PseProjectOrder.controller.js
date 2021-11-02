/**
 * PseProjectOrderDetails helps in launching Project Order Details View in PSE Service Case App. 
 * 
 * @class
 * @public
 * @name ServiceCaseCreation.controller.BaseController
 * @author Vimal Pandu
 * @since 01 December 2020
 * --------------------------------------------------------------------------*
 * Date        	Author		  PCR No.     Description of change              *
 * ----------   -----------   ---------   -----------------------------------*
 * 12/01/2020  	Vimal Pandu   PCR032539   PSE Sprint 10 changes				 *
 * --------------------------------------------------------------------------*/
 
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"serviceCaseCreation/libs/polyfill",
], function(Controller) {

	return Controller.extend("serviceCaseCreation.controller.PseProjectOrder", {

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		onInit: function() {
			var oPseModel = this.getOwnerComponent().getModel("pseValid"),
				bShowCompCont = oPseModel.getProperty("/bShowCompCont");
			var oPseComp = sap.ui.getCore().byId(serviceCaseCreation.Ids.PSE_COMP_CONT);
			this.resourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			var oControl;	
			
			this._oPseComp = this.byId(serviceCaseCreation.Ids.PSE_COMP_CONT);
			this._oPseComp.removeAllItems();
			
			if (oPseComp) {
				oPseComp.destroy();
			}
			
			if (bShowCompCont) {
				oControl = new sap.ui.core.ComponentContainer({
					id: serviceCaseCreation.Ids.PSE_COMP_CONT,
					name: "com.amat.pse.prjordcrt",
					component: "zpse_prjord_crt",
					width: "100%",
					manifest: true,
					async: true
				});
			} else {
				oControl = new sap.m.MessageStrip({
					text: this.resourceBundle.getText("pse.PseTag"),
					showIcon: true,
					showCloseButton: false
				}).addStyleClass("sapUiSmallMargin");
			}
			
			this._oPseComp.addItem(oControl);
			
			sap.ui.core.UIComponent.getRouterFor(this).getRoute("pseProjectOrder").attachPatternMatched(this._onObjectMatched, this);
			sap.ui.core.UIComponent.getRouterFor(this).getRoute("pseProjectOrderCreate").attachPatternMatched(this._onPatternMatched, this);
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */
		
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

		/* =========================================================== */
		/* begin: internal methods                                     */
		/* =========================================================== */

		/**
		 * Event handler for pseProjectOrder route matched.
		 * @param {Object} oEvent - route event
		 * @name _onObjectMatched
		 */
		_onObjectMatched: function(oEvent) {
			var oArgs = oEvent.getParameter("arguments"),
				sServiceCase = oArgs.ServiceCase;
			
			sap.ui.getCore().getEventBus().publish("pseCreate", "data", {ServiceCase: sServiceCase});
		},
		
		/**
		 * Event handler for pseProjectOrderCreate route matched.
		 * @param {Object} oEvent - route event
		 * @name _onPatternMatched
		 */
		_onPatternMatched: function() {
			sap.ui.getCore().getEventBus().publish("pseCreate", "data", {ServiceCase: ""});
		}

	});

});
