import { Router } from "express";
import { ClubInterface, ClubModel } from "../models/club";
import { BookModel } from "../models/book";
import { UserModel } from "../models/user";

const clubRouter = Router();

// get all
clubRouter.get("/", async (req, res) => {
  const clubs = await ClubModel.find();
  res.status(200).json({ clubs });
});


// get by id
clubRouter.get("/:clubId", async (req, res) => {
  const { clubId } = req.params;

  if (!clubId) {
    return res.status(400).json("Parameter is missing");
  }

  try {
    const club = await ClubModel.findById(clubId).populate([
      { path: "members", select: ["_id", "name", "email"] },
      { path: "books" },
    ]);

    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }

    return res.status(200).json(club);
  } catch (err) {
    console.error("Error getting club:", err);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
});


// create club
clubRouter.post("/", async (req, res) => {
  const { name, description, users = [], books = [] } = req.body;

  if (!req.user || !req.user._id) {
    return res.status(401).json({ message: "Unauthorized. User information is missing." });
  }

  try {
    const newClub = await ClubModel.create({
      name,
      description,
      members: [...users, req.user._id],
      books: [...books],
    });

    await UserModel.updateMany(
      { _id: { $in: [...users, req.user._id] } },
      { $addToSet: { clubs: newClub._id } }
    );

    await BookModel.updateMany(
      { _id: { $in: books } },
      { $addToSet: { clubs: newClub._id } }
    );

    return res.status(201).json({ 
      message: "Club created successfully", 
      club: newClub 
    });

  } catch (err) {
    console.error("Error creating club:", err);
    res.status(500).json({ message: "Something went wrong. Please try again." });  
  }
});


// add users
clubRouter.post("/:clubId/Users", async (req, res) => {
  const { clubId } = req.params;
  const { usersIds } = req.body;

  if (!clubId || !usersIds || !Array.isArray(usersIds) || usersIds.length === 0) {
    return res.status(400).json({ message: "Missing required parameters. Please provide all fields." });
  }

  try {
    const addedUsers = await ClubModel.findByIdAndUpdate(
      clubId,
      { $addToSet: { members: usersIds }},
      { new: true }
    );

    if (!addedUsers) {
      return res.status(404).json({ message: "Club not found. Unable to add users." });
    }

    await UserModel.updateMany(
      { _id: { $in: usersIds } },
      { $addToSet: { clubs: clubId } }
    );

    return res.status(200).json({
      message: "Users added to the club successfully.",
      club: addedUsers,
    });
  
  } catch(err){
    console.error("Error creating club:", err);
    res.status(500).json({ message: "Something went wrong. Please try again." });  
  }
});


// update info
clubRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  if (!name && !description) {
    return res.status(404).json("Parameter missing, please try again");
  }
  
    try {
    
    /// TODO: make a find by id func
    const club = await ClubModel.findById(id);
    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }

    const updateFields: Partial<ClubInterface> = {};
    if (name) updateFields.name = name;
    if (description) updateFields.description = description;

    const updatedClub = await ClubModel.findByIdAndUpdate(
      id, updateFields, 
      { new: true }
    );

    return res.status(200).json({ 
      message: "Book updated successfully", 
      club: updatedClub
    });

  } catch(err) {
    console.error("Error updating club:", err);
    res.status(500).json({ message: "Something went wrong. Please try again." }); 
  }
});


clubRouter.delete("/:clubId", async (req, res) => {
  const { clubId } = req.params;

  if (!clubId) {
    return res.status(400).json({ message: "Parameter is missing" });
  }

  try {
    const deletedClub = await ClubModel.findByIdAndDelete(clubId);

    if (!deletedClub) {
      return res.status(404).json({ message: "Club not found. Unable to delete." });
    }

    return res.status(200).json({ message: "Club deleted successfully." });

  } catch (err) {
    console.error("Error deleting club:", err);
    res.status(500).json({ message: "Something went wrong. Please try again." }); 
  }
});


// delete book from club
//todo: check if needed or delete only from book.router
clubRouter.delete("/:clubId/book/:bookId", async (req, res) => {
  const { clubId, bookId } = req.params;

  if (!clubId || !bookId) {
    return res.status(400).json("Parameter is missing");
  }

  try {
    const deleteFromClub = await ClubModel.findByIdAndUpdate(
      clubId,
      { $pull: { books: bookId } },
      { new: true }
    );

    if (!deleteFromClub) {
      return res.status(404).json({ message: "Club not found or book not associated with the club." });
    }

    await BookModel.findByIdAndDelete(bookId); // CHECK IF NEEDED

    return res.status(200).json({
      message: "Book successfully removed from the club.",
      club: deleteFromClub,
    });

  } catch (err) {
    console.error("Error deleting club:", err);
    res.status(500).json({ message: "Something went wrong. Please try again." }); 
  }
});


// delete user from club
clubRouter.delete("/:clubId/user/:userId", async (req, res) => {
  const { clubId, userId } = req.params;

  if (!clubId || !userId) {
    return res.status(400).json("Parameter is missing");
  }

  try {
    const deleteFromClub = await ClubModel.findByIdAndUpdate(
      { _id: clubId },
      { $pull: { members: userId } },
      { new: true }
    );

    if (!deleteFromClub) {
      return res.status(404).json({ message: "Club not found or user not associated with the club." });
    }

    const deleteFromUser = await UserModel.findByIdAndUpdate(
      { _id: userId },
      { $pull: { clubs: clubId } },
      { new: true }
    );

    if (!deleteFromUser) {
      return res.status(404).json({ message: "User not found or club not associated with the user." });
    }

    return res.status(200).json({
      message: "User successfully removed from the club.",
      club: deleteFromClub,
    });

  } catch(err){
    console.error("Error deleting club:", err);
    res.status(500).json({ message: "Something went wrong. Please try again." }); 
  }
});

export default clubRouter;