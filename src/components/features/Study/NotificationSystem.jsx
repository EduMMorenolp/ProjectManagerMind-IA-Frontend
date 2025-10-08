import React, { useEffect } from 'react';
import { CheckIcon, XIcon, AlertTriangleIcon, InfoIcon, XIcon as CloseIcon } from '../../ui/Icons';
import { useStudy } from '../../../contexts';

const NotificationSystem = () => {
  const { notifications, dispatch } = useStudy();

  // Auto-remover notificaciones después de un tiempo
  useEffect(() => {
    const timers = notifications.map(notification => {
      if (notification.autoRemove !== false) {
        return setTimeout(() => {
          dispatch({
            type: 'REMOVE_NOTIFICATION',
            payload: { id: notification.id }
          });
        }, notification.duration || 5000);
      }
      return null;
    });

    return () => {
      timers.forEach(timer => {
        if (timer) clearTimeout(timer);
      });
    };
  }, [notifications, dispatch]);

  // Función para remover notificación manualmente
  const removeNotification = (id) => {
    dispatch({
      type: 'REMOVE_NOTIFICATION',
      payload: { id }
    });
  };

  // Obtener icono según el tipo
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckIcon className="notification-icon success" />;
      case 'error':
        return <XIcon className="notification-icon error" />;
      case 'warning':
        return <AlertTriangleIcon className="notification-icon warning" />;
      case 'info':
      default:
        return <InfoIcon className="notification-icon info" />;
    }
  };

  // Formatear tiempo
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="notification-system">
      <div className="notifications-container">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`notification notification-${notification.type}`}
          >
            <div className="notification-content">
              <div className="notification-header">
                {getNotificationIcon(notification.type)}
                <div className="notification-text">
                  <div className="notification-title">
                    {notification.title}
                  </div>
                  {notification.message && (
                    <div className="notification-message">
                      {notification.message}
                    </div>
                  )}
                </div>
                <div className="notification-meta">
                  <span className="notification-time">
                    {formatTime(notification.timestamp)}
                  </span>
                  <button
                    className="notification-close"
                    onClick={() => removeNotification(notification.id)}
                    title="Cerrar notificación"
                  >
                    <CloseIcon className="close-icon" />
                  </button>
                </div>
              </div>
              
              {/* Detalles adicionales si existen */}
              {notification.details && (
                <div className="notification-details">
                  {notification.details}
                </div>
              )}
              
              {/* Acciones si existen */}
              {notification.actions && (
                <div className="notification-actions">
                  {notification.actions.map((action, index) => (
                    <button
                      key={index}
                      className={`notification-action ${action.type || 'default'}`}
                      onClick={action.onClick}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Barra de progreso para auto-remover */}
            {notification.autoRemove !== false && (
              <div className="notification-progress">
                <div 
                  className="notification-progress-bar"
                  style={{
                    animationDuration: `${notification.duration || 5000}ms`
                  }}
                ></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};



export default NotificationSystem;