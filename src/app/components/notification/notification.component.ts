import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Notification, emptyNotification } from 'src/app/model/INotification';
import { NotificationService } from 'src/app/services/notification.service';
import { LoggerService, LogLevel } from 'src/app/services/logger.service';

@Component({
	selector: 'app-notification',
	templateUrl: './notification.component.html',
	styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnDestroy {

	private _notification: Notification = emptyNotification();
	private _isVisible = false;

	private _subscriptions: Map<string, Subscription> = new Map();

	constructor(
		private notificationService: NotificationService,
		private logger: LoggerService // Inject the LoggerService
	) {
		this.logger.log(LogLevel.INFO, 'NotificationComponent', 'Component initialized');
		
		this._addSubscription('currentNotification', this.notificationService.currentNotification.subscribe(
			(notification) => {
				this.logger.log(LogLevel.DEBUG, 'NotificationComponent', 'Notification received', notification);
				this._notification = notification;
			}
		));

		this._addSubscription('isVisible', this.notificationService.isVisible.subscribe(
			(isVisible) => {
				this.logger.log(LogLevel.DEBUG, 'NotificationComponent', `Visibility changed to ${isVisible}`);
				this._isVisible = isVisible;
			}
		));
	}

	public get notification() {
		return this._notification;
	}

	public get isVisible() {
		return this._isVisible;
	}
  
	ngOnDestroy(): void {
		this.logger.log(LogLevel.INFO, 'NotificationComponent', 'Component destroyed, unsubscribing from subscriptions');
		this._subscriptions.forEach((subscription, name) => {
			this.logger.log(LogLevel.DEBUG, 'NotificationComponent', `Unsubscribing from ${name}`);
			subscription.unsubscribe();
		});
		this._subscriptions.clear();
	}

	private _addSubscription(name: string, subscription: Subscription) {
		if (this._subscriptions.get(name)) {
			this.logger.log(LogLevel.WARN, 'NotificationComponent', `Existing subscription for ${name} found, unsubscribing from the previous one`);
			this._subscriptions.get(name)?.unsubscribe();
		}
		this.logger.log(LogLevel.INFO, 'NotificationComponent', `Adding new subscription for ${name}`);
		this._subscriptions.set(name, subscription);
	}

	closeNotification() {
		this.logger.log(LogLevel.INFO, 'NotificationComponent', 'Closing notification');
		this.notificationService.hideNotification();
	}
}
