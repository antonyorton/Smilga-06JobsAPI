import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide name'],
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, "please provide a valid email"
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: 6,
  },
})


UserSchema.pre('save', async function () {
  //middleware to hash password prior to saving document
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)  //we use the (this) keyword because (this) is pointing to the document which will be passed through the pre middleware.
})

UserSchema.methods.createJWT = function () {
  return jwt.sign(
    {userId: this._id, name: this.name},
    process.env.JWT_SECRET,
    {expiresIn: process.env.JWT_LIFETIME}
  )
}

UserSchema.methods.checkPassword = async function (password) {
  return await bcrypt.compare(password,this.password)
}



const User = mongoose.model('User', UserSchema)

export default User