import { ROLES } from "../constants.js";
import ApiResponse from "../utils/apiResponse.js";

const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res
      .status(401)
      .json(new ApiResponse(401, null, "Unauthorized"));
  }

  if (req.user.role !== ROLES.ADMIN) {
    return res
      .status(403)
      .json(new ApiResponse(403, null, "Access denied: Admins only"));
  }

  next();
};

export default isAdmin;
