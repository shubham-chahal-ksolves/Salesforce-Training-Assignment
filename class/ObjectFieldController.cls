/**
 * Description: This class provides methods to fetch object,field metadata and query the object and fields.
 * Author: Ksolves
 * CreatedDate: 25-07-2024
 * LastModifiedBy: Shubham Chahal
 * ModifiedDate: 25-07-2024
 */

 public with sharing class ObjectFieldController {
    
    /**
     * This method retrieves a list of all available SObject types in the Salesforce org.
     *
     * @return List<String> A list of SObject type names.
     */
    @AuraEnabled(cacheable=true)
    public static List<Map<String, String>> getObjectList() {
        List<Map<String, String>> objects = new List<Map<String, String>>();
        for (Schema.SObjectType objType : Schema.getGlobalDescribe().Values()) {
            Map<String, String> objectInfo = new Map<String, String>();
            Schema.DescribeSObjectResult describeResult = objType.getDescribe();
            objectInfo.put('label', describeResult.getLabel());
            objectInfo.put('apiName', describeResult.getName());
            objects.add(objectInfo);
        }
        return objects;
    }

    /**
     * This method retrieves a list of all fields for a given SObject type.
     *
     * @param objectName The API name of the SObject type for which to fetch field names.
     * @return List<String> A list of field names for the specified SObject type.
     */
    @AuraEnabled(cacheable=true)
    public static List<Map<String, String>> getFieldList(String objectName) {
        List<Map<String, String>> fields = new List<Map<String, String>>();
        Map<String, Schema.SObjectField> fieldMap = Schema.getGlobalDescribe().get(objectName).getDescribe().fields.getMap();
        for (String fieldName : fieldMap.keySet()) {
            Map<String, String> fieldInfo = new Map<String, String>();
            Schema.DescribeFieldResult fieldDescribe = fieldMap.get(fieldName).getDescribe();
            fieldInfo.put('label', fieldDescribe.getLabel());
            fieldInfo.put('apiName', fieldDescribe.getName());
            fields.add(fieldInfo);
        }
        return fields;
    }
   
    /**
     * This method executes a given SOQL query and returns the results as a list of maps,
     * where each map represents a record with field names as keys and field values as values.
     *
     * @param query The SOQL query to execute.
     * @return List<Map<String, Object>> A list of maps, each containing field names and values for a record.
     */
    @AuraEnabled
    public static List<SObject> executeQuery(String query) {
        System.debug('query2::'+query);
            List<SObject> records = Database.query(query);
            System.debug('records3:::'+records);
            return records;
    }
   
}