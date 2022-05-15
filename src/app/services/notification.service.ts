import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, Observable, Subscription } from 'rxjs';
import { concatMap, delay } from 'rxjs/operators';
import { emptyNotification, Notification, NotificationType } from '../model/INotification';

@Injectable({
	providedIn: 'root'
})
export class NotificationService {

	private _notificationsQueue: Notification[] = [];
	private _notificationsQueueSubject: Subject<boolean> = new Subject();

	private _currentNotificationSubject: BehaviorSubject<Notification> = new BehaviorSubject<Notification>(emptyNotification());
	private _isVisibleSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	public get isVisible() {
		return this._isVisibleSubject.asObservable();
	}
	
	public get currentNotification() {
		return this._currentNotificationSubject.asObservable();
	}

	private _subscriptions: Map<string, Subscription> = new Map();

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

	constructor() {
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
	}

	addNotification(message: string, type: NotificationType) {
		const notification: Notification = {
			message,
			type
		};
		this._notificationsQueue.push(notification);
		this._notificationsQueueSubject.next();
	}

	private showNextNotification() {
		return new Observable(observer => {
			const nextNotification = this._notificationsQueue.shift();
			if (nextNotification) {
				this._currentNotificationSubject.next(nextNotification);
				this._isVisibleSubject.next(true);
			}

			setTimeout(() => {
				this.hideNotification();
				observer.complete();
			}, 4000);
		});
	}

	hideNotification() {
		this._isVisibleSubject.next(false);
	}
}