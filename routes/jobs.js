import express from 'express'
//authentication middleware
const jobsRouter = express.Router()

import {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob
} from '../controllers/jobs.js'


jobsRouter.route('/').post(createJob).get(getAllJobs)
jobsRouter.route('/:id').get(getJob).delete(deleteJob).patch(updateJob)

export default jobsRouter