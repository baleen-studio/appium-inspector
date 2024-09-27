import React, { useState } from 'react';
import { Modal, Input } from 'antd';

const { TextArea } = Input;

const ConfirmExistanceDialog = (props) => {
  const { visible, onClose, t } = props;
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
      title={t('Confirm existance')}
      open={visible}
      okText={t('Yes')}
      onOk={handleOk}
      onCancel={handleCancel}
      cancelText={t('No')}
    >
      {t('Do you test existence of this widget?')}
    </Modal>
  );
};

export default ConfirmExistanceDialog;