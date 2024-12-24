import { Router } from "express";
import bcrypt from "bcrypt";
import moment from "moment-timezone";
import * as _ from "lodash";
import { ObjectId } from "mongodb";
import { UserModel } from "../models/user";
// import moment-timezone from "moment-timezone"

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - tokens
 *         - name
 *       properties:
 *         email:
 *           type: string
 *           description: The user email
 *         password:
 *           type: string
 *           description: The user password
 *         tokens:
 *           type: array
 *           description: The user authentication tokens
 *         name:
 *           type: string
 *           description: The user's name
 *         groups:
 *           $ref: '#/components/schemas/Group'
 *           description: The groups the user is part of
 *         pets:
 *           $ref: '#/components/schemas/Pet'
 *           description: The pats under the user's care
 *       example:
 *         email: 'menahem@gmail.com'
 *         password: '123456'
 *         tokens: ['eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2Mjg3OGI2NmU5OGM0ODE3MTY0MjA0ZGEiLCJpYXQiOjE2NTQ2MzE1Njl9.tCFfiShI4ugqjgSWwUcEEbqKEB-rGAuRyqCGjoWhRNY']
 *         name: 'Menahem'
 */

/**
 * @swagger
 * tags:
 *   name: User
 *   description: API for Users in the system
 */
const userRouter = Router();

userRouter.get("/pets", async (req, res) => {
  const userId = req.user._id;

  try {
    const result = await UserModel.findOne({ _id: userId })
      .populate({
        path: "pets",
        select: ["name", "id", "breed", "species"],
      })
      .select("pets");

    res.status(200).json(result?.pets);
  } catch (e) {
    console.log(e);
    res.status(500);
  }
});

/**
 * @swagger
 * /user/{id}/groups:
 *  get:
 *    tags:
 *      - User
 *    summary: Get user's groups
 *    description: Return all groups the user is in
 *    security:
 *      - bearerAuth: []
 *    consumes:
 *      - application/json
 *    produces:
 *      - application/json
 *    parameters:
 *      - name: id
 *        in: path
 *        description: user's id
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Succes
 */
userRouter.get("/:id/groups", async (req, res) => {
  const { id } = req.params;
  const usersGroups = await UserModel.findOne({ _id: id })
    .populate({ path: "groups" })
    .select("groups");

  res.status(200).json(usersGroups?.groups);
});

/**
 * @swagger
 * /user/{id}/pets:
 *  get:
 *    tags:
 *      - User
 *    summary: Get user's pets
 *    description: Return all pets under user's care or it's groups' care
 *    security:
 *      - bearerAuth: []
 *    consumes:
 *      - application/json
 *    produces:
 *      - application/json
 *    parameters:
 *      - name: id
 *        in: path
 *        description: user's id
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Succes
 */
userRouter.get("/:id/pets", async (req, res) => {
  const { id } = req.params;
  const usersPets = await UserModel.findOne({ _id: id })
    .populate({ path: "pets" })
    .select("pets");

  res.status(200).json(usersPets?.pets);
});

const encryptPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  const encPass = await bcrypt.hash(password, salt);
  return encPass;
};

/**
 * @swagger
 * /user/{id}/edit:
 *  put:
 *    tags:
 *      - User
 *    summary: Edit user's details
 *    description: Edit user's details
 *    security:
 *      - bearerAuth: []
 *    consumes:
 *      - application/json
 *    produces:
 *      - application/json
 *    parameters:
 *      - name: id
 *        in: path
 *        description: user's id
 *        schema:
 *          type: string
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - name
 *              - password
 *            properties:
 *              name:
 *                type: string
 *              password:
 *                type: string
 *    responses:
 *      200:
 *        description: Succes
 *      400:
 *        description: Error occured
 */
userRouter.put("/:id/edit", async (req, res) => {
  const { id } = req.params;
  const { name, password } = req.body;

  if (!name && !password) {
    return res.status(400).json("A parameter gone missing, please try again");
  }

  const toUpdate = {
    name: name || undefined,
    password: password ? encryptPassword(password) : undefined,
  };

  const updatedDetails = await UserModel.updateOne({ _id: id }, toUpdate);

  if (!updatedDetails) {
    res.status(400).json("Error occurred");
    return;
  }

  res.end("Edited");
});

