const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const Request = require("../../models/Requests");
const e = require("express");
const Mail = require("../../models/Mail");

router.get("/", auth, async (req, res) => {
  try {
    let requestLists = [];
    if (req.user.role === "client") {
      requestLists = await Request.find({ email: req.user.email });
    } else {
      if (req.query.status === "pending") {
        requestLists = await Request.find({ status: "pending" });
      } else {
        requestLists = await Request.find();
      }
    }
    return res.status(200).json({ data: requestLists.reverse() });
  } catch (error) {
    return res.status(500).json({ error: "Server Err" });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    request = new Request({
      email: req.user.email,
      requestType: req.body.requestType,
      accountName: req.body.accountName,
      businessCCCostCenter: req.body.businessCCCostCenter,
      projectName: req.body.projectName,
      AWSService: req.body.AWSService,
      resourceType: req.body.resourceType,
      quantity: req.body.quantity,
      budget: req.body.budget,
      justification: req.body.justification,
      usageDuration: req.body.usageDuration,
      projectSponsor: req.body.projectSponsor,
      status: "pending",
      requestedOn: new Date(),
      updatedOn: "",
    });
    await request.save(function (err, val) {
      if (err)
        return res
          .status(400)
          .json({ errors: { message: "Something Went Wrong" } });
    });
    return res.status(200).json(request);
  } catch (error) {
    return res.status(500).json({ errors: { message: "Server Error" } });
  }
});

router.put("/update/", auth, async (req, res) => {
  try {
    let updatedRequest = req.body;
    //deleting keys that are not part of schema
    delete updatedRequest.__v;
    if (updatedRequest.tableData) delete updatedRequest.tableData; // comes from material table
    //--
    if (req.query.status === "granted" || req.query.status === "declined") {
      updatedRequest.status = req.query.status;
      updatedRequest.updatedOn = new Date();
    }
    await Request.findByIdAndUpdate(req.body._id, updatedRequest, function (
      err,
      doc
    ) {
      if (err) {
        console.log("a");
        return res
          .status(400)
          .json({ errors: { message: "Something Went Wrong" } });
      }
    });
    await Mail.findByIdAndUpdate(
      req.body._id,
      { requestStatus: req.query.status },
      function (err, doc) {
        if (err) {
          console.log("a");
          return res
            .status(400)
            .json({ errors: { message: "Something Went Wrong" } });
        }
      }
    );
    return res
      .status(200)
      .json({ message: "Successfully Updated the request" });
  } catch (error) {
    return res.status(500).json({ errors: { message: "Server Error" } });
  }
});

router.delete("/", auth, async (req, res) => {
  try {
    await Request.findByIdAndDelete(req.query.id, function (err, doc) {
      if (err)
        return res
          .status(400)
          .json({ errors: { message: "Something Went Wrong" } });
    });

    return res
      .status(200)
      .json({ message: "Successfully Deleted the request" });
  } catch (error) {
    return res.status(500).json({ errors: { message: "Server Error" } });
  }
});

module.exports = router;
