import {
  async,
  getTestBed,
  TestBed,
  inject,
  tick,
  fakeAsync
} from '@angular/core/testing';

import { ConnectionBackend } from '@angular/http';

import { RestangularModule } from 'ngx-restangular';
import { RestangularConfigFactory } from './../configs';

import { LocationDao } from './location.service';

import { baseURL } from '../constants/baseurl';

import { 
  getHttmpMockProviders,
  setupConnections,
  LocationsMock
} from './../mocks';


describe('LocationDao', () => {

  beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [
          RestangularModule.forRoot(RestangularConfigFactory)
        ],
        providers: getHttmpMockProviders()
      });
  }));

  describe('Get all', () => {

      it('ON SUCCESS: should return the list of locations; notify observers;', fakeAsync(inject([LocationDao, ConnectionBackend], (locationDao, mockBackend) => {
          setupConnections(
            mockBackend, 
            {
                body: LocationsMock.getAll(),
                status: 200
            },
            baseURL + '/location'
          );

          spyOn(locationDao.allRecordsSource, 'next');

          locationDao.getAll(true).subscribe((locations) => {
            expect(locations.length).toBe(LocationsMock.getAll().length);
          });

          tick();

          expect(locationDao.allRecordsSource.next).toHaveBeenCalled();
      })));

      it('ON FAILURE: should log an error;', fakeAsync(inject([LocationDao, ConnectionBackend], (locationDao, mockBackend) => {
        setupConnections(
          mockBackend, 
          {
              body: LocationsMock.getAll(),
              status: 500
          },
          baseURL + '/location'
        );

        spyOn(console, 'log');

        locationDao.getAll(true);

        tick();

        expect(console.log).toHaveBeenCalledWith('Get all failed');
    })));
  });

  describe('Insert', () => {

      it('ON SUCCESS: should return the location; notify observers;', fakeAsync(inject([LocationDao, ConnectionBackend], (locationDao, mockBackend) => {
          setupConnections(
            mockBackend, 
            {
                body: LocationsMock.insertUpdate(),
                status: 200
            },
            baseURL + '/location'
          );

          spyOn(locationDao.newRecordsSource, 'next');

          locationDao.insert(LocationsMock.insertUpdate(), true).subscribe((location) => {
            expect(location).toEqual(jasmine.objectContaining(LocationsMock.insertUpdate()));
          });

          tick();

          expect(locationDao.newRecordsSource.next).toHaveBeenCalled();
      })));

      it('ON FAILURE: should log an error;', fakeAsync(inject([LocationDao, ConnectionBackend], (locationDao, mockBackend) => {
        setupConnections(
          mockBackend, 
          {
              body: LocationsMock.insertUpdate(),
              status: 500
          },
          baseURL + '/location'
        );

        spyOn(console, 'log');

        locationDao.insert(LocationsMock.insertUpdate(), true);

        tick();

        expect(console.log).toHaveBeenCalled();
      })));
  });

  describe('Update', () => {

      it('ON SUCCESS: should return the location; notify observers;', fakeAsync(inject([LocationDao, ConnectionBackend], (locationDao, mockBackend) => {
          setupConnections(
            mockBackend, 
            {
                body: LocationsMock.insertUpdate(),
                status: 200
            },
            baseURL + '/location'
          );

          spyOn(locationDao.updateRecordsSource, 'next');

          locationDao.update(LocationsMock.insertUpdate(), true).subscribe((location) => {
            expect(location).toEqual(jasmine.objectContaining(LocationsMock.insertUpdate()));
          });

          tick();

          expect(locationDao.updateRecordsSource.next).toHaveBeenCalled();
          
      })));

      it('ON FAILURE: should log an error;', fakeAsync(inject([LocationDao, ConnectionBackend], (locationDao, mockBackend) => {
        setupConnections(
          mockBackend, 
          {
              body: LocationsMock.insertUpdate(),
              status: 500
          },
          baseURL + '/location'
        );

        spyOn(console, 'log');

        locationDao.update(LocationsMock.insertUpdate(), true);

        tick();

        expect(console.log).toHaveBeenCalled();
      })));
  });

  describe('Delete', () => {

    it('ON SUCCESS: should notify observers;', fakeAsync(inject([LocationDao, ConnectionBackend], (locationDao, mockBackend) => {
        setupConnections(
          mockBackend, 
          {
              body: LocationsMock.insertUpdate(),
              status: 200
          },
          baseURL + '/location'
        );

        spyOn(locationDao.deleteRecordsSource, 'next');

        locationDao.delete(LocationsMock.insertUpdate(), true);

        tick();

        expect(locationDao.deleteRecordsSource.next).toHaveBeenCalled();

    })));

    it('ON FAILURE: should log an error;', fakeAsync(inject([LocationDao, ConnectionBackend], (locationDao, mockBackend) => {
      setupConnections(
        mockBackend, 
        {
            body: LocationsMock.insertUpdate(),
            status: 500
        },
        baseURL + '/location'
      );

      spyOn(console, 'log');

      locationDao.delete(LocationsMock.insertUpdate(), true);

      tick();

      expect(console.log).toHaveBeenCalled();
    })));
  });
});