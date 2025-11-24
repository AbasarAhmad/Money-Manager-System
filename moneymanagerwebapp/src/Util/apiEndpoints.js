// apiEndpoints.js

export const BASE_URL = "http://localhost:8081/api";
const CLOUDINARY_CLOUD_NAME = "dxq3rwtvp"

export const API_ENDPOINTS = {
    LOGIN: "/profile/login",
    REGISTER: "/profile/register",
    GET_USER_INFO: "/profile/current",
    GET_ALL_CATEGORIES: "/category",
    ADD_CATEGORY: "/category/add",
    GET_ALL_INCOMES: "/income/get",
    UPDATE_CATEGORY: (categoryId) => `/category/update/${categoryId}`,
    UPLOAD_IMAGE: `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    CATEGORY_BY_TYPE: (type) => `/category/type/${type}`,
    ADD_INCOME: "/income/add",
    DELETE_INCOME: (id) => `/income/delete/${id}`,

    GET_ALL_EXPENSES: "/expense/get",
    ADD_EXPENSE: "/expense/add",
    DELETE_EXPENSE: (id) => `/expense/delete/${id}`,

    CATEGORY_BY_TYPE: (type) => `/category/type/${type}`,
    INCOME_EXCEL_DOWNLOAD: "/excel/download/income",
    EMAIL_INCOME: "/email/income-excel",

    EXPENSE_EXCEL_DOWNLOAD: "/excel/download/expense",
    EMAIL_EXPENSE: "/email/expense-excel",

    APPLY_FILTERS: "/filter/filter",
    GET_DASHBOARD: "/dashboard/get",
    DELETE_CATEGORY: (categoryId) => `/category/delete/${categoryId}`
};
