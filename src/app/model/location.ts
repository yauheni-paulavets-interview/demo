//The underscores are Salesforce specific as well.
export class Location {
    Id: string;
    name__c: string;
    comment__c: string;
    coordinates__Longitude__s: number;
    coordinates__Latitude__s: number;
    attributes;

    constructor(name, lng, lat) {

        //Salesforce specific.
        this.attributes = {
            type: 'Location__c'
        };
        this.name__c = name;
        this.coordinates__Longitude__s = lng;
        this.coordinates__Latitude__s = lat;
    }
}