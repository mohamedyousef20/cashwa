import Jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs';
import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import createError from "../utils/error.js";

// ==========================
// REGISTER NEW USER
// ROUTE: POST /api/v/auth/register
// ACCESS: PUBLIC
// ==========================
export const register = asyncHandler(async (req, res) => {
  // Create user
  const user = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  });

  // Generate JWT token
  const token = Jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET_KEY,
    { expiresIn: process.env.JWT_EXPIRE_DATE }
  );

  // Return success response with user data and token
  res.status(200).json({
    msg: "success",
    data: user,
    userToken: token,
  });
});

// ==========================
// USER LOGIN
// ROUTE: POST /api/v/auth/login
// ACCESS: PUBLIC
// ==========================
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    return next(new createError("Wrong password or email", 401));
  }

  // Validate password
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return next(new createError("Wrong password or email", 401));
  }

  // Generate JWT token
  const token = Jwt.sign(
    {
      id: user._id,
      email: user.email,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: process.env.JWT_EXPIRE_DATE }
  );

  // Return success response with user data and token
  res.status(200).json({
    message: "success",
    data: user,
    userToken: token,
  });
});

// ==========================
// VERIFY AUTH TOKEN
// ROUTE: Middleware
// PURPOSE: Authenticate Requests
// ==========================
export const verifyToken = asyncHandler(async (req, res, next) => {
  let token;

  // Extract token from Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // If no token is provided
  if (!token) {
    return next(new createError("You are not logged in, please login again", 401));
  }

  // Verify token
  const decoded = Jwt.verify(token, process.env.JWT_SECRET_KEY);

  // Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new createError("No user belongs to this token", 404));
  }

  // Check if user changed password after token was issued
  if (currentUser.passwordChangeAt) {
    const passwordChangeAtTimeStamp = parseInt(
      currentUser.passwordChangeAt.getTime() / 1000
    );

    if (passwordChangeAtTimeStamp > decoded.iat) {
      return next(new createError("Password changed recently, please login again", 401));
    }
  }

  // Attach user to request
  req.user = currentUser;
  next();
});

// ==========================
// AUTHORIZE USER ROLE
// ROUTE: Middleware
// PURPOSE: Role-Based Access Control
// ==========================
export const verifyRole = (...role) => {
  return asyncHandler(async (req, res, next) => {
    if (!role.includes(req.user.role)) {
      return next(new createError("You are not allowed to access this route", 403));
    }
    next();
  });
};
