import 'dotenv/config';
import 'express-async-errors';
import express from 'express'


//extra security packages
import helmet from 'helmet';
import cors from 'cors';
import xss from 'xss-clean';
import rateLimiter from 'express-rate-limit';


//Swagger
import swaggerUI from 'swagger-ui-express'
import YAML from 'yamljs'
const swaggerDocument = YAML.load('./swagger.yaml')


const app = express();

//react frontend URL (note express PORT variable cannot be 3000)
// app.use(cors({origin: 'http://localhost:3000'}))

// database
import connectdb from './db/connectdb.js'

//authentication middleware
import authenticationMiddleware from './middleware/authentication.js';

//routers
import authRouter from './routes/auth.js'
import jobsRouter from './routes/jobs.js'

// error handler
import notFoundMiddleware from './middleware/not-found.js';
import errorHandlerMiddleware from './middleware/error-handler.js';

//static files folder
app.use(express.static('./public'))
//request rate limiter middleware
app.set('trust proxy', 1)
app.use('/api/v1', rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  }))
//json middleware
app.use(express.json())
//security middleware
app.use(helmet())
app.use(cors())
app.use(xss())


app.get('/', (req, res) => {
  res.send('<h1>Jobs API</h1><a href="/api-docs">Documentation</a>')
})
app.use('/api-docs',swaggerUI.serve,swaggerUI.setup(swaggerDocument))


//routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs', authenticationMiddleware, jobsRouter)

//middleware
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

//connect to the mongoDB (for this exercise we will not need a database)
//VERY IMPORTANT: if local/docker mongodb instance then first start docker then [docker-compose -f mongoload.yaml up] MUST be run from the command line to fire up the database and container on docker)
const database_name = '06_JobsAPI'
await connectdb(process.env.MONGO_URI, database_name)


//after connection ok'd then listen to port
try {
  app.listen(port,console.log(`Server is listening on port ${port}....`))
} catch(error) {
  console.log(error)
}