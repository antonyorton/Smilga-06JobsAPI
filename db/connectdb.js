import mongoose from 'mongoose'

//connect to the mongoDB (note if local first start docker then [docker-compose -f mongoload.yaml up] must be run from the command line to fire up the database and container on docker)
const connectdb = async (connectionuri, myDbName) => {
  console.log('attempting to connect to database, please wait ..')
  try {
    await mongoose.connect(connectionuri,
      {
        dbName: myDbName,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    )
  console.log('running mongodb from docker ..')
  } catch (err) {
    throw err
  }
}

export default connectdb
