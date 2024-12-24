import { Router } from "express";
import { GroupModel } from "../models/group";
import { PetModel } from "../models/pet";
import { UserModel } from "../models/user";

/**
 * @swagger
 * components:
 *   schemas:
 *     Group:
 *       type: object
 *       required:
 *         - name
 *         - description
 *       properties:
 *         name:
 *           type: string
 *           description: The group name
 *         description:
 *           type: string
 *           description: Description on the group
 *         mambers:
 *           $ref: '#/components/schemas/User'
 *           description: The users in the group
 *         pets:
 *           $ref: '#/components/schemas/Pet'
 *           description: The pets under the user's care
 *       example:
 *         name: 'Menahem Family'
 *         description: 'The best family!'
 */

/**
 * @swagger
 * tags:
 *   name: Group
 *   description: API for Groups in the system
 */
const groupRouter = Router();

/**
 * @swagger
 * /group/:
 *  get:
 *    tags:
 *      - Group
 *    summary: Get all groups
 *    description: Get all groups
 *    security:
 *      - bearerAuth: []
 *    consumes:
 *      - application/json
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: Succes
 */
groupRouter.get("/", async (req, res) => {
  const groups = await GroupModel.find();
  res.status(200).json({ groups });
});

/**
 * @swagger
 * /group/{groupId}:
 *  get:
 *    tags:
 *      - Group
 *    summary: Get group by id
 *    description: Get group by id
 *    security:
 *      - bearerAuth: []
 *    consumes:
 *      - application/json
 *    produces:
 *      - application/json
 *    parameters:
 *      - name: groupId
 *        in: path
 *        description: group's id
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Succes
 *      400:
 *        description: Parameter is missing or Group doesn't exist
 */
groupRouter.get("/:groupId", async (req, res) => {
  const { groupId } = req.params;

  if (!groupId) {
    return res.status(400).json("Parameter is missing");
  }

  const group = await GroupModel.findOne({ _id: groupId }).populate([
    { path: "members", select: ["_id", "name", "email"] },
    { path: "pets" },
  ]);

  if (!group) {
    res.status(400).json("Group doesn't exist");
    return;
  }

  res.status(201).json(group);
});

/**
 * @swagger
 * /group/:
 *  post:
 *    tags:
 *      - Group
 *    summary: Add group
 *    description: Add group
 *    security:
 *      - bearerAuth: []
 *    consumes:
 *      - application/json
 *    produces:
 *      - application/json
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *              description:
 *                type: string
 *              users:
 *                type: array
 *              pets:
 *                type: array
 *    responses:
 *      200:
 *        description: Succes
 *      500:
 *        description: Error
 */
groupRouter.post("/", async (req, res) => {
  const { name, description, users, pets } = req.body;

  try {
    const newGroup = await GroupModel.create({
      name,
      description,
      members: [...users, req.user._id],
      pets: [...pets],
    });

    await UserModel.updateMany(
      { _id: { $in: [...users, req.user._id] } },
      { $push: { groups: newGroup.id } }
    );

    await PetModel.updateMany(
      { _id: { $in: pets } },
      { $push: { groups: newGroup.id } }
    );

    res.sendStatus(201);
  } catch (e) {
    console.log(e);
    res.status(500);
  }
});

/**
 * @swagger
 * /group/{groupId}/Pets:
 *  post:
 *    tags:
 *      - Group
 *    summary: Get group's pets
 *    description: Get group's pets
 *    security:
 *      - bearerAuth: []
 *    consumes:
 *      - application/json
 *    produces:
 *      - application/json
 *    parameters:
 *      - name: groupId
 *        in: path
 *        description: group's id
 *        schema:
 *          type: string
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - petIds
 *            properties:
 *              petIds:
 *                type: array
 *    responses:
 *      200:
 *        description: Succes
 *      500:
 *        description: A parameter gone missing, please try again or The pets couldn't be added to the group
 */
groupRouter.post("/:groupId/Pets", async (req, res) => {
  const { groupId } = req.params;
  const { petsIds } = req.body;

  if (!groupId || !petsIds) {
    return res.status(400).json("A parameter gone missing, please try again");
  }
  const addedPets = await GroupModel.findOneAndUpdate(
    { _id: groupId },
    { $addToSet: { pets: petsIds } }
  );

  await PetModel.updateMany(
    { _id: { $in: petsIds } },
    { $addToSet: { groups: groupId } }
  );

  if (!addedPets) {
    return res.status(400).json("The pets couldn't be added to the group");
  }

  res.end("Added");
});

