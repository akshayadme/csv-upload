const mongoose = require("mongoose");

const FilesSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
    },
    file_size: {
      type: String,
      required: true,
    },

    file_data: {
      type: Array,
      required: true,
    },
    headers: {
      type: Array,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Files = mongoose.model("csv_files_data", FilesSchema);

module.exports = Files;
