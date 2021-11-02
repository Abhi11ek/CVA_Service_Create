/** * This class holds all methods to make changes in busy dialog controls.
 * @class 
 * @public
 * @author Vimal Pandu
 * @since 31 January 2018
 * @extends sap.m.BusyDialog.extend
 * @name serviceCaseConfirmation.extensions.BusyDialog
 */

jQuery.sap.require("sap.m.BusyDialog");

sap.m.BusyDialog.extend("serviceCaseCreation.extensions.BusyDialogExt", {
	
	 /**
     * This method re-renders the given control.
     * @name rerender
     * @param 	 
     * @returns 
     */
	renderer : {
	
	},
	
	constructor : function() {
		
		sap.m.BusyDialog.prototype.constructor.apply(this, arguments);
		this.attachEvent("onkeydown", function(e) {
			if(e.keyCode === 27){
				e.preventDefault();
				e.stopPropagation()
			}
		});
		
	},
	
	/**
     * This method helps in preventing busy dialog from closing.
     * @name close
     * @param 
     * @returns 
     */
	close : function() {
		
		return;
		
	},
	
	/**
     * This method helps in creating the prototype of the given control.
     * @name onAfterRendering
     * @param 
     * @returns 
     */
	onAfterRendering : function() {
		
		sap.m.BusyDialog.prototype.onAfterRendering.apply(this);

	}
	
});