const express = require("express")
const db = require("./db")
const k8s = require('./k8s')
const dns = require('./dns')

const app = express()

app.use(express.json())

const USER_ID = "patnaikshekhar@gmail.com"

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/static/index.html`)
})

app.get("/projects", async (req, res) => {
  console.log("x-user", req.headers["x-user"])
  const userId = USER_ID
  const projects = await db.getProjects(userId)
  res.json(projects)
})

app.post('/project', async (req, res) => {
  console.log("x-user", req.headers["x-user"])
  console.log("Project creation request details", req.body)
  // Add project to database
  const userId = USER_ID  // req.headers["x-user"]
  try {

    console.log(`Creating ${req.body.name} in DB`)
    await db.createProject(req.body, userId)

    console.log(`Creating environment for ${req.body.name}`)
    const serviceName = await k8s.createEnvironment(req.body, userId)

    // Create domain entry for the created service, the entry is in the
    //format of {username-projectname}.code.shekharpatnaik.com

    console.log(`Creating domain for ${req.body.name}`)
    await dns.createRecord(serviceName)

    console.log(`Project - ${req.body.name} creation completed`)
    res.sendStatus(201)
  } catch (e) {
    console.log("Error occured when inserting project", e)
    res.sendStatus(500)
  }
})

// app.post('/project/:name/start', async (req, res) => {

// })

app.get('/heathz', (req, res) => {
  res.sendStatus(200)
})

app.use(express.static("./static"))

app.use((req, res, next) => {
  console.log(`URL is ${req.url} and response is ${res.statusCode}`)
  next()
})

const start = async () => {
  await db.connect()
  app.listen(80, () => {
    console.log("Server listening")
  })
}

start()
  .then(() => console.log("Server Started"))
  .catch(e => console.error("Error starting server", e))



