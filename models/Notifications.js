const mongoose = require("mongoose");

const NotificationSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  items: {
    requests: [
      {
        id: {
          type: String,
          required: true,
        },
        visited: {
          type: Boolean,
          required: true,
        },
        requestedOn: {
          type: Date,
          required: true,
        },
        updatedOn: {
          type: Date,
        },
        status: {
          type: String,
          required: true,
        },
        notifications: [
          {
            date: {
              type: Date,
              required: true,
            },
            message: {
              type: String,
              required: true,
            },
          },
        ],
      },
    ],
  },
});

module.exports = Notifications = mongoose.model(
  "Notifications",
  NotificationsSchema
);
