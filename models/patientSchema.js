const mongoose = require("mongoose");

const patientSchema = mongoose.Schema(
  {
    patientData: {
      name: {
        type: String,
        required: true,
      },
      relationship: {
        type: String,
        required: true,
      },
      registrationP: {
        type: String,
        required: true,
      },
      registrationNumber: {
        type: String,
        required: true,
      },
      pdfLinks: [{ type: String }],
      ticketId: {
        type: String,
        required: true,
      },
    },
  },
  {
    timestamp: true,
    collection: "PatientRegistration",
  }
);

const Patient = mongoose.model("Patient", patientSchema);

module.exports = Patient;
