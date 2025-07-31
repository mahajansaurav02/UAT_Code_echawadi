import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap'; // or your preferred UI library

const SessionTimeoutModal = ({ isOpen, onContinue, countdown }) => {
  const [remainingSeconds, setRemainingSeconds] = useState(countdown);

  useEffect(() => {
    if (!isOpen) return;
    
    const timer = setInterval(() => {
      setRemainingSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  return (
    <Modal show={isOpen} backdrop="static" keyboard={false}>
      <Modal.Header>
        <Modal.Title>Session Timeout Warning</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Your session is about to expire due to inactivity.</p>
        <p>You will be logged out in {remainingSeconds} seconds.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={onContinue}>
          Continue Session
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SessionTimeoutModal;