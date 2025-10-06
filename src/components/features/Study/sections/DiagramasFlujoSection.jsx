import React, { useState } from 'react';
import { DiagramasFlujoViewer } from '../../DiagramViewer';

const DiagramasFlujoSection = ({ projectId, onNotification }) => {
  const [, setNotifications] = useState([]);

  const handleSuccess = (message) => {
    const notification = {
      id: Date.now(),
      type: 'success',
      message,
      timestamp: new Date().toISOString()
    };
    setNotifications(prev => [...prev, notification]);
    onNotification?.(notification);
  };

  const handleError = (message) => {
    const notification = {
      id: Date.now(),
      type: 'error',
      message,
      timestamp: new Date().toISOString()
    };
    setNotifications(prev => [...prev, notification]);
    onNotification?.(notification);
  };

  return (
    <div className="section-container">
      <DiagramasFlujoViewer
        projectId={projectId}
        onSuccess={handleSuccess}
        onError={handleError}
      />
    </div>
  );
};

export default DiagramasFlujoSection;