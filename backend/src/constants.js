
export const ROLES = {
  PUBLIC: "PUBLIC",
  DEVELOPER: "DEVELOPER",
  ADMIN: "ADMIN",
};


export const PROBLEM_STATUS = {
  OPEN: "OPEN",
  IN_PROGRESS: "IN_PROGRESS",
  SOLVED: "SOLVED",
  ARCHIVED: "ARCHIVED",
};


export const TASK_STATUS = {
  OPEN: "OPEN",
  CLAIMED: "CLAIMED",
  SUBMITTED: "SUBMITTED",
  VERIFIED: "VERIFIED",
};

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/signup",
  PROBLEMS: "/problems",
  ADMIN: "/admin",
  DASHBOARD: "/dashboard",
  LOGOUT: "/logout",

};


export const PROBLEM_CATEGORIES = [
  { key: "WEB", label: "Web Development" },
  { key: "MOBILE", label: "Mobile App Development" },
  { key: "AI_ML", label: "AI / ML" },
  { key: "IOT", label: "IoT / Hardware" },
  { key: "SYSTEM", label: "Backend / System Design" },
];


export const THEME = {
  colors: {
    primary: "#1E40AF",
    accent: "#22C55E",
    background: "#0F172A",
    card: "#020617",
    textPrimary: "#F8FAFC",
    textSecondary: "#94A3B8",
  },
};
