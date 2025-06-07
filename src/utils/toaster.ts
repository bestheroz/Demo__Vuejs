import { toast, ToasterProps } from "vue-sonner";
import "vue-sonner/style.css";

export const toastSuccess = (message: string, options?: ToasterProps) =>
  toast.success(message, { ...options, duration: 2_000, closeButton: true });

export const toastInfo = (message: string, options?: ToasterProps) =>
  toast.info(message, { ...options, duration: 4_000, closeButton: true });

export const toastWarning = (message: string, options?: ToasterProps) =>
  toast.warning(message, { ...options, duration: 6_000, closeButton: true });

export const toastError = (message: string, options?: ToasterProps) =>
  toast.error(message, { ...options, duration: 10_000, closeButton: true });
