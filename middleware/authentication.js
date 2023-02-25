import jwt from 'jsonwebtoken'
import { UnauthenticatedError } from "../errors/index.js"

const authenticationMiddleware = async (req, res, next) => {
  
  const authHeader = req.headers.authorization
  
  //check a token was provided
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw new UnauthenticatedError('Invalid authentication')
  }

  const token = authHeader.split(' ')[1]
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const {userId, name} = payload
    req.user = {userId, name}
    next()
  } catch (error) {
    throw new UnauthenticatedError('Invalid authentication')
  }
  
}

export default authenticationMiddleware