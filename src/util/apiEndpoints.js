export const BASEURL ="https://expensemanager-spring-1-9aop.onrender.com/api/v1.0";
//export const BASEURL ="http://localhost:8080/api/v1.0";
const CLOUDNARY_CLOUD_NAME = "dgtfeezch";




export const API_ENDPOINTS = {
    LOGIN: "/login",
    REGISTERL: "/register",
    GET_USER_INFO: "/profile",
    GET_ALL_CATEGORIES: "/categories",
    ADD_CATEGORIES: "/categories",
    UPDATE_CATEGORY: (categoryId) => `/categories/${categoryId}`,
    GET_ALL_INCOMES: "/incomes",
    GET_ALL_EXPENSES: "/expenses",
    CATEGORY_BY_TYPE: (type) => `/categories/${type}`,
    ADD_INCOMES: "/incomes",
    ADD_EXPENSES: "/expenses",
    DELETE_INCOME: (incomeId) => `/incomes/${incomeId}`,
    DELETE_EXPENSE: (expenseId) => `/incomes/${expenseId}`,
    INCOME_EXCEL_DOWNLOAD: "excel/download/income",
    EMAIL_INCOME: "/email/income-excel",
    EXPENSE_EXCEL_DOWNLOAD: "excel/download/expense",
    EMAIL_EXPENSE: "/email/expense-excel",
    APPLY_FILTERS: "/filter",
    DASHBOARD_DATA: "/dashboard",
    UPLOAD_IMAGE: `https://api.cloudinary.com/v1_1/${CLOUDNARY_CLOUD_NAME}/image/upload`
}

