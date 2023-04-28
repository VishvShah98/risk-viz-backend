import  XLSX  from "xlsx";
import axios from "axios";

// fetch the data from the Excel file
export const fetchData = async () => {
    const url = process.env.DATA_URL;
    const response = await axios.get(url, { responseType: "arraybuffer" });
    const workbook = XLSX.read(response.data, { type: "array" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet, {
      defval: null,
      header: 1,
      raw: false,
      blankrows: false,
      dateNF: "yyyy-mm-dd",
    });
    console.log("-----DATA FETCHED FROM GOOGLE DOCS-----");
    return data
    .slice(1) // Exclude the first row of headers
    .map((row) => {
      const year = row[6];
      const decade = `${Math.floor(year / 10) * 10}`;
      const lat = Number(row[1]);
      const long = Number(row[2]);
      const randomLat = isNaN(lat) ? null : Number((lat + (Math.random() - 0.5) / 5).toFixed(6));
      const randomLong = isNaN(long) ? null : Number((long + (Math.random() - 0.5) / 5).toFixed(6));
      return {
        "Asset Name": row[0],
        Lat: randomLat,
        Long: randomLong,
        "Business Category": row[3],
        "Risk Rating": Number(row[4]),
        "Risk Factors": row[5],
        Year: Number(year),
        Decade: Number(decade),
      };
    });
  };