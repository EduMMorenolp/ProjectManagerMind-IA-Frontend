import React, { useState } from 'react';
import { SprintPlanningViewer } from '../../SprintPlanning';

const SprintsSection = ({ projectId, onNotification }) => {
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
      <SprintPlanningViewer
        projectId={projectId}
        onSuccess={handleSuccess}
        onError={handleError}
      />
    </div>
  );
};

export default SprintsSection;