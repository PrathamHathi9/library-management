const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const userSchema = mongoose.Schema(
    {
        name :{
            type : String,
            required : true
        },
        email :{
            type : String,
            required : true,
            unique : true
        },
        password : {
            type : String,
            required : true,
            select : false
        }
    }
)
// console.log(userSchema)

userSchema.pre('save' , async function(next){
    const data = this;
    if(!data.isModified('password')) return next();
    try{
        const saltRounds = 10;
        const salt = await bcrypt.hash(data.password, saltRounds);
        const hashedPassword = await bcrypt.hash(data.password, salt);
        data.password = hashedPassword;
        next();
    }
    catch(err)
    {
        return next(err);
    }
})

userSchema.methods.comparePassword = async function(candidatePassword)
{
    try{
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    }
    catch(err)
    {
        throw err;
    }
}

let schema = mongoose.model("users", userSchema);
module.exports = schema;