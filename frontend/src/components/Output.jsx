import React, { useState } from "react";
import axios from "axios";


const Output = ({ outputs = [], imageToPredict, setOutputs, searchResults = [], setSearchResults }) => {
  const [newLabel, setNewLabel] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const apiBaseUrl = "http://localhost:8080";

  const handleDelete = (index) => {
    const updatedOutputs = outputs.filter((_, i) => i !== index);
    setOutputs(updatedOutputs);
  };

  const handleAddLabel = () => {
    if (newLabel) {
      const updatedOutputs = [...outputs, { name: newLabel }];
      setOutputs(updatedOutputs);
      setNewLabel("");
    }
  };

  const handleSave = () => {
    if (!imageToPredict || outputs.length === 0) {
      alert("Please ensure an image is uploaded and labels are present.");
      return;
    }

    const imageData = {
      imageUrl: imageToPredict,
      labels: outputs.map(output => output.name),
    };

    axios.post(`${apiBaseUrl}/predict/save`, imageData)
      .then(() => alert("Image and labels saved successfully!"))
      .catch(err => {
        console.error("Error saving image and labels:", err);
        alert(`Error: ${err.response?.data?.error || err.message}`);
      });
  };


  const handleSearch = () => {
    axios
      .get(`${apiBaseUrl}/search`, { params: { label: searchQuery } })
      .then((res) => {
        setSearchResults(res.data.images);
      })
      .catch((err) => {
        alert(`Error: ${err.response?.data?.error || err.message}`);
      });
  };

  return (
    <div className="mt-6">
      <div className="mb-6 text-center">
        {imageToPredict ? (
          <img
            src={imageToPredict}
            className="w-full max-w-xs h-auto mb- mx-auto"
            alt="image-to-predict"
          />
        ) : (
          <p className="text-gray-700">Image to Predict will be shown here</p>
        )}
      </div>

      <div className="mb-6">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">#</th>
              <th className="border px-4 py-2">Label/Tag</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {outputs.map((o, i) => (
              <tr key={i} className="text-center">
                <td className="border px-4 py-2">{i + 1}</td>
                <td className="border px-4 py-2"> #{o.name}</td>
                <td className="border px-4 py-2">
                  <button
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-300"
                    onClick={() => handleDelete(i)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6 flex gap-4">
          <input
            type="text"
            className="flex-1 p-2 border border-gray-300 rounded"
            placeholder="New Label/Tag"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
          />
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-300"
            onClick={handleAddLabel}
          >
            Add Label/Tag
          </button>
        </div>
        <div className="text-center mt-4">
          <button
            className="w-48 mx-auto px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-300"
            onClick={handleSave}
          >
            Save Image and Label/Tag
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <input
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Search by Label/Tag"
          aria-label="Search by Label/Tag"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-300"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>

      {searchResults.length > 0 && (
        <div>
          <h4 className="text-xl font-semibold">Search Results:</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {searchResults.map((result, index) => (
              <div key={index} className="flex flex-col items-center">
                <img
                  src={result.imageUrl}
                  alt="searched-img"
                  className="w-full h-auto object-cover rounded shadow-md"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Output;
