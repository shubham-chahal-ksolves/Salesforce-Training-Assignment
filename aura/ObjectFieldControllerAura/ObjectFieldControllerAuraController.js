({
    doInit: function(component, event, helper) {
        helper.fetchObjectList(component);
    },

    handleObjectChange: function(component, event, helper) {
        var selectedObject = event.getSource().get("v.value");
        component.set("v.selectedObject", selectedObject);
        if (selectedObject) {
            component.set("v.isObjectSelected", true);
            helper.fetchFieldList(component, selectedObject);
        }
    },

    handleFieldChange: function(component, event, helper) {
        component.set("v.selectedFields", event.getParam("value"));
    },

    handleLimitChange: function(component, event, helper) {
        component.set("v.limit", event.getSource().get("v.value"));
    },

    fetchResults: function(component, event, helper) {
        helper.constructAndExecuteQuery(component);
    }
})