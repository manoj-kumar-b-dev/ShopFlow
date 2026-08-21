import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import User from '../models/User.js';
import cloudinary from '../config/cloudinary.js';

// Helper: Stream upload to cloudinary
const streamUpload = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, allowed_formats: ['jpg', 'jpeg', 'png', 'webp'], max_file_size: 5 * 1024 * 1024 },
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );
    stream.end(buffer);
  });
};

// Helper: Generate JWT and attach cookie option
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.generateToken();

  const cookieOptions = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 Days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  };

  res
    .status(statusCode)
    .cookie('token', token, cookieOptions)
    .json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    });
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      return next(new Error('A user account with this email already exists'));
    }

    let avatarData = {};
    if (req.file) {
      const uploadResult = await streamUpload(req.file.buffer, 'shopflow/avatars');
      avatarData.avatar = uploadResult.secure_url;
      avatarData.cloudinary_id = uploadResult.public_id;
    }

    const user = await User.create({ name, email, password, ...avatarData });
    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      return next(new Error('Please provide both an email and password'));
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      res.status(401);
      return next(new Error('Invalid credentials provided'));
    }

    // SECURITY: Prevent admin accounts from logging in through user login
    if (user.role === 'admin') {
      res.status(403);
      return next(new Error('Admin accounts must login through the admin portal'));
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

export const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      return next(new Error('Please provide both an email and password'));
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      res.status(401);
      return next(new Error('Invalid admin credentials provided'));
    }

    if (user.role !== 'admin') {
      res.status(403);
      return next(new Error('This account does not have admin access'));
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(404);
      return next(new Error('No account found with that email address'));
    }

    // Generate ephemeral reset token (Valid for 10 minutes)
    const resetToken = crypto.randomBytes(20).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Dynamically patch user model for temporary verification properties
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    // Build the reset link pointing to the FRONTEND page (not the backend API)
    const frontendOrigin = (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/+$/, '');
    const resetUrl = `${frontendOrigin}/reset-password/${resetToken}`;

    // Gmail SMTP transporter — credentials are read from env vars
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false, // STARTTLS
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Branded HTML email
    const htmlBody = `
      <!DOCTYPE html>
      <html lang="en">
      <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
      <body style="margin:0;padding:0;background-color:#f4f6f9;font-family:'Segoe UI',Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f9;padding:40px 0;">
          <tr><td align="center">
            <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
              <!-- Header -->
              <tr>
                <td style="background:linear-gradient(135deg,#4f46e5 0%,#6366f1 100%);padding:36px 40px;text-align:center;">
                  <span style="display:inline-block;background:rgba(255,255,255,0.15);border-radius:14px;padding:14px 20px;margin-bottom:16px;">
                    <span style="font-size:28px;">🛍️</span>
                  </span>
                  <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:700;letter-spacing:-0.5px;">ShopFlow</h1>
                  <p style="margin:6px 0 0;color:rgba(255,255,255,0.8);font-size:13px;letter-spacing:0.5px;text-transform:uppercase;">Password Recovery</p>
                </td>
              </tr>
              <!-- Body -->
              <tr>
                <td style="padding:40px;">
                  <h2 style="margin:0 0 12px;color:#111827;font-size:22px;font-weight:700;">Reset your password</h2>
                  <p style="margin:0 0 20px;color:#4b5563;font-size:15px;line-height:1.7;">
                    Hi <strong>${user.name}</strong>,<br><br>
                    We received a request to reset the password for your ShopFlow account. 
                    Click the button below to choose a new password. This link expires in <strong>10 minutes</strong>.
                  </p>
                  <!-- CTA Button -->
                  <div style="text-align:center;margin:32px 0;">
                    <a href="${resetUrl}"
                       style="display:inline-block;background:linear-gradient(135deg,#4f46e5 0%,#6366f1 100%);color:#ffffff;text-decoration:none;font-size:16px;font-weight:700;padding:16px 40px;border-radius:10px;letter-spacing:0.3px;box-shadow:0 4px 14px rgba(79,70,229,0.4);">
                      Reset My Password
                    </a>
                  </div>
                  <!-- Fallback URL -->
                  <p style="margin:20px 0 0;color:#6b7280;font-size:13px;line-height:1.6;">
                    Button not working? Paste this link into your browser:<br>
                    <a href="${resetUrl}" style="color:#4f46e5;word-break:break-all;">${resetUrl}</a>
                  </p>
                  <!-- Warning -->
                  <div style="margin:28px 0 0;padding:16px 20px;background:#fef9ec;border-left:4px solid #f59e0b;border-radius:8px;">
                    <p style="margin:0;color:#92400e;font-size:13px;line-height:1.6;">
                      ⚠️ If you did not request a password reset, you can safely ignore this email. Your password will not change.
                    </p>
                  </div>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="background:#f9fafb;padding:24px 40px;text-align:center;border-top:1px solid #e5e7eb;">
                  <p style="margin:0;color:#9ca3af;font-size:12px;line-height:1.6;">
                    © ${new Date().getFullYear()} ShopFlow. All rights reserved.<br>
                    This email was sent to ${user.email}
                  </p>
                </td>
              </tr>
            </table>
          </td></tr>
        </table>
      </body>
      </html>
    `;

    const message = {
      from: `"ShopFlow Security" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: 'ShopFlow — Password Reset Request',
      text: `You requested a password reset for your ShopFlow account.\n\nClick the link below to reset your password (expires in 10 minutes):\n\n${resetUrl}\n\nIf you did not request this, please ignore this email.`,
      html: htmlBody,
    };

    await transporter.sendMail(message);
    res.status(200).json({ success: true, message: 'Recovery email dispatched successfully' });
  } catch (error) {
    next(error);
  }
};


export const resetPassword = async (req, res, next) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');

    // Access un-exported models queries fields dynamically 
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      res.status(400);
      return next(new Error('Password reset token is invalid or has expired'));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};
