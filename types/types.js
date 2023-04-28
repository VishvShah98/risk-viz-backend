import mongoose from "mongoose";


export const DataRow = new mongoose.Schema({
    "Asset Name": String,
    Lat: Number,
    Long: Number,
    "Business Category": String,
    "Risk Rating": Number,
    "Risk Factors": String,
    Year: Number,
    Decade: Number,
  });

  
export const DataGroupSchema = new mongoose.Schema({
    "Asset Name": String,
    "Business Category": String,
    Year: Number,
    "Risk Rating Avg": Number,
    "Risk Factors Avg": {
      type: Map,
      of: Number,
    },
  });

export const DataGroupModel =  mongoose.models.DataGroup || mongoose.model("DataGroup", DataGroupSchema);
export const DataModel = mongoose.models.Data || mongoose.model("Data", DataRow);