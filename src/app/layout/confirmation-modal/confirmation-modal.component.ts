import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ConfirmationModal, emptyConfirmationModal } from 'src/app/model/IConfirmationModal';
import { ConfirmationModalService } from 'src/app/services/confirmation-modal.service';

type IsLoadingKey = 'onConfirm';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent implements OnDestroy {

  private _confirmationModal: ConfirmationModal = emptyConfirmationModal();
  private _isVisible: boolean = false;

  public get isVisible() {
    return this._isVisible;
  }

  public get confirmationModal() {
    return this._confirmationModal;
  }

  // Store loading states of all the different api calls
  private _isLoading: Map<IsLoadingKey, boolean> = new Map<IsLoadingKey, boolean>(
    [
      ['onConfirm', false],
    ]
  );
  
  // Store loading error states of all the different api calls
  private _isLoadingError: Map<IsLoadingKey, boolean> = new Map<IsLoadingKey, boolean>(
    [
      ['onConfirm', false],
    ]
  );

  public get isLoading() {
    return this._isLoading;
  }

  public get isLoadingError() {
    return this._isLoadingError;
  }
    
  // Check any API is loading
  get isAnyLoading() {
    let loading = false;
    this._isLoading.forEach(
      (isLoading) => {
        loading = loading || isLoading;
    });
    return loading;
  }

  // Check any API has a loading error
  get isAnyLoadingError() {
    let error = false;
    this._isLoadingError.forEach(
      (isError) => {
        error = error || isError;
    });
    return error;
  }

  private _subscriptions: Map<String, Subscription> = new Map();
  
  ngOnDestroy(): void {
    this._subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    })
    this._subscriptions.clear();
  }

  private _addSubscription(name: string, subscription: Subscription) {
    if (this._subscriptions.get(name)) {
      this._subscriptions.get(name)?.unsubscribe();
    }
    this._subscriptions.set(name, subscription);
  }
  
  constructor(private _confirmationModalService: ConfirmationModalService) { 
    this._addSubscription('currentModal' , this._confirmationModalService.currentModal.subscribe(
      (confirmationModal) => {
        this._confirmationModal = confirmationModal;
      }
    ))

    this._addSubscription('isVisible', this._confirmationModalService.isVisible.subscribe(
      (isVisibile) => {
        this._isVisible = isVisibile;
      }
    ))
  }

  closeModal = () => {
    this._confirmationModalService.closeModal();
  }

  onConfirm = () => {
    this._isLoading.set('onConfirm', true);
    this.confirmationModal.onConfirm().subscribe(
      () => {
        this._isLoading.set('onConfirm', false);
        this._isLoadingError.set('onConfirm', false);

        this.closeModal();
      },
      (error) => {
        this._isLoading.set('onConfirm', false);
        this._isLoadingError.set('onConfirm', true);

        this.closeModal();
      }
    )
  }
}