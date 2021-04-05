import React from 'react';
import { Button, Modal, ModalTitle } from 'react-bootstrap';

const ConfirmDeleteModal = ({ show, close, prospectsCount = 0 }) => {
  return (
    <>
      <Modal show={show} onHide={() => close({ data: false })} size='md'>
        <Modal.Header>
          <ModalTitle>Confirm Delete</ModalTitle>
        </Modal.Header>
        <Modal.Body className='px-3'>
          <div className='step-3 mb-3'>
            <div className='are-you-sure mb-2'>
              {`Are you sure you want to delete ${prospectsCount} Prospects`}
            </div>
            <div className='text-muted text-center mb-4'>
              This cannot be undone
            </div>
            <div className='d-flex justify-content-around'>
              <Button
                variant='light'
                className='text-muted'
                onClick={() => close({ data: false })}
              >
                CANCEL
              </Button>
              <Button variant='light' onClick={() => close({ data: true })}>
                DELETE
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ConfirmDeleteModal;
