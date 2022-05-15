import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { Notification, emptyNotification } from 'src/app/model/INotification';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
	selector: 'app-notification',
	templateUrl: './notification.component.html',
	styleUrls: ['./notification.component.scss']
})
export class NotificationComponent {

	private _notification: Notification = emptyNotification();
	private _isVisible = false;

	private _subscriptions: Map<string, Subscription> = new Map();

	public get notification() {
		return this._notification;
	}

	public get isVisible() {
		return this._isVisible;
	}
  
	ngOnDestroy(): void {
		this._subscriptions.forEach((subscription) => {
			subscription.unsubscribe();
		});
		this._subscriptions.clear();
	}
  
	private _addSubscription(name: string, subscription: Subscription) {
		if (this._subscriptions.get(name)) {
			this._subscriptions.get(name)?.unsubscribe();
		}
		this._subscriptions.set(name, subscription);
	}

	constructor(private notificationService: NotificationService) { 
		this._addSubscription('currentNotification', this.notificationService.currentNotification.subscribe(
			(notification) => {
				this._notification = notification;
			}
		));

		this._addSubscription('isVisible', this.notificationService.isVisible.subscribe(
			(isVisible) => {
				this._isVisible = isVisible;
			}
		));
	}

	closeNotification() {
		this.notificationService.hideNotification();
	}
}
