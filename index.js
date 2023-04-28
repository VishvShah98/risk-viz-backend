import { getDataByDecade, getDecades, getData } from "./controllers/data.js";
import { getAggDataByAssetName } from "./controllers/aggData.js";
import { fetchData } from "./fetchData/fetchData.js";
import { connectAndInsertData, connectAndInsertAggData } from "./uploadData/data.js";
import cors from 'cors';
import dotenv from "dotenv";
import express from "express";
dotenv.config();

const PORT = process.env.PORT;

const app = express();
app.use(cors()); 
app.use(express.json());


// define a route to fetch data based on decade
app.get("/api/getDataByDecade", getDataByDecade);

//route to get all the distinct decades in the dataset
app.get("/api/getDecades", getDecades);

// define a route to fetch all the data from the "Data" collection
app.get("/api/getData", getData);

// define a route to fetch data based on asset name
app.get("/api/getAggDataByAssetName", getAggDataByAssetName);

// fetch the data, connect to MongoDB, and insert the data
const storeDataInMongoDB = async () => {
  const data = await fetchData();
  await connectAndInsertData(data);
  await connectAndInsertAggData(data);
};

// call the function to store the data in MongoDB and start the server
//storeDataInMongoDB();
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));




