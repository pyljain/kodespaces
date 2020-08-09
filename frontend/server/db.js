const { Client } = require('pg')

const client = new Client({
  user: 'postgres',
  host: 'postgresql',
  database: 'postgres',
  password: process.env.DB_PASSWORD,
  port: 5432,
});



const CREATE_TABLE_QUERY = `
CREATE TABLE IF NOT EXISTS projects (
  id serial PRIMARY KEY,
  name TEXT,
  status TEXT,
  language TEXT,
  cpu NUMERIC(2,1),
  memory INT,
  owner TEXT
);
`

const constructSchema = async () => {
  await client.query(CREATE_TABLE_QUERY)
}

const connect = async () => {
  await client.connect()
  await constructSchema()
}

const getProjects = async (userId) => {
  const query = `
    SELECT * FROM projects WHERE owner = $1
  `
  const res = await client.query(query, [userId])

  return res.rows
}

const createProject = async (project, userId) => {
  const createProjectQuery = `
    INSERT INTO projects (name, language, status, cpu, memory, owner)
      VALUES ($1, $2, $3, $4, $5, $6)
  `
  await client.query(createProjectQuery,
    [project.name, project.language, "New",
    project.cpu, project.memory, userId])
}

module.exports = {
  connect,
  createProject,
  getProjects
}