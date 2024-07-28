import { LightningElement, track, wire } from 'lwc';
import getObjectList from '@salesforce/apex/ObjectFieldController.getObjectList';
import getFieldList from '@salesforce/apex/ObjectFieldController.getFieldList';
import executeQuery from '@salesforce/apex/ObjectFieldController.executeQuery';

export default class ObjectFieldController extends LightningElement {
    @track objectOptions = [];
    @track fieldOptions = [];
    @track selectedObject = '';
    @track selectedFields = [];
    @track limit = '';
    @track query = '';
    @track recordData; 
    @track columns = [];
    @track isObjectSelected = false;

    // Wire service to fetch the list of SObjects from Apex controller
    @wire(getObjectList)
    wiredObjectList({ error, data }) {
        if (data) {
            this.objectOptions = data.map(object => {
                return { label: object.label, value: object.apiName };
            });
        } else if (error) {
            console.error(error);
        }
    }

    // Handle the change event when an SObject is selected
    handleObjectChange(event) {
        this.selectedObject = event.target.value;
        if (this.selectedObject) {
            this.isObjectSelected = true;
            getFieldList({ objectName: this.selectedObject })
                .then(data => {
                    this.fieldOptions = data.map(field => {
                        return { label: field.label, value: field.apiName };
                    });
                })
                .catch(error => {
                    console.error(error);
                });
        }
    }

    handleFieldChange(event) {
        this.selectedFields = event.detail.value;
    }

    handleLimitChange(event) {
        this.limit = event.target.value;
    }y

    // Construct and execute the SOQL query based on user selections
    fetchResults() {
        const fieldApiNames = this.fieldOptions
            .filter(option => this.selectedFields.includes(option.value))
            .map(option => option.value);

        this.query = `SELECT ${fieldApiNames.join(', ')} FROM ${this.selectedObject}`;
        if (this.limit) {
            this.query += ` LIMIT ${this.limit}`;
        }
        executeQuery({ query: this.query })
            .then(data => {
                this.recordData = data;
                this.columns = this.selectedFields.map(field => {
                    const fieldOption = this.fieldOptions.find(option => option.value === field);
                    return { label: fieldOption ? fieldOption.label : field, fieldName: field };
                });
            })
            .catch(error => {
                console.error(error);
            });
    }
}