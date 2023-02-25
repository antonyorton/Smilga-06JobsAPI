import Job from "../models/Job.js"
import { StatusCodes } from "http-status-codes"
import { BadRequestError, NotFoundError } from "../errors/index.js"

const getAllJobs = async (req, res) => {
  const jobs = await Job.find({createdBy: req.user.userId}).sort('createdAt')
  res.status(StatusCodes.OK).json({jobs, count: jobs.length})
}

const getJob = async (req, res) => {
  const {
    user:{userId},
    params:{id:jobId}
  } = req
  
  const job = await Job.findOne({
    createdBy: userId,
    _id: jobId
  })

  if(!job){
    throw new NotFoundError(`No job with id ${jobId}`)
  }

  res.status(StatusCodes.OK).json({job})

}

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId //add a 'createdBy property to req.body
  const job = await Job.create(req.body)
  res.status(StatusCodes.CREATED).json(job)
}

const updateJob = async (req, res) => {

  const {
    body: { company, position },
    user:{ userId} ,
    params:{ id:jobId }
  } = req
  
  if(company === '' || position === '') {
    throw new BadRequestError('Company or position can not be empty')
  }

  const job = await Job.findByIdAndUpdate({
    createdBy: userId,
    _id: jobId
    }, req.body, {new:true, runValidators:true})

  if(!job){
    throw new NotFoundError(`No job with id ${jobId}`)
  }

  res.status(StatusCodes.OK).json({job})
}

const deleteJob = async (req, res) => {

  const {
    user: { userId },
    params: { id:jobId }
  } = req
  
  const job = await Job.findOneAndRemove({
    createdBy: userId,
    _id: jobId
  })

  if(!job){
    throw new NotFoundError(`No job with id ${jobId}`)
  }

  res.status(StatusCodes.OK).send()
}

export {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob
}

