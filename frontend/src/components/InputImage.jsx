import React, { useState } from "react";
import axios from "axios";

const InputImage = ({ setOutputs, setImageToPredict }) => {
  const [fileObj, setFileObj] = useState(null);

  const apiBaseUrl = "https://image-tagging-backend-app.onrender.com"; 

  const predictImageViaUpload = () => {
    if (!fileObj) {
      alert("Please upload a file");
      return;
    }

    setOutputs([]);
    const formData = new FormData();
    formData.append("file", fileObj);

    const reader = new FileReader();
    reader.onload = () => setImageToPredict(reader.result);
    reader.readAsDataURL(fileObj);

    axios
      .post(`${apiBaseUrl}/predict/upload`, formData)
      .then((res) => {
        setOutputs(res.data.results);
      })
      .catch((err) => {
        alert(`Error: ${err.response?.data?.error || err.message}`);
      });
  };

  const handleFileFormControlOnChange = (e) => {
    if (e.target.files.length) {
      setFileObj(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <input
          type="file"
          className="mb-3 p-2 border border-gray-300 rounded"
          onChange={handleFileFormControlOnChange}
        />
        <button
          className="m-4 px-4 py-2 bg-blue-500 text-white rounded  hover:bg-blue-600 transition-colors duration-300"
          onClick={predictImageViaUpload}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default InputImage;
