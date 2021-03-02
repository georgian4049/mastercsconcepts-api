const mongoose = require("mongoose");

const ServicesSchema = new mongoose.Schema({
  serviceProvider: { type: String, required: true },
  services: [
    {
      name: { type: String, required: true },
      description: { type: String, required: true },
      heading: { type: String },
      region: [
        {
          name: { type: String },
          displayName: { type: String },
        },
      ],
      fields: [
        {
          name: { type: String, required: true },
          heading: { type: String },
          info: { type: String },
          options: [
            {
              heading: { type: String, required: true },
              formElementType: { type: String, required: true },
              inputValueType: { type: String, required: true },
              max: { type: Number },
              min: { type: Number },
              values: [
                {
                  name: { type: String },
                  displayName: { type: String },
                },
              ],
              placeholder: { type: String, required: true },
              defaultValue: { type: String, required: true },
            },
          ],
        },
      ],
    },
  ],
});

module.exports = Services = mongoose.model("Services", ServicesSchema);
