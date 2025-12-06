module.exports = {
    
    createNewUser(req,res,next){
        const requiredFileds = ["firstName", "lastName", "email", "username", "password"]
        const errors = []
        
        requiredFileds.forEach(field => {
            if(!req.body[field]){
                errors.push(`${field} is required`)
            }
        })

        if(errors.length > 0){
            return res.render("Pages/signin", {
                errors,
                errorMsg: null,
                successMsg: null
            })
        }
        next()
        
        
    }
}