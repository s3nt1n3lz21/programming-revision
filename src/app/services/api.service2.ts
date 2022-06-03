import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { IJobProfile } from '../model/IJobProfile';
import { IReportMapping } from '../model/IReportMapping';
import { IReportMappingAPIResponse } from '../model/IReportMappingAPIResponse';
import { IReportMappingDetail } from '../model/IReportMappingDetail';
import { IReportMappingDetailAPIResponse } from '../model/IReportMappingDetailAPIResponse';
import { IReportTemplate } from '../model/IReportTemplate';
import { LoggerService } from './logger.service';
import { NotificationService } from './notification.service';

@Injectable({
	providedIn: 'root'
})
export class ApiService {

	constructor(
    private readonly _http: HttpClient,
    private readonly _logger: LoggerService,
    private readonly _notificationService: NotificationService
	) {}

	getReportMappings(): Observable<IReportMappingAPIResponse[]> {
		return this._http.get<IReportMappingAPIResponse[]>('/v1/ReportMappings')
			.pipe(
				catchError((err) => {
					this._notificationService.addNotification('Failed To Load Report Mappings', 'error');
					this._logger.logException(err);
					return throwError(err);    // Rethrow it back to component
				}));
	}

	getReportMappingDetails(reportMapping: IReportMapping): Observable<IReportMappingDetailAPIResponse> {
		return this._http.get<IReportMappingDetailAPIResponse>(
			'/v1/ReportMappings/'+
          reportMapping.jobProfileId +'/'+
          reportMapping.jobProfileMajorVersion +'/'+
          reportMapping.reportTemplateId +'/'+
          reportMapping.reportTemplateMajorVersion
		).pipe(
			// Fallback DisplayNames to Key
			map(
				(reportMappingDetails) => {
					reportMappingDetails.groups.forEach(
						(group) => {
							if (!group.displayName) {
								group.displayName = group.key;
							}
							group.parameters.forEach(
								(parameter) => {
									if (!parameter.displayName) {
										parameter.displayName = parameter.key;
									}
								}
							);
						}
					);
					return reportMappingDetails;
				}
			),
			catchError(
				(err) => {
					this._notificationService.addNotification('Failed To Load Report Mapping Details', 'error');
					this._logger.logException(err);
					return throwError(err);    // Rethrow it back to component
				}
			)
		);
	}

	getJobProfiles(): Observable<IJobProfile[]> {
		return this._http.get<IJobProfile[]>('/v1/JobProfiles')
			.pipe(
				catchError((err) => {
					this._notificationService.addNotification('Failed To Load Job Profiles', 'error');
					this._logger.logException(err);
					return throwError(err);    // Rethrow it back to component
				}));
	}

	getReportTemplates(): Observable<IReportTemplate[]> {
		return this._http.get<IReportTemplate[]>('/v1/ReportTemplates')
			.pipe(
				catchError((err) => {
					this._notificationService.addNotification('Failed To Load Report Templates', 'error');
					this._logger.logException(err);
					return throwError(err);    // Rethrow it back to component
				}));
	}

	addReportMapping(reportMapping: IReportMapping): Observable<IReportMappingAPIResponse> {
		return this._http.post<IReportMappingAPIResponse>('/v1/ReportMappings',
			{
				JobProfileId: reportMapping.jobProfileId,
				JobProfileMajorVersion: reportMapping.jobProfileMajorVersion,
				ReportTemplateId: reportMapping.reportTemplateId,
				ReportTemplateMajorVersion: reportMapping.reportTemplateMajorVersion
			}
		).pipe(
			tap(() => this._notificationService.addNotification('Report Mapping Created', 'success')),
			catchError((err) => {
				if (err.status === 409) {
					this._notificationService.addNotification('Report Mapping Already Exists', 'error');
				} else {
					this._notificationService.addNotification('Failed To Create Report Mapping', 'error');
				}
				this._logger.logException(err);
				return throwError(err);
			}));
	}

	deleteReportMapping(reportMapping: IReportMapping): Observable<Object> {
		return this._http.delete(
			'/v1/ReportMappings/'+
          reportMapping.jobProfileId +'/'+
          reportMapping.jobProfileMajorVersion +'/'+
          reportMapping.reportTemplateId +'/'+
          reportMapping.reportTemplateMajorVersion
		).pipe(
			tap(() => this._notificationService.addNotification('Report Mapping Deleted', 'success')),
			catchError((err) => {
				this._notificationService.addNotification('Failed To Delete Report Mapping', 'error');
				this._logger.logException(err);
				return throwError(err);    // Rethrow it back to component
			}));
	}

	updateReportMapping(reportMapping: IReportMappingDetail) {
		return this._http.put(
			'/v1/ReportMappings/'+
          reportMapping.jobProfileId +'/'+
          reportMapping.jobProfileMajorVersion +'/'+
          reportMapping.reportTemplateId +'/'+
          reportMapping.reportTemplateMajorVersion
			,
			reportMapping
		).pipe(
			tap(() => this._notificationService.addNotification('Report Mapping Updated', 'success')),
			catchError((err) => {
				this._notificationService.addNotification('Failed To Update Report Mapping', 'error');
				this._logger.logException(err);
				return throwError(err);    // Rethrow it back to component
			}));
	}

	activateReportMapping(reportMapping: IReportMapping) {
		return this._http.post('/v1/ReportMappings/'+
      reportMapping.jobProfileId +'/'+
      reportMapping.jobProfileMajorVersion +'/'+
      reportMapping.reportTemplateId +'/'+
      reportMapping.reportTemplateMajorVersion + '/activate',
		null
		).pipe(
			tap(() => this._notificationService.addNotification('Activated Report Mapping', 'success')),
			catchError((err) => {
				this._notificationService.addNotification('Failed To Activate Report Mapping', 'error');
				this._logger.logException(err);
				return throwError(err);
			})
		);
	}

	deactivateReportMapping(reportMapping: IReportMapping) {
		return this._http.post('/v1/ReportMappings/'+
      reportMapping.jobProfileId +'/'+
      reportMapping.jobProfileMajorVersion +'/'+
      reportMapping.reportTemplateId +'/'+
      reportMapping.reportTemplateMajorVersion + '/deactivate',
		null
		).pipe(
			tap(() => this._notificationService.addNotification('Deactivated Report Mapping', 'success')),
			catchError((err) => {
				this._notificationService.addNotification('Failed To Deactivate Report Mapping', 'error');
				this._logger.logException(err);
				return throwError(err);
			})
		);
	}

	// getAvailableCultures(): Observable<string[]> {
	//   return this.http.get<string[]>('/v1/AvailableCultures')
	//   .pipe(catchError((err) => {
	//     this._notificationService.addNotification('Failed To Load Available Cultures', 'error');
	//     this.logger.logException(err);
	//     return throwError(err);    // Rethrow it back to component
	//   }));
	// }
}
