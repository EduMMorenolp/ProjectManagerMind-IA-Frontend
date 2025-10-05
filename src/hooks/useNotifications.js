import { useStudy } from '../../../contexts';

// Hook personalizado para agregar notificaciones fácilmente
export const useNotifications = () => {
  const { dispatch } = useStudy();

  const addNotification = (notification) => {
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: notification
    });
  };

  const addSuccess = (title, message, options = {}) => {
    addNotification({
      type: 'success',
      title,
      message,
      ...options
    });
  };

  const addError = (title, message, options = {}) => {
    addNotification({
      type: 'error',
      title,
      message,
      autoRemove: false, // Los errores requieren acción manual
      ...options
    });
  };

  const addWarning = (title, message, options = {}) => {
    addNotification({
      type: 'warning',
      title,
      message,
      duration: 7000, // Warnings un poco más tiempo
      ...options
    });
  };

  const addInfo = (title, message, options = {}) => {
    addNotification({
      type: 'info',
      title,
      message,
      ...options
    });
  };

  const clearAllNotifications = () => {
    dispatch({ type: 'CLEAR_NOTIFICATIONS' });
  };

  return {
    addNotification,
    addSuccess,
    addError,
    addWarning,
    addInfo,
    clearAllNotifications
  };
};