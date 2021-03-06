import React from "react";
import { Button, Modal, ModalTitle } from "react-bootstrap";

const ConfirmModal = ({ show, close }) => {
  return (
    <>
      <Modal show={show} onHide={() => close({ data: false })} size="md">
        <Modal.Header>
          <ModalTitle>Cancel Upload?</ModalTitle>
        </Modal.Header>
        <Modal.Body>
          <div className="step-3 mb-3">
            <div className="are-you-sure">
              Are you sure you want to close this window
            </div>
            <div className="text-muted text-center mb-4">
              All Prospect List creation progress will be lost
            </div>
            <div className="d-flex justify-content-around">
              <Button
                variant="light"
                className="text-muted"
                onClick={() => close({ data: false })}
              >
                BACK TO EDIT
              </Button>
              <Button variant="light" onClick={() => close({ data: true })}>
                CANCEL UPLOAD
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ConfirmModal;
