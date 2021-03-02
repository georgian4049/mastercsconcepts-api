const mongoose = require("mongoose");

const RequestSchema = new mongoose.Schema(
  {
    id: {
      type: mongoose.Schema.Types.ObjectId,
    },
    email: {
      type: String,
      required: true,
    },
    requestType: {
      type: String,
      required: true,
    },
    accountName: {
      type: String,
      required: true,
    },
    businessCCCostCenter: {
      type: String,
      required: true,
    },
    projectName: {
      type: String,
      required: true,
    },
    AWSService: {
      type: String,
      required: true,
    },
    resourceType: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    budget: {
      type: Number,
      required: true,
    },
    justification: {
      type: String,
      required: true,
    },
    usageDuration: {
      type: Number,
      required: true,
    },
    projectSponsor: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    requestedOn: {
      type: Date,
      required: true,
    },
    updatedOn: {
      type: Date,
    },
  },
  { versionKey: false }
);

module.exports = Request = mongoose.model("Request", RequestSchema);
