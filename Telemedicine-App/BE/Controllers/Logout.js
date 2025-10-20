const logout = (req, res) => {
    let message = '';
    const token = req.cookies.jwt;  

    if (!token) {
        message = 'No token found';
        return res.status(400).json(message);
    }

    res.clearCookie('jwt', { httpOnly: true, secure: true, sameSite: 'Strict' });

    message = 'Logout successful';
    return res.json({ message: message });
};

module.exports = { logout };
