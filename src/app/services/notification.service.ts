import { Injectable, OnDestroy } from '@angular/core';
import { Subject, BehaviorSubject, Observable, Subscription } from 'rxjs';
import { concatMap, delay } from 'rxjs/operators';
import { emptyNotification, Notification, NotificationType } from '../model/INotification';
import { LoggerService, LogLevel } from './logger.service'; // Import LoggerService

@Injectable({
	providedIn: 'root'
})
export class NotificationService implements OnDestroy {

	private _notificationsQueue: Notification[] = [];
	private _notificationsQueueSubject: Subject<boolean> = new Subject();

	private _currentNotificationSubject: BehaviorSubject<Notification> = new BehaviorSubject<Notification>(emptyNotification());
	private _isVisibleSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	private _subscriptions: Map<string, Subscription> = new Map();

	constructor(private logger: LoggerService) { // Inject LoggerService
		// Subscribe to the notification queue and display each one after the previous has finished
		this._addSubscription('notificationsQueue',
			this._notificationsQueueSubject.pipe(
				concatMap(
					() => this.showNextNotification().pipe(
						delay(500),
					)
				)
			).subscribe()
		);

		this.logger.log(LogLevel.INFO, 'NotificationService', 'Service initialized'); // Log initialization
	}

	ngOnDestroy(): void {
		this._subscriptions.forEach((subscription) => {
			subscription.unsubscribe();
		});
		this._subscriptions.clear();
		this.logger.log(LogLevel.INFO, 'NotificationService', 'Service destroyed, subscriptions cleared'); // Log service destruction
	}

	addNotification(message: string, type: NotificationType): void {
		const notification: Notification = {
			message,
			type
		};
		this._notificationsQueue.push(notification);
		this._notificationsQueueSubject.next();

		this.logger.log(LogLevel.INFO, 'NotificationService', 'Notification added', message, type); // Log notification added
	}

	private showNextNotification(): Observable<void> {
		return new Observable(observer => {
			const nextNotification = this._notificationsQueue.shift();
			if (nextNotification) {
				this._currentNotificationSubject.next(nextNotification);
				this._isVisibleSubject.next(true);
				this.logger.log(LogLevel.INFO, 'NotificationService', 'Showing notification', nextNotification); // Log showing notification
			}

			setTimeout(() => {
				this.hideNotification();
				observer.complete();
			}, 4000);
		});
	}

	hideNotification(): void {
		this._isVisibleSubject.next(false);
		this.logger.log(LogLevel.INFO, 'NotificationService', 'Notification hidden'); // Log hiding notification
	}

	public get isVisible(): Observable<boolean> {
		return this._isVisibleSubject.asObservable();
	}

	public get currentNotification(): Observable<Notification> {
		return this._currentNotificationSubject.asObservable();
	}

	private _addSubscription(name: string, subscription: Subscription): void {
		if (this._subscriptions.get(name)) {
			this._subscriptions.get(name)?.unsubscribe();
		}
		this._subscriptions.set(name, subscription);

		this.logger.log(LogLevel.DEBUG, 'NotificationService', `Subscription added or replaced: ${name}`); // Log subscription addition
	}
}
