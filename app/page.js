"use client"

import Image from "next/image";
import React, { useState, useRef  } from 'react';
import axios from 'axios';

export default function Home() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadMessage, setUploadMessage] = useState('');
  const [fileName, setFileName] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (event) => {
    setSelectedImage(event.target.files[0]);
    setUploadMessage(''); // Clear any previous message
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedImage) {
      setUploadMessage('Please select an image to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedImage);
    const serverUrl = "https://image-upload-api-pkfg.onrender.com";

    try {
      const response = await axios.post(`${serverUrl}/api/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUploadMessage(response.data.message);
      setFileName(response.data.fileUrl);
      setSelectedImage(null); 
      fileInputRef.current.value = null;
    } catch (error) {
      console.log(error);
      setUploadMessage('An error occurred during upload. Please try again.');
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleImageChange} ref={fileInputRef} />
        <button type="submit" className="py-2.5 px-5 me-2 mb-2 text-sm font-medium focus:outline-none  rounded-lg border bg-gray-800">Upload Image</button>
        {uploadMessage && <p>{uploadMessage}</p>}
        {fileName && <a className="font-medium text-blue-600 dark:text-blue-500 hover:underline" href={fileName} target="_blank">View</a>}
      </form>
    </main>
  );
}
