import User from "../models/User.js"
import { StatusCodes  } from "http-status-codes"
import { BadRequestError, UnauthenticatedError } from "../errors/index.js"
import bcrypt from 'bcryptjs'

const register = async (req, res) => {
 
  const user = await User.create(req.body)
  const token = user.createJWT()
  res.status(StatusCodes.CREATED).json({ user: {name: user.name}, token })
}

const login = async (req, res) => {
  const {email, password } = req.body

  //check that values supplied for both email and password
  if(!email || !password) {
    throw new BadRequestError('Please provide email and password')
  }

  //check user exists in the database
  const user = await User.findOne({email})
  if(!user) {
    throw new UnauthenticatedError('Invalid credentials')
  }

  //check password provided matches the (encrypted) one in the database
  const passwordCheck = await user.checkPassword(password)
  if(!passwordCheck) {
    throw new UnauthenticatedError('Invalid credentials')
  }

  //create token
  const token = user.createJWT()

  //send response
  res.status(StatusCodes.OK).json({ user: {name: user.name}, token })
}

export {
  register,
  login
}