import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ConfirmationModal, createConfirmationModal, emptyConfirmationModal } from '../model/IConfirmationModal';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationModalService {

  constructor() { }

  private _currentModalSubject: BehaviorSubject<ConfirmationModal> = new BehaviorSubject<ConfirmationModal>(emptyConfirmationModal());
  private _isVisibleSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public get currentModal() {
    return this._currentModalSubject.asObservable();
  }

  public get isVisible() {
    return this._isVisibleSubject.asObservable();
  }

  showModal = (message: string, onConfirm: () => Observable<any>) => {
    const confirmationModal: ConfirmationModal = createConfirmationModal({ message: message, onConfirm: onConfirm });
    this._currentModalSubject.next(confirmationModal);
    this._isVisibleSubject.next(true);
  }

  closeModal = () => {
    this._isVisibleSubject.next(false);
  }
}