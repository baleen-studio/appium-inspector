import React, { useState } from 'react';
import { Modal, Input } from 'antd';

const { TextArea } = Input;

const TextEnterDialog = ({ visible, text, onClose }) => {
  const [textInput, setTextInput] = useState();
  if (text !== '') {
    setTextInput(text);
  }

  const handleInputChange = e => {
    setTextInput(e.target.value);
  };

  const handleOk = () => {
    // Do something with checkedValues and textInput
    console.log('Text input:', textInput);

    // Close the dialog
    onClose(true, textInput);
  };

  const handleCancel = () => {
    // Close the dialog without doing anything
    onClose(false, '');
  };

  return (
    <Modal
      title="Edit Test"
      open={visible}
      onOk={handleOk}
      okText="EDIT"
      onCancel={handleCancel}
    >
      <TextArea
        placeholder="Enter some text..."
        autoSize={{ minRows: 1, maxRows: 3 }}
        value={textInput}
        onChange={handleInputChange}
      />
    </Modal>
  );
};

export default TextEnterDialog;