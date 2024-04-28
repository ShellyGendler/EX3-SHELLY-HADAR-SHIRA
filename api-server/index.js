const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const allRoutes = require("./routes");
const tcpClient = require('./tcpClient');


dotenv.config();

const database = "mongodb://" + process.env.LOCALHOST + ":27017";
mongoose
    .connect(database, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => console.log("mongodb connected"))
    .catch((err) => console.log(err));

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use("/api", allRoutes);

app.use(express.urlencoded({ extended: false }));

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

async function setupTcpConnection() {
    // Fetch environment variables
    const bfArrSize = process.env.BF_ARR_SIZE;
    const hashFuncCount = process.env.HASH_FUNC_COUNT;

    await tcpClient.connectToServer();
    await tcpClient.sendData(`${bfArrSize} ${hashFuncCount}`);
    await tcpClient.receiveData();

    //send malicous urls
    await tcpClient.sendData("1 "+"https://www.facebook.com");
    await tcpClient.receiveData();

    await tcpClient.sendData("1 "+"https://www.linkedin.com");
    await tcpClient.receiveData();
}


setupTcpConnection();