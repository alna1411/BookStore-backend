// 7. import dotenv
require("dotenv").config() // loads .env file contents into process.env by default

// 1. import express
const express = require("express")

// 5. import cors
const cors = require("cors")

// 8. import routes
const router = require("./router")

// 11. import connection file
require("./db/connection")

// 2. create server
const bookStoreServer = express()


// 6. tell server to use cors
bookStoreServer.use(cors())

// 10. parse request  //middleware
bookStoreServer.use(express.json())

// 9. tell server to use router
bookStoreServer.use(router)

bookStoreServer.use("/imguploads",express.static("./imguploads"))

// 3. create port
const PORT = 3000

// 4. tell server to listen
bookStoreServer.listen(PORT,()=>{
    console.log(`Bookstore Server started Running Successfully at Port number : ${PORT}, Waiting forClient Request`);
    
})

bookStoreServer.get("/",(req, res)=>{
    res.status(200).send(`Bookstore Server Started Running succesfully and waiting for Client Request`)
})

// bookStoreServer.post("/", (req, res)=>{
//     res.status(200).send(`POST REQUEST`)
// })