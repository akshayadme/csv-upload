const Files = require("../models/filesModel");

//---------Controller to fetch all File Names----------//
const showFileDetails = async (req, res) => {
  try {
    const fileExist = await Files.find({});
    if (fileExist.length === 0) {
      req.flash("error_msg", "No File Details Found!");
      res.render("dashboard", { files: [] });
    } else {
      const fileDetails = [];

      fileExist.forEach((el) => {
        fileDetails.push({
          filename: el.filename,
          file_size: el.file_size,
          _id: el._id,
        });
      });

      res.render("dashboard", { files: fileDetails });
    }
  } catch (error) {
    req.flash(
      "server_error",
      "Something went wrong... Error in fetching files data!"
    );
    res.redirect("back");
  }
};

//---------Controller to Add File data with its details----------//
const addFileData = async (req, res) => {
  const { filename, headers, file_size, file_data } = req.body;

  try {
    const fileExist = await Files.findOne({ filename });

    if (fileExist) {
      req.flash("error_msg", "Thus file already exists!");
      res.redirect("back");
    } else {
      const newFile = new Files({
        filename,
        headers,
        file_size,
        file_data,
      });

      await newFile.save();

      res.redirect("back");
    }
  } catch (error) {
    req.flash(
      "server_error",
      "Something went wrong... Error in adding files data!"
    );
    res.redirect("back");
  }
};

//---------Controller to fetch file data by its id----------//
const fetchFileData = async (req, res) => {
  try {
    const id = req.query.id;
    const filesFound = await Files.findOne({ _id: id });

    if (filesFound) {
      res.render("table_data", { files: filesFound });
    } else {
      req.flash("error_msg", "File data doesn't exist!");
      res.redirect("back");
    }
  } catch (error) {
    req.flash(
      "server_error",
      "Something went wrong... Error in fetching file data !"
    );
    res.redirect("back");
  }
};

module.exports = {
  addFileData,
  fetchFileData,
  showFileDetails,
};
