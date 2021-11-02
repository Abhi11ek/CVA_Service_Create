/**
 * This class holds methods for Service Order.
 *
 * @class 
 * @public
 * @author Siva Prasad Paruchuri
 * @since 13 November 2016
 * @extends serviceCaseCreation.controller.BaseController
 * @name serviceCaseCreation.controller.ServiceOrder
 ** ----------------------------------------------------------------------------------  *
 * Modifications.                                                                       *
 * -------------                                                                        *
 * Ver.No    Date        Author  		PCR No.         Description of change           *
 * ------ ----------	------------	----------  	------------------------------- *
 * V00    13/10/2016	Siva Prasad                          							*
 *          			Prachuri/Alok   PCR012146   	initial version              	*
 *                  	(X087050)                                                       *
 * V01    14/07/2017	Vimal Pandu		PCR015574		Cross App Navigation Changes	*
 *          			(X087924)                            							*
 * V02    18/11/2017	X087925       	PCR016459       Persistent Filters and Sort,	*
 *                          							Jump Button text     			*
 ************************************************************************************** *
 ************************************************************************************
 *  Date      Author    		PCR No. 	Description of change        			*
 ************ ********  		**********  *****************************************
 * 11/06/2018  X087924  		PCR018233	Exe. Service Employee Addition 			*
 *                  						changes            						*
 * 07/31/2018  X087924  		PCR018422	Pass Down Log and Attachment changes	*
 * 09/22/2020  X0108356 		PCR031702	IBase Implementation					*
 * 12/01/2020  Vimal Pandu 		PCR032539	PSE Sprint 10 changes					*
 * 03/08/2021   Vimal Pandu		PCR034266   PSE Creation app bug fix	    		*
 ************************************************************************************/
