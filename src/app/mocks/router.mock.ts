import { NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs/Subject';

export class MockRouter {

    public static id: number = 0;

    private _eventsSubject: Subject<any> = new Subject<any>();
    
    public events = this._eventsSubject.asObservable();

    public navigateByUrl(pathPart: string) {
        const navigationEnd: NavigationEnd = new NavigationEnd(MockRouter.id++, pathPart, pathPart);
        this._eventsSubject.next(navigationEnd);
    }
}