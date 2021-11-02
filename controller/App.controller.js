
/**
* This class holds application which loads different view.
*
* @class 
* @public
* @author Siva Prasad Prachuri
* @since 13 November 2016
* @extends serviceCaseCreation.controller.BaseController
* @name serviceCaseCreation.controller.App
*
*** ------------------------------------------------------------------------------------ *
* Modifications.                                                                       *
* -------------                                                                        *
* Ver.No    Date        Author    PCR No.           Description of change              *
* ------ ---------- ------------ ----------  ----------------------------------------- *
* V00    13/10/2016   Siva Prasad 
* 					Prachuri /Alok			initial version
*                     (X087050)                                                        *
*                                                                                      *
* 
************************************************************************************/

	sap.ui.define(['jquery.sap.global', 'serviceCaseCreation/controller/BaseController',
                'sap/ui/core/Control', "serviceCaseCreation/util/Formatter", 
                 "serviceCaseCreation/util/Util","serviceCaseCreation/helper/fragmentHelper", 
                 "serviceCaseCreation/util/EventTriggers",
                 "serviceCaseCreation/util/IdHelper","serviceCaseCreation/util/Constants",
                 "serviceCaseCreation/util/ServiceConfigConstants"], 
                                                   
                function(jQuery, Controller, Control, Formatter, Util, fragmentHelper, EventTriggers, IdHelper, ServiceConfigConstants) {
                
                var serviceCaseCreationAppController = Controller.extend("serviceCaseCreation.controller.App", {



			/**
			* Called when a controller is instantiated and its View controls (if available) are already created.
			* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
			* @memberOf serviceCaseCreation.controller.Main
			*/
                onInit: function() {

                                var oComponent = this.getOwnerComponent();
                                oComponent.getMetadata().selfReference = oComponent;
                                this.setGlobalModel(oComponent);
                },
                
                setGlobalModel : function(oComponent) {
                                
                },
                
			/**
			* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
			* (NOT before the first rendering! onInit() is used for that one!).
			* @memberOf serviceCaseCreation.controller.Main
			*/
                onBeforeRendering: function() {

                },

			/**
			* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
			* This hook is the same one that SAPUI5 controls get after being rendered.
			* @memberOf serviceCaseCreation.controller.Main
			*/
                onAfterRendering: function() {

                },

       });
                
                return serviceCaseCreationAppController;
                
      });
