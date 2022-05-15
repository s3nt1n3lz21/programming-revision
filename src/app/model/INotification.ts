export type NotificationType = 'success' | 'error';

export interface Notification {
  message: string,
  type: NotificationType
}

export function emptyNotification(): Notification {
	return {
		message: '',
		type: 'error'
	};
}