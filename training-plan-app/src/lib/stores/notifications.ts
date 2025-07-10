import { writable } from 'svelte/store';

export interface Notification {
	id: string;
	type: 'success' | 'error' | 'warning' | 'info';
	title: string;
	message?: string;
	duration?: number;
	persistent?: boolean;
}

function createNotificationStore() {
	const { subscribe, set, update } = writable<Notification[]>([]);

	return {
		subscribe,
		addNotification: (notification: Omit<Notification, 'id'>) => {
			const id = Date.now().toString() + Math.random().toString(36).substring(2);
			const newNotification: Notification = {
				id,
				duration: 5000,
				persistent: false,
				...notification
			};

			update(notifications => [...notifications, newNotification]);

			// 自动移除非持久化通知
			if (!newNotification.persistent) {
				setTimeout(() => {
					update(notifications => notifications.filter(n => n.id !== id));
				}, newNotification.duration);
			}

			return id;
		},
		removeNotification: (id: string) => {
			update(notifications => notifications.filter(n => n.id !== id));
		},
		clearAll: () => {
			set([]);
		},
		// 便捷方法
		success: (title: string, message?: string, duration?: number) => {
			update(notifications => [...notifications, {
				id: Date.now().toString() + Math.random().toString(36).substring(2),
				type: 'success',
				title,
				message,
				duration: duration || 5000,
				persistent: false
			}]);
		},
		error: (title: string, message?: string, persistent = false) => {
			const id = Date.now().toString() + Math.random().toString(36).substring(2);
			const notification = {
				id,
				type: 'error' as const,
				title,
				message,
				persistent
			};
			
			update(notifications => [...notifications, notification]);
			
			if (!persistent) {
				setTimeout(() => {
					update(notifications => notifications.filter(n => n.id !== id));
				}, 5000);
			}
		},
		warning: (title: string, message?: string) => {
			const id = Date.now().toString() + Math.random().toString(36).substring(2);
			update(notifications => [...notifications, {
				id,
				type: 'warning',
				title,
				message,
				duration: 5000,
				persistent: false
			}]);
			
			setTimeout(() => {
				update(notifications => notifications.filter(n => n.id !== id));
			}, 5000);
		},
		info: (title: string, message?: string) => {
			const id = Date.now().toString() + Math.random().toString(36).substring(2);
			update(notifications => [...notifications, {
				id,
				type: 'info',
				title,
				message,
				duration: 5000,
				persistent: false
			}]);
			
			setTimeout(() => {
				update(notifications => notifications.filter(n => n.id !== id));
			}, 5000);
		}
	};
}

export const notifications = createNotificationStore(); 