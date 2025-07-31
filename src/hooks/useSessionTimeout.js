import { useEffect, useState, useCallback } from 'react';
import { Modal, Button } from 'antd';
import { history } from 'umi';

const useSessionTimeout = (timeoutInMinutes = 2) => { // Default to 2 minutes for testing
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(60);
  const timeoutRef = useRef(null);
  const warningRef = useRef(null);
  const countdownRef = useRef(null);

  const clearAllTimeouts = useCallback(() => {
    clearTimeout(timeoutRef.current);
    clearTimeout(warningRef.current);
    clearInterval(countdownRef.current);
  }, []);

  const handleLogout = useCallback(() => {
    clearAllTimeouts();
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('roles');
    history.push('/user/login');
  }, [clearAllTimeouts]);

  const resetTimeout = useCallback(() => {
    // Clear all existing timeouts
    clearAllTimeouts();
    setIsWarningModalOpen(false);
    setRemainingSeconds(60);

    // Set new warning timeout (1 minute before logout)
    warningRef.current = setTimeout(() => {
      setIsWarningModalOpen(true);
      // Start countdown
      countdownRef.current = setInterval(() => {
        setRemainingSeconds(prev => {
          if (prev <= 1) {
            clearInterval(countdownRef.current);
            handleLogout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, (timeoutInMinutes - 1) * 60 * 1000); // Warn after (timeout-1) minutes

    // Set new logout timeout
    timeoutRef.current = setTimeout(() => {
      handleLogout();
    }, timeoutInMinutes * 60 * 1000);
  }, [timeoutInMinutes, handleLogout, clearAllTimeouts]);

  const onContinueSession = useCallback(() => {
    resetTimeout();
    setIsWarningModalOpen(false);
  }, [resetTimeout]);

  // Set up event listeners
  useEffect(() => {
    const events = [
      'mousedown', 'mousemove', 'keypress', 'scroll', 
      'touchstart', 'click', 'keydown', 'input'
    ];

    const handleActivity = () => {
      resetTimeout();
    };

    events.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    // Initialize the timeout
    resetTimeout();

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
      clearAllTimeouts();
    };
  }, [resetTimeout, clearAllTimeouts]);

  const SessionTimeoutModal = () => (
    <Modal
      title="Session Timeout Warning"
      visible={isWarningModalOpen}
      onCancel={onContinueSession}
      footer={[
        <Button key="continue" type="primary" onClick={onContinueSession}>
          Continue Session
        </Button>,
      ]}
      closable={false}
    >
      <p>Your session will expire in {remainingSeconds} seconds due to inactivity.</p>
      <p>Perform any action to continue your session.</p>
    </Modal>
  );

  return { SessionTimeoutModal };
};

export default useSessionTimeout;