/**
 * @swagger
 * /group/{groupId}/Users:
 *  post:
 *    tags:
 *      - Group
 *    summary: Get group's users
 *    description: Get group's users
 *    security:
 *      - bearerAuth: []
 *    consumes:
 *      - application/json
 *    produces:
 *      - application/json
 *    parameters:
 *      - name: groupId
 *        in: path
 *        description: group's id
 *        schema:
 *          type: string
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - usersIds
 *            properties:
 *              usersIds:
 *                type: array
 *    responses:
 *      200:
 *        description: Succes
 *      500:
 *        description: A parameter gone missing, please try again or The users couldn't be added to the group
 */
groupRouter.post("/:groupId/Users", async (req, res) => {
  const { groupId } = req.params;
  const { usersIds } = req.body;

  if (!groupId || !usersIds) {
    return res.status(400).json("A parameter gone missing, please try again");
  }
  const addedUsers = await GroupModel.findOneAndUpdate(
    { _id: groupId },
    { $addToSet: { members: usersIds } }
  );

  await UserModel.updateMany(
    { _id: { $in: usersIds } },
    { $addToSet: { groups: groupId } }
  );

  if (!addedUsers) {
    return res.status(400).json("The users couldn't be added to the group");
  }

  res.end("Added");
});

/**
 * @swagger
 * /group/{id}:
 *  put:
 *    tags:
 *      - Group
 *    summary: Update group
 *    description: Update group
 *    security:
 *      - bearerAuth: []
 *    consumes:
 *      - application/json
 *    produces:
 *      - application/json
 *    parameters:
 *      - name: id
 *        in: path
 *        description: group's id
 *        schema:
 *          type: string
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - name
 *              - description
 *            properties:
 *              name:
 *                type: string
 *              description:
 *                type: string
 *    responses:
 *      200:
 *        description: Succes
 *      500:
 *        description: A parameter gone missing, please try again or Error occured
 */
groupRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  if (!name && !description) {
    return res.status(400).json("A parameter gone missing, please try again");
  }

  const toUpdate = {
    name: name || undefined,
    description: description || undefined,
  };

  const updatedDetails = await GroupModel.updateOne({ _id: id }, toUpdate);

  if (!updatedDetails) {
    res.status(400).json("Error occurred");
    return;
  }

  res.end("Edited");
});

/**
 * @swagger
 * /group/{groupId}/pet/{petId}:
 *  delete:
 *    tags:
 *      - Group
 *    summary: Delete pet from group
 *    description: Delete pet from group
 *    security:
 *      - bearerAuth: []
 *    consumes:
 *      - application/json
 *    produces:
 *      - application/json
 *    parameters:
 *      - name: groupId
 *        in: path
 *        description: group's id
 *        schema:
 *          type: string
 *      - name: petId
 *        in: path
 *        description: pet's id
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Succes
 *      500:
 *        description: Parameter is missing or Error occured
 */
groupRouter.delete("/:groupId/pet/:petId", async (req, res) => {
  const { groupId, petId } = req.params;

  if (!groupId || !petId) {
    return res.status(400).json("Parameter is missing");
  }

  const deletFromGroup = await GroupModel.findOneAndUpdate(
    { _id: groupId },
    { $pull: { pets: petId } }
  );

  if (!deletFromGroup) {
    res.status(400).json("Error occurred");
    return;
  }

  const deleteFromPet = await PetModel.findOneAndUpdate(
    { _id: petId },
    { $pull: { groups: groupId } }
  );

  if (!deleteFromPet) {
    res.status(400).json("Error occurred");
    return;
  }

  res.end("Deleted");
});

/**
 * @swagger
 * /group/{groupId}/user/{userId}:
 *  delete:
 *    tags:
 *      - Group
 *    summary: Delete user from group
 *    description: Delete user from group
 *    security:
 *      - bearerAuth: []
 *    consumes:
 *      - application/json
 *    produces:
 *      - application/json
 *    parameters:
 *      - name: groupId
 *        in: path
 *        description: group's id
 *        schema:
 *          type: string
 *      - name: userId
 *        in: path
 *        description: user's id
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Succes
 *      500:
 *        description: Parameter is missing or Error occured
 */
groupRouter.delete("/:groupId/user/:userId", async (req, res) => {
  const { groupId, userId } = req.params;

  if (!groupId || !userId) {
    return res.status(400).json("Parameter is missing");
  }

  const deleteFromGruop = await GroupModel.findOneAndUpdate(
    { _id: groupId },
    { $pull: { members: userId } }
  );

  if (!deleteFromGruop) {
    res.status(400).json("Error occurred");
    return;
  }

  const deleteFromUser = await UserModel.findOneAndUpdate(
    { _id: userId },
    { $pull: { groups: groupId } }
  );

  if (!deleteFromUser) {
    res.status(400).json("Error occurred");
    return;
  }

  res.end("Deleted");
});

export default groupRouter;
