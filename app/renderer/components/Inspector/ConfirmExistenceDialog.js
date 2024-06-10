import React, { useState } from 'react';
import { Modal, Input } from 'antd';

const { TextArea } = Input;

const ConfirmExistanceDialog = ({ visible, onClose }) => {

  const handleOk = () => {
    // Close the dialog
    onClose(true);
  };

  const handleCancel = () => {
    // Close the dialog without doing anything
    onClose(false);
  };

  return (
    <Modal
      title="Confirm existance"
      open={visible}
      okText="YES"
      onOk={handleOk}
      onCancel={handleCancel}
      cancelText="NO"
    >
      Do you test existence of this widget?
    </Modal>
  );
};

export default ConfirmExistanceDialog;