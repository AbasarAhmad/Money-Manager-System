// apiEndpoints.js

export const BASE_URL = "http://localhost:8081/api";
const CLOUDINARY_CLOUD_NAME="dxq3rwtvp"

export const API_ENDPOINTS = {
    LOGIN: "/profile/login",
    REGISTER: "/profile/register",
    GET_USER_INFO: "/profile/current",
    GET_ALL_CATEGORIES:"/category",
    UPLOAD_IMAGE: `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`
};
