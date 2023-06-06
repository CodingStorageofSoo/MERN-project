const { Router } = require("express");
const imageRouter = Router();
const Image = require("../models/Image");
const { upload } = require("../middleware/imageUpload");

const fs = require("fs");
const { promisify } = require("util");
const fileUnlink = promisify(fs.unlink);

const mongoose = require("mongoose");

imageRouter.post("/", upload.array("imageTest", 5), async (req, res) => {
  try {
    if (!req.user) throw new Error("No Authorization");
    const images = await Promise.all(
      req.files.map(async (file) => {
        const image = await new Image({
          user: {
            _id: req.user.id,
            name: req.user.name,
            username: req.user.username,
          },
          public: req.body.public,
          key: file.filename,
          originalFileName: file.originalname,
        }).save();
        return image;
      })
    );

    res.json(images);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

imageRouter.get("/", async (req, res) => {
  // offset vs cursor

  // offset : Offset-based pagination divides data into pages using a numerical value (offset) that represents the starting position of the retrieved data. Typically, it takes the page number and page size as inputs. The starting position for the requested page is calculated by multiplying the page number by the page size.

  // cursor : Cursor-based pagination retrieves a new page of data based on the last data item from the previous page.

  try {
    const { lastid } = req.query;
    if (lastid && !mongoose.isValidObjectId(lastid))
      throw new Error("invalid lastid");
    const images = await Image.find(
      lastid
        ? {
            public: true,
            _id: { $lt: lastid },
          }
        : { public: true }
    )
      .sort({ _id: -1 })
      .limit(10);
    res.json(images);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

imageRouter.get("/:imageId", async (req, res) => {
  try {
    const { imageId } = req.params.imageId;
    if (!mongoose.isValidObjectId(imageId))
      throw new Error("The image ID is invalid");
    const image = await Image.findOne({ _id: imageId });
    if (!image) throw new Error("Not found");
    if (!image.public && (!req.user || req.user.id !== image.user.id))
      throw new Error("No Authorization");
    res.json(image);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

imageRouter.delete("/:imageId", async (req, res) => {
  try {
    if (!req.user) throw new Error("No Authorization");

    if (!mongoose.isValidObjectId(req.params.imageId))
      throw new Error("The image ID is invalid");

    const image = await Image.findOneAndDelete({ _id: req.params.imageId }); // Delete data in MongoDB

    if (!image)
      return res.json({
        message: "The requested image file was already deleted",
      });

    await fileUnlink(`./uploads/${image.key}`); // Delete image file in local storage

    res.json({ message: "Delete!" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

imageRouter.patch("/:imageId/like", async (req, res) => {
  try {
    if (!req.user) throw new Error("No Authorization");
    if (!mongoose.isValidObjectId(req.params.imageId))
      throw new Error("The image ID is invalid");
    const image = await Image.findByIdAndUpdate(
      { _id: req.params.imageId },
      {
        $addToSet: { likes: req.user.id },
      },
      { new: true }
    );
    res.json(image);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

imageRouter.patch("/:imageId/unlike", async (req, res) => {
  try {
    if (!req.user) throw new Error("No Authorization");
    if (!mongoose.isValidObjectId(req.params.imageId))
      throw new Error("The image ID is invalid");
    const image = await Image.findByIdAndUpdate(
      { _id: req.params.imageId },
      {
        $pull: { likes: req.user.id },
      },
      { new: true }
    );
    res.json(image);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

module.exports = { imageRouter };
