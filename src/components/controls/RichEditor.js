import React from "react";
import CKEditor from "ckeditor4-react";
const RichEditor = ({ value, onChange, placeholder = "" }) => {
  const changeEvent = (e) => {
    if (onChange) {
      onChange(e.editor.getData());
    }
  };
  return (
    <div className={"ckeditor-container" + (value ? " completed" : "")}>
      <CKEditor
        data={value}
        onChange={changeEvent}
        config={{ placeholder: placeholder }}
      />
    </div>
  );
};
export default RichEditor;
