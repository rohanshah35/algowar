import React from "react";

type EditorFooterProps = {
  handleSubmit: () => void;
};

const EditorFooter: React.FC<EditorFooterProps> = ({ handleSubmit }) => (
  <div className="bg-dark-layer-1 p-3 flex justify-end space-x-4">
    <button
      className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
      onClick={handleSubmit}
    >
      Run
    </button>
    <button
      className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-600"
      onClick={handleSubmit}
    >
      Submit
    </button>
  </div>
);

export default EditorFooter;
