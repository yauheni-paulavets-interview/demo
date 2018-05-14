import { Restangular } from 'ngx-restangular';

import { Observable } from 'rxjs/Observable';
import { Subject }    from 'rxjs/Subject';
import { ReplaySubject } from 'rxjs/ReplaySubject';

//Handles rest based crud opearions
//Inherited by location/attachment services within the same dir
export abstract class Dao {

    protected newRecordsSource: Subject<any> = new Subject<any>();
    protected updateRecordsSource: Subject<any> = new Subject<any>();
    protected allRecordsSource: ReplaySubject<any[]> = new ReplaySubject<any[]>();
    protected deleteRecordsSource: Subject<any> = new Subject<any>();

    //Used bu spyOn within the related unit tests
    get getNewRecordsSource() {return this.newRecordsSource;}
    get getUpdateRecordsSource() {return this.updateRecordsSource;}
    get getAllRecordsSource() {return this.allRecordsSource;}
    get getDeleteRecordsSource() {return this.deleteRecordsSource;}

    //list/map components listen to the operations completion
    newRecords$ = this.newRecordsSource.asObservable();
    updateRecords$ = this.updateRecordsSource.asObservable();
    allRecords$ = this.allRecordsSource.asObservable();
    deleteRecords$ = this.deleteRecordsSource.asObservable();

    protected restLocator: string;

    constructor(protected restangular: Restangular) {}

    getAll(emit: boolean = false): Observable<any[]> {
        let allRecordsObservable = this.restangular.all(this.restLocator).getList();

        if (emit) {
            allRecordsObservable.subscribe((records) => this.emitAllRecords(records), () => console.log('Get all failed'));
        }
        return allRecordsObservable;
    }

    private emitAllRecords(allRecords: any[]) {
        this.allRecordsSource.next(allRecords);
    }

    insert(newRecord, emit: boolean = false): Observable<any> {
        let baseRecord = this.restangular.all(this.restLocator);

        let newRecordObservable = baseRecord.post(newRecord);
        if (emit) {
            newRecordObservable.subscribe((record) => this.emitNewRecord(record), () => console.log('Insert failed', newRecord));
        }

        return newRecordObservable;
    }

    protected emitNewRecord(newRecord) {
        this.newRecordsSource.next(newRecord);
    }

    update(updatedRecord, emit: boolean = false): Observable<any> {
        let updateRecordObservable;

        if (updatedRecord.put) {
            updateRecordObservable = updatedRecord.put();
        } else {
            let baseRecord = this.restangular.one(this.restLocator, updatedRecord.Id);
            updateRecordObservable = baseRecord.put();
        }
        
        if (emit) {
            updateRecordObservable.subscribe((updatedRecord) => this.emitUpdateRecord(updatedRecord), () => console.log('Update failed', updatedRecord));
        }

        return updateRecordObservable;
    }

    private emitUpdateRecord(updatedRecord) {
        this.updateRecordsSource.next(updatedRecord);
    }

    delete(recordToBeDeleted, emit: boolean = false): Observable<any> {
        let deleteRecordObservable;
        if (recordToBeDeleted.remove)
        {
            deleteRecordObservable = recordToBeDeleted.remove();
        } else {
            let baseRecord = this.restangular.one(this.restLocator, recordToBeDeleted.Id);
            deleteRecordObservable = baseRecord.remove();
        }

        if (emit) {
            deleteRecordObservable.subscribe(() => this.emitDeleteRecord(recordToBeDeleted.Id), () => console.log('Deletion failed', recordToBeDeleted));
        }

        return deleteRecordObservable;
    }

    private emitDeleteRecord(deletedRecordId) {
        this.deleteRecordsSource.next(deletedRecordId);
    }
}