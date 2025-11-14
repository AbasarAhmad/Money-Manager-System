import { API_ENDPOINTS } from "./apiEndpoints";

const CLOUDINARY_UPLOAD_PRESET = "moneymanager";

const uploadProfileImage = async (image) => {
  const formData = new FormData();
  formData.append("file", image);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  // formData.append("cloud_name", "dxq3rwtvp"); // optional

  try {
    const response = await fetch(API_ENDPOINTS.UPLOAD_IMAGE, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error?.message ||
        errorData.message ||
        "Failed to upload image"
      );
    }

    const data = await response.json();
    return data.secure_url;

  } catch (error) {
    console.error("Image upload error:", error);
    throw error;
  }
};

export default uploadProfileImage;
