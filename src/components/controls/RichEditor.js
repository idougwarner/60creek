import React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import "./RichEditor.scss";
const RichEditor = ({ value, onChange, placeholder = "" }) => {
  const changeEvent = (e, editor) => {
    if (onChange) {
      onChange(editor.getData());
    }
  };
  return (
    <div className={"ckeditor-container" + (value ? " completed" : "")}>
      <CKEditor
        editor={ClassicEditor}
        data={value}
        onChange={changeEvent}
        config={{
          placeholder: placeholder,
          toolbar: [
            "heading",
            "|",
            "bold",
            "italic",
            "underline",
            "|",
            "numberedList",
            "bulletedList",
            "|",
            "blockQuote",
            "|",
            "alignment:left",
            "alignment:center",
            "alignment:right",
            "alignment:justify",
            "|",
            "link",
          ],
        }}
      />
    </div>
  );
};
export default RichEditor;
