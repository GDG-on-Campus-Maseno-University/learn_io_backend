const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const envUtils = require('../common/envUtils');
const { setAuthCookie } = require('../utils/cookieHelper');

// Cookie configuration
const cookieOptions = {
    httpOnly: true, // Prevent client-side JavaScript access
    secure: process.env.NODE_ENV === 'production', // Only HTTPS in production
    sameSite: 'strict', // Prevent CSRF attacks
    maxAge: 24 * 60 * 60 * 1000, // 1 day expiration
};

exports.register = async(req, res) => {
    try {
        const { name, email, role, password, passwordConfirm } = req.body;

        // Validate passwords match
        if (password !== passwordConfirm) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        // Check for existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create and save new user

        res.status(200).json({ user: safeUserData });
        const user = new User({ name, email, role, password });
        await user.save();

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, envUtils.get('JWT_SECRET'), {
            expiresIn: '1d'
        });
        setAuthCookie(res, token);
        // Set HTTP-only cookie
        res.cookie('token', token, cookieOptions)
            .status(201)
            .json({
                message: 'User registered successfully',
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.login = async(req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = jwt.sign({ id: user._id, role: user.role },
            envUtils.get('JWT_SECRET'), { expiresIn: '1d' }
        );
        setAuthCookie(res, token);
        // Set HTTP-only cookie
        res.cookie('token', token, cookieOptions)
            .status(200)
            .json({
                message: 'Login successful',
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.logout = (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    }).json({ message: 'Logged out successfully' });
};

exports.getAllUsers = async(req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json({
            status: 'success',
            results: users.length,
            data: { users }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

exports.updateUser = async(req, res) => {
    try {
        const updates = {
            name: req.body.name,
            profilePicture: req.body.profilePicture,
            bio: req.body.bio,
            role: req.body.role,
            status: req.body.role,
            is_deleted: req.body.is_deleted,
            phonenumber: req.body.phonenumber,
            school: req.body.school,
            speciality: req.body.speciality
                // Add other updatable fields here as necessary
        };

        const user = await User.findByIdAndUpdate(req.params.id, updates, {
            new: true,
            runValidators: true
        }).select('-password');

        if (!user) {
            return res.status(404).json({
                status: 'fail',
                message: 'User not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: { user }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

exports.deleteUser = async(req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id, { is_deleted: true }, { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                status: 'fail',
                message: 'User not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: { user }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// Middleware to verify cookie token
exports.verifyToken = async(req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        const decoded = jwt.verify(token, envUtils.get('JWT_SECRET'));
        req.user = await User.findById(decoded.id).select('-password');
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};



// Add these new methods to your existing userController

exports.changePassword = async(req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;
        const userId = req.user.id;

        // Validate inputs
        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({ message: 'All password fields are required' });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'New passwords do not match' });
        }

        // Get user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        res.status(200).json({ message: 'Password changed successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.requestPasswordReset = async(req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            // Don't reveal whether email exists for security
            return res.status(200).json({ message: 'If the email exists, a reset link has been sent' });
        }

        // Generate reset token (expires in 1 hour)
        const resetToken = jwt.sign({ id: user._id },
            envUtils.get('JWT_SECRET'), { expiresIn: '1h' }
        );

        // In production: Send email with reset link
        const resetLink = `http://yourapp.com/reset-password/${resetToken}`;
        console.log(`Password reset link: ${resetLink}`); // Remove in production

        res.status(200).json({ message: 'Password reset link sent' });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.resetPassword = async(req, res) => {
    try {
        const { token } = req.params;
        const { newPassword, confirmPassword } = req.body;

        if (!newPassword || !confirmPassword) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        // Verify token
        const decoded = jwt.verify(token, envUtils.get('JWT_SECRET'));
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        res.status(200).json({ message: 'Password reset successfully' });

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(400).json({ message: 'Reset token has expired' });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getProfile = async(req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.updateProfile = async(req, res) => {
    try {
        const updates = {
            name: req.body.name,
            profilePicture: req.body.profilePicture,
            bio: req.body.bio
        };

        const user = await User.findByIdAndUpdate(
            req.user.id,
            updates, { new: true, runValidators: true }
        ).select('-password');

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};