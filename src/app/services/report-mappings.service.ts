import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from './api.service';
import { map, tap } from 'rxjs/operators';
import { createReportMapping, emptyReportMapping, IReportMapping } from '../model/IReportMapping';
import { IReportMappingDetail, emptyReportMappingDetail } from '../model/IReportMappingDetail';

@Injectable({
  providedIn: 'root'
})
export class ReportMappingsService {

  private _selectedReportMappingDetail: IReportMappingDetail = emptyReportMappingDetail();
  private _reportMappings: IReportMapping[] = [];
  private _isCopying: boolean = false;
  private _copiedReportMapping: IReportMapping = emptyReportMapping();
  
  private _selectedReportMappingDetailSubject: BehaviorSubject<IReportMappingDetail> = new BehaviorSubject<IReportMappingDetail>(this._selectedReportMappingDetail);
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
    })
  }

  public setSelectedReportMappingDetail(value: IReportMappingDetail) {
    this._selectedReportMappingDetail = value;
    this._selectedReportMappingDetailSubject.next(this._selectedReportMappingDetail);
  }

  public getSelectedReportMappingDetail() {
    return this._selectedReportMappingDetailSubject.asObservable();
  }

  public setReportMappings(value: IReportMapping[]) {
    this._reportMappings = value;
    this._reportMappingsSubject.next(this._reportMappings);
  }

  public getReportMappings(): Observable<IReportMapping[]> {
    if (this._callAPI.get('getReportMappings')) {
      return this._apiService.getReportMappings()
        .pipe(
          map(response => response.map((r => createReportMapping(r)))),
          tap(() => this._callAPI.set('getReportMappings', false))
        );
    } else {
      return this._reportMappingsSubject.asObservable();
    }
  }

  public addReportMapping(value: IReportMapping) {
    this._reportMappings.push(value);
    this._reportMappingsSubject.next(this._reportMappings);
  }

  public updateReportMapping(value: IReportMapping) {
    const index = this._reportMappings.findIndex((element) => {
        return element.jobProfileId === value.jobProfileId &&
        element.jobProfileMajorVersion === value.jobProfileMajorVersion &&
        element.reportTemplateId === value.reportTemplateId &&
        element.reportTemplateMajorVersion === value.reportTemplateMajorVersion
    });
    this._reportMappings[index] = value;
    this._reportMappingsSubject.next(this._reportMappings);
  }

  public deleteReportMapping(value: IReportMapping) {
    return new Observable(observer => {
      this._apiService.deleteReportMapping(value).subscribe(
        () => {
          const index = this._reportMappings.findIndex((element) => {
            return element.jobProfileId === value.jobProfileId &&
            element.jobProfileMajorVersion === value.jobProfileMajorVersion &&
            element.reportTemplateId === value.reportTemplateId &&
            element.reportTemplateMajorVersion === value.reportTemplateMajorVersion
          });
          this._reportMappings.splice(index, 1);
          this._reportMappingsSubject.next(this._reportMappings);
          observer.next();
          observer.complete();
        },
        (error) => {
          observer.error(error);
        }
      )
    })
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

  public activateReportMapping(value: IReportMapping) {
    const newReportMapping = value;
    return new Observable(observer => {
      this._apiService.activateReportMapping(value).subscribe(
        () => {
          newReportMapping.isActive = true;
          this.updateReportMapping(newReportMapping);
          observer.next();
          observer.complete();
        },
        (error) => {
          observer.error(error);
        }
      )
    })
  }

  public deactivateReportMapping(value: IReportMapping) {
    const newReportMapping = value;
    return new Observable(observer => {
      this._apiService.deactivateReportMapping(value).subscribe(
        () => {
          newReportMapping.isActive = false;
          this.updateReportMapping(newReportMapping);
          observer.next();
          observer.complete();
        },
        (error) => {
          observer.error(error);
        }
      )
    })
  }
}