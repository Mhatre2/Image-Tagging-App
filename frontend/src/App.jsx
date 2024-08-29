import React, { useState } from "react";
import Navbar from "./components/Navbar";
import InputImage from "./components/InputImage";
import Output from "./components/Output";

const App = () => {
  const [outputs, setOutputs] = useState([]);
  const [imageToPredict, setImageToPredict] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const apiBaseUrl = 'https://image-tagging-backend-app.onrender.com/predict'; 

  return (
    <div className="flex flex-col h-screen">
      <Navbar />

      <div className="flex-1 py-4 container mx-auto px-4">
        <div className="space-y-4">
          <InputImage
            setOutputs={setOutputs}
            setImageToPredict={setImageToPredict}
          />
          <Output
            outputs={outputs}
            imageToPredict={imageToPredict}
            setOutputs={setOutputs}
            searchResults={searchResults}
            setSearchResults={setSearchResults}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
