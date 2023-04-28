import { DataModel, DataGroupModel } from "../types/types.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const uri = process.env.MONGO_URL;

// connect to MongoDB and insert the data
export const connectAndInsertData = async (data) => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("-----CONNECTED TO MONGODB-----");

    console.log("-----UPLOADING DATA TO MONGODB-----");
    await DataModel.insertMany(data);
    console.log("-----DATA UPLOADED TO MONGODB-----");
    await mongoose.connection.close();
    console.log("-----MONGODB CONNECTION CLOSED-----");
  } catch (error) {
    console.log(`${error} did not connect`);
  }
};

// export const connectAndInsertAggData = async (data) => {
//   try {
//     await mongoose.connect(uri, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });

//     console.log("-----CONNECTED TO MONGODB-----");

//     const groups = {};

//     data.forEach((obj) => {
//       const {
//         "Asset Name": assetname,
//         "Business Category": businessCategory,
//         Year: year,
//         "Risk Rating": riskRating,
//         "Risk Factors": riskFactors,
//       } = obj;

//       const key = `${assetname}-${businessCategory}-${year}`;

//       if (!groups[key]) {
//         groups[key] = {
//           assetname,
//           businessCategory,
//           year,
//           riskRatingSum: 0,
//           riskFactorsSum: {},
//           count: 0,
//         };
//       }

//       const group = groups[key];
//       group.riskRatingSum += riskRating;

//       const riskFactorsObj = JSON.parse(riskFactors);

//       Object.entries(riskFactorsObj).forEach(
//         ([riskFactor, riskFactorValue]) => {
//           if (!group.riskFactorsSum[riskFactor]) {
//             group.riskFactorsSum[riskFactor] = 0;
//           }
//           group.riskFactorsSum[riskFactor] += riskFactorValue;
//         }
//       );

//       group.count++;
//     });

//     const aggregatedData = Object.values(groups).map(
//       ({
//         assetname,
//         businessCategory,
//         year,
//         riskRatingSum,
//         riskFactorsSum,
//         count,
//       }) => {
//         const riskRatingAvg = Number((riskRatingSum / count).toFixed(2));

//         const riskFactorsCount = Object.keys(riskFactorsSum).length;
//         const riskFactorsAvg = {};
//         Object.entries(riskFactorsSum).forEach(
//           ([riskFactor, riskFactorSum]) => {
//             const riskFactorAvg = riskFactorSum / count;
//             riskFactorsAvg[riskFactor] = Number(riskFactorAvg.toFixed(2));
//           }
//         );

//         return {
//           assetname,
//           businessCategory,
//           year,
//           riskRatingAvg,
//           riskFactorsAvg,
//         };
//       }
//     );

//     // Insert the documents into MongoDB
//     await DataGroupModel.insertMany(aggregatedData);

//     console.log("-----DATA UPLOADED TO MONGODB-----");
//     await mongoose.connection.close();
//     console.log("-----MONGODB CONNECTION CLOSED-----");
//   } catch (error) {
//     console.log(`${error} did not connect`);
//   }
// };

export const connectAndInsertAggData = async (data) => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("-----CONNECTED TO MONGODB-----");

    const groups = {};

    data.forEach((obj) => {
      const {
        "Asset Name": assetname,
        "Business Category": businessCategory,
        Year: year,
        "Risk Rating": riskRating,
        "Risk Factors": riskFactors,
      } = obj;

      const key = `${assetname}-${businessCategory}-${year}`;

      if (!groups[key]) {
        groups[key] = {
          "Asset Name": assetname,
          "Business Category": businessCategory,
          Year: year,
          "Risk Rating Avg": 0,
          "Risk Factors Avg": {},
          "Risk Factors Count": 0,
          Count: 0,
        };
      }

      const group = groups[key];
      group["Risk Rating Avg"] += riskRating;

      const riskFactorsObj = JSON.parse(riskFactors);

      Object.entries(riskFactorsObj).forEach(
        ([riskFactor, riskFactorValue]) => {
          if (!group["Risk Factors Avg"][riskFactor]) {
            group["Risk Factors Avg"][riskFactor] = 0;
          }
          group["Risk Factors Avg"][riskFactor] += riskFactorValue;
        }
      );

      group["Risk Factors Count"] += Object.keys(riskFactorsObj).length;
      group.Count++;
    });

    const aggregatedData = Object.values(groups).map(
      ({
        "Asset Name": assetname,
        "Business Category": businessCategory,
        Year: year,
        "Risk Rating Avg": riskRatingAvg,
        "Risk Factors Avg": riskFactorsAvg,
        "Risk Factors Count": riskFactorsCount,
        Count: count,
      }) => {
        const roundedRiskFactorsAvg = {};
        Object.entries(riskFactorsAvg).forEach(([riskFactor, riskFactorAvg]) => {
          roundedRiskFactorsAvg[riskFactor] = Number(riskFactorAvg.toFixed(2));
        });

        return {
          "Asset Name": assetname,
          "Business Category": businessCategory,
          Year: year,
          "Risk Rating Avg": Number((riskRatingAvg / count).toFixed(2)),
          "Risk Factors Avg": roundedRiskFactorsAvg,
          "Risk Factors Count": riskFactorsCount,
          Count: count,
        };
      }
    );

    await DataGroupModel.insertMany(aggregatedData);

    console.log("-----DATA UPLOADED TO MONGODB-----");
    await mongoose.connection.close();
    console.log("-----MONGODB CONNECTION CLOSED-----");
  } catch (error) {
    console.log(`${error} did not connect`);
  }
};
