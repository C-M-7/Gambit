const handleAuth = async (req, res) =>{
    return res.status(200).json({msg : 'in auth'});
}

module.exports = handleAuth;