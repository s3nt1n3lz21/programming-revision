import {HttpClientTestingModule, HttpTestingController,} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {LoggerService} from './logger.service';
import {LoggerServiceStub} from 'src/testing/stubs';
import { createReportMapping, IReportMapping } from '../model/IReportMapping';
import { ApiService } from './api.service';
import { createPropertyGroup } from '../model/IPropertyGroup';
import { createPropertyMapping } from '../model/IPropertyMapping';
import { createReportMappingDetail, IReportMappingDetail } from '../model/IReportMappingDetail';

xdescribe('ReportMappingsService', () => {
  let service: ApiService;
  let httpTestingController: HttpTestingController;
  let loggerServiceMock: LoggerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ApiService,
        {provide: LoggerService, useValue: new LoggerServiceStub()}
      ]
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(ApiService);
    loggerServiceMock = TestBed.inject(LoggerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  xdescribe('getReportMappings', function () {
    it('should be called with the correct url', async () => {
      const call = service.getReportMappings().toPromise();
      const request = httpTestingController.expectOne('/v1/ReportMappings');

      request.flush(null);
      await call;

      httpTestingController.verify();
      expect(request.request.method).toBe('GET');
    });

    xdescribe('error', () => {
      const getReportMappingsErrorTestCases = [
        {status: 400, statusText: 'Bad Request'},
        {status: 403, statusText: 'Forbidden'},
        {status: 500, statusText: 'Server Error'}
      ];
      getReportMappingsErrorTestCases.forEach((testCase) => {
        it(`should log message and throw exception on ${testCase.status} error`, async () => {
          const mockErrorResponse = testCase;
          const call = service.getReportMappings().toPromise();
          spyOn(loggerServiceMock, 'logException');
          const request = httpTestingController.expectOne('/v1/ReportMappings');

          try {
            request.flush(null, mockErrorResponse);
            await call;
          } catch (error: any) {
            httpTestingController.verify();
            expect(error).toEqual(jasmine.objectContaining(mockErrorResponse));
            expect(request.request.method).toBe('GET');
            // Expect exception to have been logged
            expect(loggerServiceMock.logException).toHaveBeenCalled();
          }
        });
      });
    });

    it('should return list of Report Mappings', async () => {
      const reportMappings: IReportMapping[] = [createReportMapping(), createReportMapping()];
      const call = service.getReportMappings().toPromise();
      const request = httpTestingController.expectOne('/v1/ReportMappings');

      request.flush(reportMappings);
      const result = await call;

      httpTestingController.verify();
      expect(result).toEqual(reportMappings);
    });
  });

  xdescribe('getReportMappingDetail', () => {
    it('should be called with the correct parameters', async () => {
      const reportMapping = createReportMapping();
      const call = service.getReportMappingDetails(reportMapping).toPromise();
      const request = httpTestingController.expectOne(
        `/v1/ReportMappings/${reportMapping.jobProfileId}/${reportMapping.jobProfileMajorVersion}/${reportMapping.reportTemplateId}/${reportMapping.reportTemplateMajorVersion}`
      );

      request.flush(null);
      await call;

      expect(request.request.method).toBe('GET');
      httpTestingController.verify();
    });

    it('should return expected value', async () => {
      const reportMapping = createReportMappingDetail(
        {propertyGroups: [
          createPropertyGroup({
            subitems: [createPropertyMapping(), createPropertyMapping({name: 'Another Parameter', value: 'Some Value'})]
          })
        ]}
      );

      const call: Promise<IReportMappingDetail> = service.getReportMappingDetails(reportMapping).toPromise();
      const request = httpTestingController.expectOne(
        `/v1/ReportMappings/${reportMapping.jobProfileId}/${reportMapping.jobProfileMajorVersion}/${reportMapping.reportTemplateId}/${reportMapping.reportTemplateMajorVersion}`
      );
      request.flush(reportMapping);

      const result = await call;

      httpTestingController.verify();
      await expect(result).toEqual(reportMapping);
    });
  });
});