sap.ui.define([
		"sap/ui/core/UIComponent",
		"sap/ui/core/routing/History",
		"sap/m/routing/RouteMatchedHandler",
		"serviceCaseCreation/model/SvcCreateCoreModel",
		'serviceCaseCreation/controller/BaseController'
	], 
	function(UIComponent, History, RouteMatchedHandler, SvcCreateCoreModel, Controller) {

		sap.ui.component.load({
			name: "serviceCaseCreation",
			url: "/sap/bc/ui5_ui5/sap/zcvgsvc_create"
		});

		return UIComponent.extend("serviceCaseCreation.Component", {

			metadata: {
				"name": "serviceCaseCreation",
				"version": "1.1.0-SNAPSHOT",
				"library": "",
				"includes": ["css/styles.css"],
				"dependencies": {
					"libs": ["sap.m"],
					//Start of PCR032539++ changes
					"components": {
						"zpse_prjord_crt": {
							"lazy": true
						}
					}
					//End of PCR032539++ changes
				}, 
				"config": {
					"fullWidth": true,
					resourceBundle: "i18n/i18n.properties",
					serviceConfig: {
						name: "",
						serviceUrl: ""
					}
				},
				//Start of PCR032539++ changes
				"resourceRoots": {
					// "zpse_prjord_crt": "../../../../../sap/zpse_prjord_crt/" PCR034266--
					"zpse_prjord_crt": "/sap/bc/ui5_ui5/sap/zpse_prjord_crt/"  // PCR034266++
				},
				"resources": {
					"js": [
						{
							"uri": "libs/polyfill.js"
						}
					]
				},
				//End of PCR032539++ changes
				routing: {
					config: {
						routerClass: sap.m.routing.Router,
						viewType: "XML",
						viewPath: "serviceCaseCreation.view",
						controlId: "fioriContent",
						controlAggregation: "detailPages",
						//Start of PCR032539++ changes
						/*V01++*/
						/*"bypassed": {
							"target": [
								"ServiceCaseMaster",
								"notFound"
							]
						}*/
						/*-----*/
						//End of PCR032539++ changes
					},
					routes: {
						serviceCaseMaster: {
							pattern: "",
							target: ["ServiceOrder", "ServiceCaseMaster"]
						},
						advanceSearch: {
							pattern: "AdvanceSearch",
							target: ["ServiceCaseMaster", "AdvanceSearch"]
						},
						advanceSearchtoMain: {
							pattern: "AdvanceSearchtoMain",
							target: ["ServiceOrder", "ServiceCaseMaster"]
						},
						noServiceCaseAvailable: {
							"pattern": "NoServiceCaseAvailable",
							"target": ["NoServiceCaseAvailable", "ServiceCaseMaster"]
						},
						resetMasterList: {
							pattern: "ServiceOrders/{ServiceCasePath}",
							target: ["ServiceCaseMaster", "ServiceOrder"]
						},
						serviceOrder: {
							pattern: "ServiceOrder/{ServiceCasePath}",
							target: ["ServiceCaseMaster", "ServiceOrder"]
						},
						serviceCreate: {
							pattern: "ServiceCreate",
							target: ["ServiceCaseMaster", "ServiceCaseCreate"]
						},
						serviceCreatetoMaster: {
							pattern: "ServiceCreatetoMaster",
							target: ["ServiceCaseCreate", "ServiceCaseMaster"]
						},
						serviceCreatetoMasterCancel: {
							pattern: "ServiceCreatetoMasterCancel",
							target: ["ServiceCaseCreate", "ServiceCaseMaster"]
						},
						//Start of PCR032539++ changes
						"pseProjectOrder": {
							pattern: "PseProjectOrder/{ServiceCase}",
							// target: ["PseProjectOrder", "ServiceCaseMaster"] PCR034266--
							target: ["ServiceCaseMaster", "PseProjectOrder"] //PCR034266++
						},
						"serviceCreateWithSrvType": {
							pattern: "ServiceCaseCreation/{ServiceType}",
							target: ["ServiceCaseMaster", "ServiceCaseCreate"]
						},
						"pseProjectOrderCreate": {
							pattern: "ProjectOrderCreation1", //PCR034266++; changed from ProjectOrderCreation to ProjectOrderCreation1
							// target: ["PseProjectOrder", "ServiceCaseMaster"] PCR034266--
							target: ["ServiceCaseMaster", "PseProjectOrder"] //PCR034266++
						}
						//End of PCR032539++ changes
					},
					targets: {
						ServiceCaseMaster: {
							viewName: "ServiceCaseMaster",
							viewId: "ServiceCaseMaster",
							controlAggregation: "masterPages"
						},
						AdvanceSearch: {
							viewName: "AdvanceSearch",
							viewId: "AdvanceSearch",
							controlAggregation: "detailPages"
						},
						ServiceOrder: {
							viewName: "ServiceOrder",
							viewId: "ServiceOrder",
							controlAggregation: "detailPages"
						},
						ServiceCaseCreate: {
							viewName: "ServiceCaseCreate",
							viewId: "ServiceCaseCreate",
							controlAggregation: "detailPages"
						},
						"NoServiceCaseAvailable": {
							"viewName": "NoServiceCaseAvailable",
							"viewId": "NoServiceCaseAvailable",
							"controlAggregation": "detailPages"
						},
						"notFound": {
							"viewName": "NotFound",
							"viewId": "notFound"
						},
						/* Start of PCR018233++ changes
						Exe. Service Emp Changes*/
						"ExeServEmp": {
							"viewName": "ExeServEmp",
							"viewId": "exeServEmp"
						},
						/*End of PCR018233++ changes*/

						/* Start of PCR018422++ changes
						Pass Down Log and Attachment Log Changes*/
						"Attachments": {
							"viewName": "Attachments",
							"viewId": "attachments"
						},
						"PassDownLog": {
							"viewName": "PassDownLog",
							"viewId": "passDownLog"
						},
						/*End of PCR018422++ changes*/

						//Start of PCR032539++ changes
						"PseProjectOrder": {
							"viewName": "PseProjectOrder",
							"viewId": "pseProjectOrder"
						}
						//End of PCR032539++ changes
					}
				}
			},

			/**
			 * Initialize the application
			 * @returns {sap.ui.core.Control} the content
			 */
			createContent: function() {
				var oViewData = {
					component: this
				};

				return sap.ui.view({
					viewName: "serviceCaseCreation.view.App",
					id: "App",
					type: sap.ui.core.mvc.ViewType.XML,
					viewData: oViewData
				});
			},

			init: function() {
				// call super init (will call function "create content")
				sap.ui.core.UIComponent.prototype.init.apply(this, arguments);
				var sRootPath = jQuery.sap.getModulePath("serviceCaseCreation");
				// the metadata is read to get the location of the i18n language files later
				var mConfig = this.getMetadata().getConfig();
				// set i18n model
				var i18nModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: [sRootPath, mConfig.resourceBundle].join("/")
				});

				this.setModel(i18nModel, "i18n");

				// set device model
				var deviceModel = new sap.ui.model.json.JSONModel({
					isTouch: sap.ui.Device.support.touch,
					isNoTouch: !sap.ui.Device.support.touch,
					isPhone: jQuery.device.is.phone ? true : false,
					isNoPhone: !jQuery.device.is.phone,
					isTablet: sap.ui.Device.system.tablet ? true : false, //PCR016459++
					isNotDesktop: !sap.ui.Device.system.desktop ? true : false, //PCR016459++
					listMode: (jQuery.device.is.phone) ? "None" : "SingleSelectMaster",
					listItemType: (jQuery.device.is.phone) ? "Active" : "Inactive",
					flexDirection: (jQuery.device.is.phone) ? "Column" : "Row" //V01++
				});

				deviceModel.setDefaultBindingMode("OneWay");
				this.setModel(deviceModel, "device");

				/*========= Begin of IBASE PCR031702++  ==================*/
				var oIbaseModel = new sap.ui.model.json.JSONModel();
				var oData = {
					iBaseUrl: false,
					iBaseValid: false,
					custSuggestBtn: false,
					custSuggest: false,
					assmSuggestBtn: false,
					posSuggestBtn: false,
					newAssemblyPanel: false,
					newPositionColumn: false,
					classChamber: false,
					classCleaner: false,
					classMetrology: false,
					classPolisher: false
				};
				oIbaseModel.setData(oData);
				this.setModel(oIbaseModel, "IBaseModel");

				/*----- End of IBASE PCR031702++   ---------------*/

				//Start of PCR032539++ changes

				var oPseModel = new sap.ui.model.json.JSONModel();
				var oValid = {
					bShowCompCont: false
				};

				if (sap.ushell && sap.ushell.Container) {
					// jQuery.sap.registerModulePath("com.amat.pse.prjordcrt", "../../../../../sap/zpse_prjord_crt/"); PCR034266--
					jQuery.sap.registerModulePath("com.amat.pse.prjordcrt", "/sap/bc/ui5_ui5/sap/zpse_prjord_crt/"); //PCR034266++
					oValid = {
						bShowCompCont: true
					};
				}

				oPseModel.setData(oValid);
				this.setModel(oPseModel, "pseValid");
				//End of PCR032539++ changes

				// initialize router and navigate to the first page
				this.getRouter().initialize();
			}

		});

	});