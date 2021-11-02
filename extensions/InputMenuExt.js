/**
 * This class holds all methods to make changes in input custom control.
 * @class 
 * @public
 * @author Vimal Pandu
 * @since 21 Nov 2018
 * @extends sap.m.core.Control
 * @name serviceCaseCreation.extensions.InputMenuExt
 ************************************************************************
 *  Date        Author    PCR No.          Description of change        *
 ************ ********  **********   ************************************
 * 11/19/2019  Vimal 	PCR020942	 KA Project changes 				* 
 * 			   Pandu 													*
 ************************************************************************/

sap.ui.define([
	"sap/ui/core/Control",
	"sap/m/Input",
	"sap/m/Button",
	"sap/m/ResponsivePopover",
	"sap/m/List",
	"sap/m/CustomListItem",
	"sap/m/StandardListItem",
	"sap/ui/Device",
	"sap/m/Link",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/ListMode",
	"sap/m/ScrollContainer"
], function(Control, Input, Button, ResponsivePopover, List, CustomListItem, StandardListItem, Device, Link, Filter,
	FilterOperator, ListMode, ScrollContainer) {
	"use strict";

	var that = this;
	return Control.extend("serviceCaseCreation.extensions.InputMenuExt", {
		metadata: {
			properties: {
				parentKey: {
					type: "String"
				},
				parentItemsPath: {
					type: "String"
				},
				parentPopupHeader: {
					type: "String"
				},
				chidItemsPath: {
					type: "String"
				},
				childPopupHeader: {
					type: "String"
				},
				arrParentFilers: {
					type: "Array"
				},
				arrChildFilters: {
					type: "Array"
				},
				placeholder: {
					type: "String"
				}
			},
			aggregations: {
				content: {
					type: "sap.ui.core.Control"
				},
				_input: {
					type: "sap.m.Input",
					multiple: false,
					visibility: "hidden",
					value: "Vimal"
				},
				_button: {
					type: "sap.m.Button",
					multiple: false,
					visibility: "hidden"
				},
				_cancel: {
					type: "sap.m.Button",
					multiple: false,
					visibility: "hidden"
				}
			},
			events: {
				setChildElementKey: {
					enablePreventDefault: true
				},
				setParentElementKey: {
					enablePreventDefault: true
				}
			},
			defaultAggregation: "content"
		},

		/**
		 * This method helps in initializing InputMenuExt.
		 * @name init
		 */
		init: function() {
			that = this;
			
			this.setAggregation("_input", new Input({
				width: "calc(100% - 6rem)",
				valueHelpOnly: true,
				showValueHelp: true,
				valueHelpRequest: this.onValueHelpRequest.bind(this)
			}, true).addStyleClass("inputMenuStyle"));
			
			this.setAggregation("_cancel", new Button({
				width: "3rem",
				icon: "sap-icon://sys-cancel",
				type: "Transparent",
				press: this.onPressClearButton.bind(this)
			}, true).addStyleClass("inputMenuStyleBtn").addStyleClass("inputMenuCancelStyleBtn"));
			
			this.setAggregation("_button", new Button({
				width: "3rem",
				icon: "sap-icon://slim-arrow-down",
				type: "Transparent",
				press: this.onValueHelpRequest.bind(this)
			}).addStyleClass("inputMenuStyleBtn"), true);

			var libraryPath = jQuery.sap.getModulePath("serviceCaseCreation");
			jQuery.sap.includeStyleSheet(libraryPath + "/css/styles.css");
		},

		/**
		 * This method re-renders the given control.
		 * @name rerender
		 * @param {Object} oRM - render object
		 * @param {Object} oControl - InputMentExt ref
		 */
		renderer: function(oRM, oControl) {
			oRM.write("<div");
			oRM.writeControlData(oControl);
			oRM.addClass("inputMenuBorder");
			oRM.writeClasses();
			oRM.write(">");
			oRM.renderControl(oControl.getAggregation("_input").setPlaceholder(oControl.getPlaceholder()));
			oRM.renderControl(oControl.getAggregation("_button"));
			oRM.renderControl(oControl.getAggregation("_cancel"));
			oRM.write("</div>");
		},

		/**
		 * This method clears the value and parent key of the InputMenuExt.
		 * @name onPressClearButton
		 */
		onPressClearButton: function() {
			this.getAggregation("_input").setValue("");
			this.setParentKey("");
			this.removeStyleClass("inputMenuBorder");
			this.addStyleClass("inputMenuValueStateError");
			
			this.fireSetParentElementKey({
				oParent: {}
			});
		},

		/**
		 * Value Help Request handler of the InputMenuExt,
		 * which helps in opening the required popups to
		 * display the corresponding values.
		 * @name onValueHelpRequest
		 * @param {Object} oEvent - Value help request event
		 */
		onValueHelpRequest: function(oEvent) {
			that = oEvent.getSource().getParent();
		
			if (!this._oParentPopup) {
				this._oParentPopup = "";
			}

			//Link Aggregation in Parent Pop-up for click events
			var oParentCustomListLink = new Link({
				text: "{KeyValue1}",
				width: "100%",

				//Link Aggregation Press event to open child popover
				press: function(oLinkPressEvent) {
					var oLink = oLinkPressEvent.getSource() || oLinkPressEvent,
						oParentModelObj = oLink.getBindingContext().getObject();
					
					//List in the child popover
					var oChildList = new List({
						mode: ListMode.SingleSelectMaster,
						width: "100%",
						items: {
							path: that.getChidItemsPath(),
							template: new StandardListItem({
								title: "{KeyValue1}"
							}).addStyleClass("menuPopOverStandardList")
						},
						selectionChange: function(oListSelChangeEvent) {
							var oChildModelObj = oListSelChangeEvent.getSource().getSelectedItem().getBindingContext().getObject();

							that.getAggregation("_input").setValue(oParentModelObj.KeyValue1);
							that.fireSetChildElementKey({
								oParent: oParentModelObj,
								oChild: oChildModelObj
							});

							if (that._oParentPopup) {
								that._oParentPopup.close();
								that._oParentPopup = "";
							}

							if (that._oChildPopup) {
								that._oChildPopup.close();
								that._oChildPopup = "";
							}
						}
					});

					that.setParentKey(oParentModelObj.GuidKey);
					that.getAggregation("_input").setValue(oParentModelObj.KeyValue1);
					that.removeStyleClass("inputMenuValueStateError");
					that.addStyleClass("inputMenuBorder");
					that.fireSetParentElementKey({
						oParent: oParentModelObj
					});
					
					var oChildScrollCont = new ScrollContainer({
						width: "100%",
						vertical: true,
						focusable: true,
						content: oChildList
					});

					//Initializing child popover
					that._oChildPopup = new ResponsivePopover({
						showHeader: Device.system.phone,
						placement: "PreferredRightOrFlip",
						contentWidth: "auto",
						contentHeight: Device.system.phone ? "auto" : "19rem",
						title: that.getChildPopupHeader(),

						afterClose: function() {
							if (that._oChildPopup) {
								that._oChildPopup.close();
								that._oChildPopup = "";
								
								that.fireSetParentElementKey({
									oParent: (!that.getAggregation("_input").getValue()) ? {} : {
										KeyValue1: that.getAggregation("_input").getValue(),
										GuidKey: that.getParentKey()
									}
								});
							}
						}.bind(that),

						content: oChildScrollCont
					}).addStyleClass(Device.system.phone ? "" : "inputMenuPopoverHeight");
					
					if (Device.system.phone) {
						that._oChildPopup.setEndButton(new Button({
							width: "auto",
							type: "Transparent",
							text: "OK",
							press: function() {
								if (that._oChildPopup) {
									that._oChildPopup.fireAfterClose();
								}
							}.bind(that)
						}));
					}

					//Opening child popover and filtering its list bindings
					that._oChildPopup.setModel(that.getModel());
					var aChildFil = that.getArrChildFilters();
					var oChildFilters;
					
					if (aChildFil) {
						if (aChildFil.length) {
							oChildFilters = new Filter({
								filters: aChildFil,
								and: true
							});
						}
					}

					oChildList.getBinding("items").filter(oChildFilters);
					
					oChildScrollCont.setHeight(oChildList.getItems().length > 10 ? "25rem" : "auto");

					//Opening child popover by its parent aggregation i.e., link
					that._oChildPopup.openBy(this);
				}
			}).addStyleClass("sapUiTinyMarginBegin").addStyleClass("menuPopOverLinkStyle");

			//Initializing the list in parent pop-over
			var oParentList = new List({
				mode: ListMode.SingleSelectMaster,
				width: "100%",
				items: {
					path: this.getParentItemsPath(),
					template: new CustomListItem({
						width: "100%",
						type: "Navigation",
						content: oParentCustomListLink
					}).addStyleClass("menuPopOverStandardList").addStyleClass("sapUiSizeCompact")
				}
			});
			
			var oParentScrollCont = new ScrollContainer({
				width: "100%",
				vertical: true,
				focusable: true,
				content: oParentList
			});

			//Initializing parent pop-over
			this._oParentPopup = new ResponsivePopover({
				showHeader: Device.system.phone ? true : false,
				placement: "VerticalPreferredBottom",
				showArrow: false,
				contentWidth: "36.9%",
				contentHeight: Device.system.phone ? "auto" : "19rem",
				title: this.getParentPopupHeader(),
				afterClose: function() {
					if (this._oParentPopup) {
						this._oParentPopup.close();
						this._oParentPopup = "";
					}
				}.bind(this),
				content: oParentScrollCont
			}).addStyleClass(Device.system.phone ? "" : "inputMenuPopoverHeight");
			
			if (Device.system.phone) {
				this._oParentPopup.setEndButton(new Button({
					width: "auto",
					type: "Transparent",
					text: "OK",
					press: function() {
						if (this._oParentPopup) {
							this._oParentPopup.fireAfterClose();
						}
					}.bind(this)
				}));
			}

			this._oParentPopup.setModel(oEvent.getSource().getModel());
			var arrParentFil = this.getArrParentFilers();

			if (arrParentFil) {
				if (arrParentFil.length) {
					oParentList.getBinding("items").filter((arrParentFil.length) ? arrParentFil : []);
				}
			}
			
			oParentScrollCont.setHeight(oParentList.getItems().length > 10 ? "25rem" : "auto");

			//opening parent popover with reference to input aggregation
			this._oParentPopup.openBy(this);
		}

	});

});