({
    fetchObjectList: function(component) {
        var action = component.get("c.getObjectList");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var data = response.getReturnValue();
                var options = data.map(function(object) {
                    return { label: object.label, value: object.apiName };
                });
                component.set("v.objectOptions", options);
            } else {
                console.error(response.getError());
            }
        });
        $A.enqueueAction(action);
    },

    fetchFieldList: function(component, selectedObject) {
        var action = component.get("c.getFieldList");
        action.setParams({ objectName: selectedObject });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var data = response.getReturnValue();
                var options = data.map(function(field) {
                    return { label: field.label, value: field.apiName };
                });
                component.set("v.fieldOptions", options);
            } else {
                console.error(response.getError());
            }
        });
        $A.enqueueAction(action);
    },

    constructAndExecuteQuery: function(component) {
        var selectedFields = component.get("v.selectedFields");
        var selectedObject = component.get("v.selectedObject");
        var limit = component.get("v.limit");

        var fieldApiNames = selectedFields.join(', ');
        var query = `SELECT ${fieldApiNames} FROM ${selectedObject}`;
        if (limit) {
            query += ` LIMIT ${limit}`;
        }
        component.set("v.query", query);

        var action = component.get("c.executeQuery");
        action.setParams({ query: query });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var data = response.getReturnValue();
                component.set("v.recordData", data);
                var columns = selectedFields.map(function(field) {
                    var fieldOption = component.get("v.fieldOptions").find(function(option) {
                        return option.value === field;
                    });
                    return { label: fieldOption ? fieldOption.label : field, fieldName: field };
                });
                component.set("v.columns", columns);
            } else {
                console.error(response.getError());
            }
        });
        $A.enqueueAction(action);
    }
})