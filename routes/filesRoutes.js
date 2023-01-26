const filesRouter = require("express").Router();

const {
  addFileData,
  fetchFileData,
  showFileDetails,
} = require("../controller/filesController");

// For rendering different pages and controllers
filesRouter.get("/", showFileDetails);
filesRouter.post("/add-file-data", addFileData);
filesRouter.get("/fetch-data", fetchFileData);

module.exports = filesRouter;
