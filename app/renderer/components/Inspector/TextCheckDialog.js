import React, { useState } from 'react';
import { Modal, Checkbox, Input } from 'antd';

const { TextArea } = Input;

const TextCheckDialog = ({ visible, text, onClose }) => {
  const [checkedValue, setCheckedValue] = useState(true);
  const [textInput, setTextInput] = useState();
  if (text !== '') {
    setTextInput(text);
  }

  const handleCheckboxChange = checkedValue => {
    setCheckedValue(checkedValue);
  };

  const handleInputChange = e => {
    setTextInput(e.target.value);
  };

  const handleOk = () => {
    // Do something with checkedValues and textInput
    console.log('Checked values:', checkedValue);
    console.log('Text input:', textInput);

    // Close the dialog
    onClose(checkedValue, textInput);
  };

  const handleCancel = () => {
    // Close the dialog without doing anything
    onClose(false, '');
  };

  return (
    <Modal
      title="Test text or not"
      open={visible}
      onOk={handleOk}
      okText="TEST"
      onCancel={handleCancel}
    >
      <Checkbox onChange={handleCheckboxChange} checked={checkedValue} value="1">Test this text</Checkbox>
      <br /><br />
      <TextArea
        placeholder="Enter some text..."
        autoSize={{ minRows: 1, maxRows: 3 }}
        value={textInput}
        onChange={handleInputChange}
      />
    </Modal>
  );
};

export default TextCheckDialog;