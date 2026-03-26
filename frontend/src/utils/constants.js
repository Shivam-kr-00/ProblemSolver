// Task Status Constants
export const TASK_STATUS = {
  OPEN: "OPEN",
  ASSIGNED: "ASSIGNED",
  IN_PROGRESS: "IN_PROGRESS",
  IN_REVIEW: "IN_REVIEW",
  COMPLETED: "COMPLETED",
  REOPENED: "REOPENED",
  CANCELLED: "CANCELLED",
};

// Task Difficulty Constants
export const TASK_DIFFICULTY = {
  EASY: "EASY",
  MEDIUM: "MEDIUM",
  HARD: "HARD",
};

// Problem Status Constants
export const PROBLEM_STATUS = {
  OPEN: "OPEN",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  CLOSED: "CLOSED",
};

// Problem Category Constants
export const PROBLEM_CATEGORY = {
  PUBLIC: "public",
  PRIVATE: "private",
  GOVERNMENT: "government",
};

// User Roles
export const USER_ROLE = {
  ADMIN: "ADMIN",
  USER: "USER",
  MODERATOR: "MODERATOR",
};

// Status Color Map
export const STATUS_COLORS = {
  [TASK_STATUS.OPEN]: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  [TASK_STATUS.ASSIGNED]: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  [TASK_STATUS.IN_PROGRESS]: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  [TASK_STATUS.IN_REVIEW]: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  [TASK_STATUS.COMPLETED]: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  [TASK_STATUS.REOPENED]: "bg-red-500/10 text-red-400 border-red-500/30",
  [TASK_STATUS.CANCELLED]: "bg-gray-500/10 text-gray-400 border-gray-500/30",
};

// Difficulty Color Map
export const DIFFICULTY_COLORS = {
  [TASK_DIFFICULTY.EASY]: "text-green-400 bg-green-400/10 border-green-400/20",
  [TASK_DIFFICULTY.MEDIUM]: "text-orange-400 bg-orange-400/10 border-orange-400/20",
  [TASK_DIFFICULTY.HARD]: "text-red-400 bg-red-400/10 border-red-400/20",
};

// Problem Status Color Map
export const PROBLEM_STATUS_COLORS = {
  [PROBLEM_STATUS.OPEN]: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  [PROBLEM_STATUS.IN_PROGRESS]: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  [PROBLEM_STATUS.COMPLETED]: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  [PROBLEM_STATUS.CLOSED]: "bg-slate-500/10 text-slate-400 border-slate-500/30",
};

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: "/auth",
  PROBLEMS: "/problems",
  TASKS: "/tasks",
  USERS: "/users",
  ADMIN: "/admin",
};

// Routes
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  PROBLEMS: "/problems",
  PROBLEM_DETAIL: "/problems/:id",
  MY_TASKS: "/my-tasks",
  PROFILE: "/profile",
  ADMIN_DASHBOARD: "/admin",
  ADMIN_PROBLEMS: "/admin/problems",
  ADMIN_TASKS: "/admin/tasks",
  ADMIN_USERS: "/admin/users",
  EDIT_PROBLEM: "/admin/problems/:problemId/edit",
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

// Animation Durations (in ms)
export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 800,
};

// Toast Duration (in ms)
export const TOAST_DURATION = {
  SHORT: 2000,
  NORMAL: 3000,
  LONG: 4000,
  VERY_LONG: 5000,
};

// Error Messages
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: "This field is required",
  INVALID_EMAIL: "Please enter a valid email",
  PASSWORD_MISMATCH: "Passwords do not match",
  UNAUTHORIZED: "You are not authorized to perform this action",
  NOT_FOUND: "The requested resource was not found",
  SERVER_ERROR: "An unexpected server error occurred",
  NETWORK_ERROR: "Network error. Please check your connection",
};

// Success Messages
export const SUCCESS_MESSAGES = {
  CREATED: "Successfully created",
  UPDATED: "Successfully updated",
  DELETED: "Successfully deleted",
  CLAIMED: "Task claimed successfully",
  SUBMITTED: "Successfully submitted",
  APPROVED: "Successfully approved",
  REJECTED: "Successfully rejected",
};

// Empty State Messages
export const EMPTY_STATE_MESSAGES = {
  NO_PROBLEMS: "No problems available yet",
  NO_TASKS: "No tasks assigned yet",
  NO_USERS: "No users found",
  NO_RESULTS: "No results found matching your search",
};

export default {
  TASK_STATUS,
  TASK_DIFFICULTY,
  PROBLEM_STATUS,
  PROBLEM_CATEGORY,
  USER_ROLE,
  STATUS_COLORS,
  DIFFICULTY_COLORS,
  PROBLEM_STATUS_COLORS,
  API_ENDPOINTS,
  ROUTES,
  PAGINATION,
  ANIMATION_DURATIONS,
  TOAST_DURATION,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  EMPTY_STATE_MESSAGES,
};
