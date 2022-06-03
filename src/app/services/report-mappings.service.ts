import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { ApiService } from './api.service';
import { catchError, map, tap } from 'rxjs/operators';
import { createReportMapping, emptyReportMapping, IReportMapping } from '../model/IReportMapping';
import { IReportMappingDetail } from '../model/IReportMappingDetail';

@Injectable({
	providedIn: 'root'
})
export class ReportMappingsService {

	private _reportMappings: IReportMapping[] = [];
	private _isCopying = false;
	private _copiedReportMapping: IReportMapping = emptyReportMapping();
  
	private _reportMappingsSubject: BehaviorSubject<IReportMapping[]> = new BehaviorSubject<IReportMapping[]>(this._reportMappings);
	private _isCopyingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this._isCopying);
	private _copiedReportMappingSubject: BehaviorSubject<IReportMapping> = new BehaviorSubject<IReportMapping>(this._copiedReportMapping);

	private _callAPI: Map<string, boolean> = new Map<string, boolean>(
		[
			['getReportMappings', true]
		]
	);

	constructor(
    private readonly _apiService: ApiService,
	) {}

	public callAPIsAgain() {
		this._callAPI.forEach((callAPI) => {
			callAPI = true;
		});
	}

	public setReportMappings(value: IReportMapping[]) {
		this._reportMappings = value;
		this._reportMappingsSubject.next(this._reportMappings);
	}

	public getReportMappings(): Observable<IReportMapping[]> {
		// If haven't called API, call the API and store results in the service
		if (this._callAPI.get('getReportMappings')) {
			return this._apiService.getReportMappings()
				.pipe(
					map(response => response.map((r => createReportMapping(r)))),
					tap((reportMappings) => {
						this._callAPI.set('getReportMappings', false),
						this.setReportMappings(reportMappings);
					}),
					catchError(error => throwError(error)),
				);
		} else {
			return this._reportMappingsSubject.asObservable();
		}
	}

	public addReportMapping(reportMapping: IReportMapping) {
		return this._apiService.addReportMapping(reportMapping)
			.pipe(
				tap(() => {
					this._addReportMapping(reportMapping);
				}),
				catchError(error => throwError(error))
			);
	}

	private _addReportMapping(reportMapping: IReportMapping) {
		this._reportMappings.push(reportMapping);
		this._reportMappingsSubject.next(this._reportMappings);
	}

	public updateReportMapping(reportMapping: IReportMappingDetail) {
		return this._apiService.updateReportMapping(reportMapping)
			.pipe(
				tap(() => {
					reportMapping.lastUpdated = new Date().toISOString();
					this._updateReportMapping(reportMapping);
				}),
				catchError(error => throwError(error))
			);
	}

	private _updateReportMapping(reportMapping: IReportMapping) {
		const index = this._reportMappings.findIndex((element) => {
			return element.jobProfileId === reportMapping.jobProfileId &&
        element.jobProfileMajorVersion === reportMapping.jobProfileMajorVersion &&
        element.reportTemplateId === reportMapping.reportTemplateId &&
        element.reportTemplateMajorVersion === reportMapping.reportTemplateMajorVersion;
		});
		this._reportMappings[index] = reportMapping;
		this._reportMappingsSubject.next(this._reportMappings);
	}

	public deleteReportMapping(reportMapping: IReportMapping) {
		return this._apiService.deleteReportMapping(reportMapping)
			.pipe(
				tap(() => this._deleteReportMapping(reportMapping)),
				catchError(error => throwError(error))
			);
	}

	private _deleteReportMapping(reportMapping: IReportMapping) {
		const index = this._reportMappings.findIndex((element) => {
			return element.jobProfileId === reportMapping.jobProfileId &&
      element.jobProfileMajorVersion === reportMapping.jobProfileMajorVersion &&
      element.reportTemplateId === reportMapping.reportTemplateId &&
      element.reportTemplateMajorVersion === reportMapping.reportTemplateMajorVersion;
		});
		this._reportMappings.splice(index, 1);
		this._reportMappingsSubject.next(this._reportMappings);
	}

	public setIsCopying(value: boolean) {
		this._isCopying = value;
		this._isCopyingSubject.next(this._isCopying);
	}

	public getIsCopying(): Observable<boolean> {
		return this._isCopyingSubject.asObservable();
	}

	public setCopiedReportMapping(value: IReportMapping) {
		this._copiedReportMapping = value;
		this._copiedReportMappingSubject.next(this._copiedReportMapping);
	}

	public getCopiedReportMapping(): Observable<IReportMapping> {
		return this._copiedReportMappingSubject.asObservable();
	}

	public activateReportMapping(reportMapping: IReportMapping) {
		return this._apiService.activateReportMapping(reportMapping)
			.pipe(
				tap(() => {
					reportMapping.isActive = true;
					this._updateReportMapping(reportMapping);
				}),
				catchError(error => throwError(error))
			);
	}

	public deactivateReportMapping(reportMapping: IReportMapping) {
		return this._apiService.deactivateReportMapping(reportMapping)
			.pipe(
				tap(() => {
					reportMapping.isActive = false;
					this._updateReportMapping(reportMapping);
				}),
				catchError(error => throwError(error))
			);
	}
}