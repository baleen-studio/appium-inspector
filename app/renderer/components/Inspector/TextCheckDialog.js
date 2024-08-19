import React, { useState } from 'react';
import { Modal, Input } from 'antd';

const { TextArea } = Input;

const TextCheckDialog = (props) => {
  const { key, visible, text, onClose, t } = props;
  const [textInput, setTextInput] = useState(text);

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
      key={key}
      title={t('Test text')}
      open={visible}
      onOk={handleOk}
      okText={t('Test')}
      onCancel={handleCancel}
    >
      Test this text
      <br /><br />
      <TextArea
        placeholder={t('Enter some text...')}
        autoSize={{ minRows: 1, maxRows: 3 }}
        value={textInput}
        onChange={handleInputChange}
      />
    </Modal>
  );
};

export default TextCheckDialog;