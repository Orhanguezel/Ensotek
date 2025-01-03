const setTokenCookie = (res, token, maxAge = 15 * 60 * 1000) => {
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge,
        sameSite: 'lax',
    });
};

const setRefreshTokenCookie = (res, token, maxAge = 7 * 24 * 60 * 60 * 1000) => {
    res.cookie('refreshToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge,
        sameSite: 'lax',
    });
};

module.exports = { setTokenCookie, setRefreshTokenCookie };
