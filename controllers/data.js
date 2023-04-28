
import mongoose from "mongoose";

import { DataModel } from "../types/types.js";
import dotenv from "dotenv";
dotenv.config();
const uri = process.env.MONGO_URL;


export const getDataByDecade = async (req, res) => {
    try {
      const decade = req.query.decade;
      await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      const data = await DataModel.find({ Decade: Number(decade) }, { Decade: 0, __v:0 });
      res.json(data);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error fetching data");
    }
  };

  export const getDecades = async (req, res) => {
    try {
        await mongoose.connect(uri, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        const decades = await DataModel.distinct("Decade");
        res.json(decades);
      } catch (error) {
        console.log(error);
        res.status(500).send("Error fetching decades");
      }
    };

   export const getData = async (req, res) => {
        try {
          await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          });
          const data = await DataModel.find({});
          res.json(data);
        } catch (error) {
          console.log(error);
          res.status(500).send("Error fetching data");
        }
      };