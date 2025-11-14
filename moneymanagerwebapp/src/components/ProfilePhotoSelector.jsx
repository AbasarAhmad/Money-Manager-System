import { Trash, Upload, User } from "lucide-react";
import React, { useRef, useState } from "react";

const ProfilePhotoSelector = ({ image, setImage }) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // When user selects image
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Remove selected image
  const handleRemoveImage = () => {
    setImage(null);
    setPreviewUrl(null);
  };

  // Open file picker
  const onChooseFile = () => {
    inputRef.current?.click();
  };

  return (
    <div className="flex justify-center mb-6">
      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
      />

      {/* If no preview show avatar */}
      {!previewUrl ? (
        <div className="w-20 h-20 flex items-center justify-center bg-purple-100 rounded-full relative overflow-visible">
          <User className="text-purple-500" size={35} />

          <button
            onClick={onChooseFile}
            className="w-8 h-8 flex items-center justify-center bg-purple-600 text-white rounded-full absolute bottom-0 right-0 shadow-md"
          >
            <Upload size={15} />
          </button>
        </div>
      ) : (
        // Show preview
        <div className="relative">
          <img
            src={previewUrl}
            alt="profile photo"
            className="w-20 h-20 rounded-full object-cover"
          />

          <button
            onClick={handleRemoveImage}
            className="w-8 h-8 flex items-center justify-center bg-red-800 text-white rounded-full absolute -bottom-1 -right-1"
          >
            <Trash size={15} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePhotoSelector;