/**
 * @swagger
 * /user/{id}:
 *  get:
 *    tags:
 *      - User
 *    summary: Get user
 *    description: Returns user by id
 *    security:
 *      - bearerAuth: []
 *    consumes:
 *      - application/json
 *    produces:
 *      - application/json
 *    parameters:
 *      - name: id
 *        in: path
 *        description: user's id
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Succes
 *      500:
 *        description: Error
 */
userRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await UserModel.findOne({ _id: id }).select(["name", "email"]);
    res.json(user);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

/**
 * @swagger
 * /user/search/{searchValue}:
 *  get:
 *    tags:
 *      - User
 *    summary: Get users by search
 *    description: Returns user by search string
 *    security:
 *      - bearerAuth: []
 *    consumes:
 *      - application/json
 *    produces:
 *      - application/json
 *    parameters:
 *      - name: searchValue
 *        in: path
 *        description: search string
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Succes
 *      500:
 *        description: Error
 */

userRouter.get("/search/:searchValue", async (req, res) => {
  const { searchValue } = req.params;

  try {
    const result = await UserModel.find({
      $or: [
        { email: { $regex: searchValue, $options: "i" } },
        { name: { $regex: searchValue, $options: "i" } },
      ],
    }).select(["name", "email"]);
    res.status(200).json(result);
  } catch (e) {
    console.log(e);
    res.status(500);
  }
});

/**
 * @swagger
 * /user/{id}/tasks:
 *  get:
 *    tags:
 *      - User
 *    summary: Get user's tasks
 *    description: Return all tasks under it's pets
 *    security:
 *      - bearerAuth: []
 *    consumes:
 *      - application/json
 *    produces:
 *      - application/json
 *    parameters:
 *      - name: id
 *        in: path
 *        description: user's id
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Succes
 */
userRouter.get("/:id/tasks", async (req, res) => {
  const { id } = req.params;

  const userPets = await UserModel.findById(id)
    .select(["pets", "groups"])
    .populate([
      {
        path: "pets",
        select: ["name", "imgUrl", "tasks"],
      },
      {
        path: "groups",
        select: "pets",
        populate: {
          path: "pets",
          select: ["name", "imgUrl", "tasks"],
        },
      },
    ]);

  let petTasks: {
    tasks: {
      title: string;
      description: string;
      dateFrom: Date;
      dateTo: Date;
      isCompleted: boolean;
    }[];
    imgUrl: string;
    name: string;
    _id: ObjectId;
  }[] = [];

  if (userPets?.pets?.length) {
    petTasks = petTasks.concat(userPets.pets);
  }

  if (userPets?.groups?.length) {
    const groupPets = userPets.groups.flatMap((x) => x.pets);
    if (groupPets?.length) {
      petTasks = petTasks.concat(groupPets);
    }
  }

  res
    .status(200)
    .json({ petTasks: _.uniqBy(petTasks, (p) => p._id.toString()) });
});

/**
 * @swagger
 * /user/{id}/today-tasks:
 *  get:
 *    tags:
 *      - User
 *    summary: Get user's tasks of today
 *    description: Return all today's tasks under it's pets
 *    security:
 *      - bearerAuth: []
 *    consumes:
 *      - application/json
 *    produces:
 *      - application/json
 *    parameters:
 *      - name: id
 *        in: path
 *        description: user's id
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Succes
 *      400:
 *        description: Couldn't find pets with tasks for today
 */
userRouter.get("/:id/today-tasks", async (req, res) => {
  const { id } = req.params;

  const petsTasks = await UserModel.findOne({ _id: id })
    .populate([
      {
        path: "pets",
        select: ["name", "tasks", "imgUrl"],
        match: { tasks: { $not: { $size: 0 } } },
      },
    ])
    .select("pets");

  if (!petsTasks?.pets || petsTasks?.pets.length === 0) {
    return res.json([]);
  }

  const todaysTasks = petsTasks.pets.map((pet) => ({
    _id: pet.id,
    imgUrl: pet.imgUrl,
    name: pet.name,
    tasks: pet.tasks.filter((task) =>
      moment().tz("Asia/Jerusalem").isSame(task.dateTo, "day")
    ),
  }));

  const onlyWithTask = todaysTasks.filter(
    (afterFilter) => afterFilter.tasks.length !== 0
  );

  onlyWithTask.forEach((pet) => {
    pet.tasks.sort((taskA, taskB) => {
      if (taskA.dateFrom < taskB.dateFrom) {
        return -1;
      }
      if (taskA.dateFrom > taskB.dateFrom) {
        return 1;
      }

      return 0;
    });
  });

  res.json(onlyWithTask);
});

export default userRouter;
