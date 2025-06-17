const isAdminUser = (req,res,next) => {
    if(req.userInfo.role !== 'admin') {
        return res.status(404).json({
            success: false,
            message: "Access is denied. Admin rights required"
        })
    }
    next()
}

module.exports = isAdminUser