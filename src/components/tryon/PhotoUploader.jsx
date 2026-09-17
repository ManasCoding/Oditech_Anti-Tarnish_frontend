import React, { useState, useRef } from 'react';
import { Camera, Upload, X } from 'lucide-react';
import useTryOnStore from '../../store/tryOnStore';

const PhotoUploader = () => {
  const { userImage, setUserImage } = useTryOnStore();
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateFile = (file) => {
    setError(null);
    if (!file) return false;
    
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a JPG or PNG image.');
      return false;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB.');
      return false;
    }

    return true;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFile(file);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      handleFile(file);
    }
  };

  const handleFile = (file) => {
    if (validateFile(file)) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUserImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onButtonClick = () => {
    inputRef.current.click();
  };

  const clearImage = () => {
    setUserImage(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  if (userImage) {
    return (
      <div className="relative w-full aspect-[3/4] bg-[#F8F5F0] rounded-2xl overflow-hidden group border-2 border-transparent">
        <img src={userImage} alt="User upload" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 backdrop-blur-sm">
          <button onClick={onButtonClick} className="bg-white text-[#1A1A1A] py-2 px-5 rounded-full font-medium hover:bg-gray-100 transition-colors text-sm">
            Replace Photo
          </button>
          <button onClick={clearImage} className="text-white hover:text-red-300 text-sm font-medium transition-colors">
            Remove
          </button>
        </div>
        <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none opacity-100 group-hover:opacity-0 transition-opacity">
          <span className="bg-white/80 backdrop-blur px-4 py-1.5 rounded-full text-xs font-medium text-[#1A1A1A] shadow-sm">
            Ready for your jewellery ✨
          </span>
        </div>
        <input ref={inputRef} type="file" accept="image/jpeg, image/png, image/jpg" onChange={handleChange} className="hidden" />
      </div>
    );
  }

  return (
    <div 
      className={`relative w-full aspect-[3/4] rounded-2xl flex flex-col items-center justify-center p-6 text-center border-2 border-dashed transition-all duration-300 ${
        dragActive ? 'border-[#C69C6D] bg-[#F8F5F0]' : 'border-gray-200 bg-white hover:border-[#C69C6D] hover:bg-[#F8F5F0]/50'
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <div className="w-16 h-16 rounded-full bg-[#F8F5F0] flex items-center justify-center mb-4 text-[#C69C6D]">
        <Camera strokeWidth={1.5} size={28} />
      </div>
      <h3 className="text-xl font-serif text-[#1A1A1A] mb-2">Upload your photo</h3>
      <p className="text-sm text-gray-500 mb-6 max-w-[200px]">For the best results, use a clear, well-lit portrait.</p>
      
      <button onClick={onButtonClick} className="bg-[#1A1A1A] text-white py-2.5 px-6 rounded-full font-medium hover:bg-[#333333] transition-colors flex items-center gap-2 mb-3">
        <Upload size={16} />
        Browse Files
      </button>
      <p className="text-xs text-gray-400">JPG, PNG up to 10MB</p>
      
      {error && (
        <div className="mt-4 text-xs font-medium text-red-500 bg-red-50 py-1.5 px-3 rounded-md">
          {error}
        </div>
      )}
      
      <div className="absolute bottom-6 w-full px-6 flex justify-center">
        <p className="text-[10px] text-gray-400 text-center">
          Your photo is used only to create your virtual try-on preview.
        </p>
      </div>

      <input ref={inputRef} type="file" accept="image/jpeg, image/png, image/jpg" onChange={handleChange} className="hidden" />
    </div>
  );
};

export default PhotoUploader;
