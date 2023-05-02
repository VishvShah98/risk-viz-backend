//Two separate databases have been created.
//First is the original data fetched from the excel sheet
//Second is the aggregated data.

//Tthe original data is not suitablefor displaying on a map because
//it only has 11 unique location/coordinates out of thousands of entries.

//Random variance is added to the location in original dataset to display separate markers on the map.

//Second database (aggregated data) was created to display average risk score for each asset name on the line chart.

import { getDataByDecade, getDecades, getData } from "./controllers/data.js";
import { getAggDataByAssetName } from "./controllers/aggData.js";
import { fetchData } from "./fetchData/fetchData.js";
import { connectAndInsertData, connectAndInsertAggData } from "./uploadData/data.js";
import helmet from "helmet";
import cors from 'cors';
import dotenv from "dotenv";
import express from "express";
dotenv.config();

const PORT = process.env.PORT;

const app = express();
app.use(helmet());
app.use(cors());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});


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
  // fetch the data from excel sheet
  const data = await fetchData();
  // connect to MongoDB and insert the fetched data
  await connectAndInsertData(data);
  // connect to MongoDB and insert the aggregated data
  await connectAndInsertAggData(data);
};

// call the function to store the data in MongoDB and start the server
//storeDataInMongoDB();
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));




