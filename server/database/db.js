import {Pool} from "pg"

import dotenv from 'dotenv'

dotenv.config()

const pool = new Pool({
    host: process.env.db_host,
    port: process.env.db_port,
    database: process.env.db_name,
    user: process.env.db_username,
    password: String(process.env.db_password)
})

export default pool