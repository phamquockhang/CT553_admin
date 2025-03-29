import { NotificationType } from "../common";

export interface INotification {
  notificationId: string;
  isRead: boolean;
  notificationType: NotificationType;
  customerId?: string;
  staffId?: string;
  sellingOrderId?: string;
  createdAt?: string;
}

export interface NotificationFilterCriteria {
  isRead?: boolean;
  // notificationType?: NotificationType;
  staffEmail?: string;
}
