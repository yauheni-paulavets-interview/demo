//Restangular mock setup
import {
    MockBackend,
    MockConnection
} from '@angular/http/testing';

import { 
    ResponseOptions, 
    Response,
    Request,
    ConnectionBackend,
    RequestOptions,
    BaseRequestOptions,
    Http
} from '@angular/http';

import { 
    HttpHandler,
    HttpResponse,
    HttpErrorResponse
} from "@angular/common/http";

import { RestangularHttp } from 'ngx-restangular';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { 
    LocationDao
} from '../dao';

//Intersepting requests function
export function setupConnections(backend: MockBackend, options: any, urlPart: string) {
    backend.connections.subscribe((connection: MockConnection) => {
        //Looks like ngx-restangular doesn't use cached subject
        //To make it working - postpone the response
        setTimeout(function() {
            if (connection.request.url.indexOf(urlPart) > -1) {
                const responseOptions = new ResponseOptions(options);
                const response = new Response(responseOptions);
                connection.mockRespond(response);
            }
        }, 0);
    });
}

//Just to don't encumber the TestBed - moved out the providers config
export function getHttmpMockProviders(): any[] {
    return [
        LocationDao,
        {provide: ConnectionBackend, useClass: MockBackend, deps: []},
        {provide: RequestOptions, useClass: BaseRequestOptions, deps: []},
        {
          provide: RestangularHttp,
          useFactory: (http: HttpHandler) => {
              let restangularHttp = new RestangularHttp(http);

              //The thing is that original function provides HttpRequest, 
              //where Http.request expects Request
              restangularHttp.createRequest = function(options) {
                let request = new Request(options);
                return this.request(request);
              }
              restangularHttp.request = function(request) {

                //Restangular, underhood tries to invoke 'handle' method.
                return this.http.request(request)
                                .map(function (response) {

                                  //Again: Http provides Response, where restangular expects HttpResponse
                                  let res = new HttpResponse({
                                    body: response._body,
                                    headers: response.headers,
                                    status: response.status,
                                    url: response.url
                                  });

                                  if (!response.ok) {
                                        throw new HttpErrorResponse(res);
                                  }
                                  return res;
                                })
                                .map(function (response) {
                                  response.config = { params: request };
                                  return response;
                                }).catch(function (err) {
                                    err.request = request;
                                    err.data = err.error;
                                    return Observable.throw(err);
                                });
              }
              return restangularHttp;
          },
          deps: [HttpHandler]
        },
        {
          provide: HttpHandler,
          useFactory: (backendInstance: ConnectionBackend, defaultOptions: RequestOptions) => {
            return new Http(backendInstance, defaultOptions);
          },
          deps: [ConnectionBackend, RequestOptions]
        }
      ];
}