const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const Services = require("../../models/Services");

router.post("/add/", auth, async (req, res) => {
  try {
    if (req.user.role === "admin") {
      const serviceProviderExist = await Services.findOne({
        serviceProvider: req.body.serviceProvider,
      });
      if (!serviceProviderExist) {
        const service = new Services(req.body);
        await service.save();
        return res.status(200).json({ data: "Service Added Successfully" });
      } else {
        await Services.findOneAndUpdate(
          { serviceProvider: req.body.serviceProvider },
          {
            $push: { services: req.body.services },
          },
          { upsert: true, new: true }
        );
        return res.status(200).json({
          data: `Services Added Successfully to ${req.body.serviceProvider}`,
        });
      }
    }
  } catch (error) {
    return res.status(500).json({ errors: { message: "Server Error" } });
  }
});

router.put("/update/", auth, async (req, res) => {
  try {
    if (req.user.role === "admin") {
      const update = await Services.updateOne(
        {
          serviceProvider: req.body.serviceProvider,
          "services.name": req.body.services.name,
        },
        { $set: { "services.$": req.body.services } }
      );
      if (update.nModified) {
        return res.status(200).json({ data: "Updated Successfully" });
      } else {
        return res
          .status(400)
          .json({ data: `Service ${req.body.services.name} doesn't Exists` });
      }
    }
  } catch (error) {
    return res.status(500).json({ errors: { message: "Server Error" } });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const services = await Services.find();
    return res.status(200).json({ data: services });
  } catch (error) {
    return res.status(500).json({ errors: { message: "Server Error" } });
  }
});

module.exports = router;
