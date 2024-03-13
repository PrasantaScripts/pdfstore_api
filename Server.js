const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const Patient = require("./models/patientSchema");

const app = express();
app.use(cors());
app.use(bodyParser.json());

//mongoDb connection
mongoose.connect(process.env.DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

//api creation

app.get("/", (req, res) => {
  const pdfUrl =
    "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
  const encodedUrl = encodeURIComponent(pdfUrl);
  console.log(encodedUrl);
  res.send(encodedUrl);
});

app.post("/patients/:registrationP/:pdfLink", async (req, res) => {
  const { registrationP, pdfLink } = req.params;
  const decodedPdfLink = decodeURIComponent(pdfLink);

  try {
    const patient = await Patient.findOne({
      "patientData.registrationP": registrationP,
    });

    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }
    patient.patientData.pdfLinks.push(decodedPdfLink);

    await patient.save();

    res.status(200).json({ message: "PDF link stored successfully" });
  } catch (error) {
    console.error("Error storing PDF link:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//checking for  existing user
// app.get("/patients/:registrationP", async (req, res) => {
//   const { registrationP } = req.params;

//   try {
//     const patient = await Patient.findOne({
//       "patientData.registrationP": registrationP,
//     });
//     if (!patient) {
//       return res.status(404).json({ error: "Patient not found" });
//     }
//     res.status(200).json(patient);
//   } catch (error) {
//     console.error("Error fetching patient data:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

//inserting data

// const newData = {
//   patientData: {
//     name: "juggy",
//     relationship: "mother",
//     registrationP: "12345",
//     registrationNumber: "123456",
//     pdfLinks: [],
//     ticketId: "121212",
//   },
// };

// const insertData = async () => {
//   try {
//     const result = await Patient.create(newData);
//     console.log("Data inserted successfully:", result);
//   } catch (error) {
//     console.error("Error inserting data:", error);
//   } finally {
//     // Close the connection after inserting data
//     mongoose.connection.close();
//   }
// };

// insertData(newData);

//server
const PORT = process.env.PORT || 5200;
app.listen(PORT, () => {
  console.log(`server is running on port number ${PORT}`);
});
