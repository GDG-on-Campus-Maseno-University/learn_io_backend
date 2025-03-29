// utils/cookieHelper.js
module.exports = {
    setAuthCookie: (res, token) => {
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 24 * 60 * 60 * 1000, // 1 day
            domain: process.env.COOKIE_DOMAIN || undefined // For cross-subdomain in production
        });
    },
    clearAuthCookie: (res) => {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            domain: process.env.COOKIE_DOMAIN || undefined
        });
    }
};