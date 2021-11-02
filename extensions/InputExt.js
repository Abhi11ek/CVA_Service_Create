 /** ----------------------------------------------------------------------------------  *
* Modifications.                                                                       *
* -------------                                                                        *
* Ver.No    Date        Author  	  PCR No.           Description of change          *
* ------ ---------- ------------ ----------  ----------------------------------------- *
* V00    13/10/2016   Siva Prasad 
* 					Prachuri/Alok 		PCR012146				initial version
*                     (X087050)                                                        *
*                                                                                      *
* 
************************************************************************************/
jQuery.sap.require("sap.m.Input");

sap.m.Input.extend("serviceCaseCreation.extensions.InputExt", {
	
	renderer : {
	
	},
	
	onChange  : function(oControlEvent) {
		
		  if(this.getValue() === "")
	            this.setValueState(sap.ui.core.ValueState.Error);
	      else 
	            this.setValueState(sap.ui.core.ValueState.Success);
		
	},
	
	onAfterRendering : function() {
		
		sap.m.Input.prototype.onAfterRendering.apply(this);

	}
	
});