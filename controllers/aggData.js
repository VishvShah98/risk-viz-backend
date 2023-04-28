import mongoose from "mongoose";

import { DataGroupModel } from "../types/types.js";
import dotenv from "dotenv";
dotenv.config();
const uri = process.env.MONGO_URL;


//get data by asset name
// export const getAggDataByAssetName = async (req, res) => {
//     try {
//         const assetname = req.query.assetname;
//         await mongoose.connect(uri, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//         });
//         const data = await DataGroupModel.find({ 'Asset Name': assetname }, { _id: 0, __v:0 });
//         res.json(data);
//     } catch (error) {
//         console.log(error);
//         res.status(500).send("Error fetching data");
//     }
//     }

export const getAggDataByAssetName = async (req, res) => {
    try {
      const assetname = req.query.assetname;
      await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      const data = await DataGroupModel.aggregate([
        { $match: { 'Asset Name': assetname } },
        {
          $group: {
            _id: {
              'Asset Name': '$Asset Name',
              'Business Category': '$Business Category',
            },
            data: {
              $push: {
                Year: '$Year',
                'Risk Rating Avg': '$Risk Rating Avg',
                'Risk Factors Avg': '$Risk Factors Avg',
              },
            },
          },
        },
        { $unwind: '$data' },
        { $sort: { 'data.Year': 1 } },
        {
          $group: {
            _id: {
              'Asset Name': '$_id.Asset Name',
              'Business Category': '$_id.Business Category',
            },
            data: { $push: '$data' },
          },
        },
      ]);
      res.json(data);
    } catch (error) {
      console.log(error);
      res.status(500).send('Error fetching data');
    }
  };
  