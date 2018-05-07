export class LocationsMock {
    public static getAll(): any[] {
        return [{
            Id: "1",
            name__c: "Minsk",
            coordinates__Latitude__s: 53.9,
            coordinates__Longitude__s: 27.56667,
            comment__c: "Minsk"
        },
        {
            Id: "2",
            name__c: "Gomel",
            coordinates__Latitude__s: 52.4412,
            coordinates__Longitude__s: 30.9878
        },
        {
            Id: "3",
            name__c: "Grodno",
            coordinates__Latitude__s: 53.6694,
            coordinates__Longitude__s: 23.8131
        },
        {
            Id: "4",
            name__c: "Orsha",
            coordinates__Latitude__s: 53.9,
            coordinates__Longitude__s: 27.56667
        }];
    }

    public static insertUpdate(): any {
        return {
            Id: "1",
            name__c: "Minsk",
            coordinates__Latitude__s: 53.9,
            coordinates__Longitude__s: 27.56667,
            comment__c: "Minsk"
        };
    }
}