import { Router } from "express";
import moment from "moment";
import { PetModel } from "../models/pet";
import { TaskInterface } from "../models/task";
import { UserModel } from "../models/user";

/**
 * @swagger
 * components:
 *   schemas:
 *     Pet:
 *       type: object
 *       required:
 *         - name
 *         - height
 *         - height
 *         - weight
 *         - birthDate
 *         - breed
 *         - species
 *       properties:
 *         name:
 *           type: string
 *           description: The pet's name
 *         height:
 *           type: number
 *           description: The pet's height
 *         weight:
 *           type: number
 *           description: The pet's weight
 *         birthDate:
 *           type: Date
 *           description: The pet's birth date
 *         breed:
 *           type: string
 *           description: The pet's breed
 *         species:
 *           type: string
 *           description: The pet's species
 *         imgUrl:
 *           type: string
 *           description: Image of the pet
 *         mambers:
 *           $ref: '#/components/schemas/User'
 *           description: The carers of the pet
 *         groups:
 *           $ref: '#/components/schemas/Group'
 *           description: The groups the pet is in
 *         tasks:
 *           $ref: '#/components/schemas/Task'
 *           description: Tasks related to the pet
 *         Medical:
 *           $ref: '#/components/schemas/Treatment'
 *           description: The pet's medical history
 *     Task:
 *       type: object
 *       required:
 *         - title
 *         - dateFrom
 *         - dateTo
 *         - isCompleted
 *       properties:
 *         title:
 *           type: string
 *           description: Title of the task
 *         description:
 *           type: string
 *           description: Description of the task
 *         dateFrom:
 *           type: Date
 *           description: The task's starting date
 *         dateTo:
 *           type: Date
 *           description: The task's ending date
 *         isCompleted:
 *           type: boolean
 *           description: Specifies wether the task was completed or not
 *     Treatment:
 *       type: object
 *       required:
 *         - treatment
 *         - date
 *       properties:
 *         treatment:
 *           type: string
 *           description: A treatment the pet was given
 *         date:
 *           type: Date
 *           description: The treatment's date
 */

/**
 * @swagger
 * tags:
 *   name: Pet
 *   description: API for Pets in the system
 */
const petRouter = Router();

const addPet = async (
  name: string,
  userId: string,
  birthdate: Date,
  species: string,
  breed: string,
  weight: number,
  height: number,
  imgUrl: string
) => {
  const petToSave = new PetModel({
    name,
    medical: [],
    members: [{ _id: userId }],
    tasks: [],
    birthdate,
    species,
    breed,
    height,
    weight,
    imgUrl,
  });

  return petToSave.save();
};

/**
 * @swagger
 * /pet/:
 *  get:
 *    tags:
 *      - Pet
 *    summary: Get all pets
 *    description: Return all pets in the system
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
petRouter.get("/", async (req, res) => {
  const pets = await PetModel.find();
  res.status(200).json({ pets });
});

/**
 * @swagger
 * /pet/{petId}:
 *  get:
 *    tags:
 *      - Pet
 *    summary: Get Pet by id
 *    description: Return pet by it's id
 *    security:
 *      - bearerAuth: []
 *    consumes:
 *      - application/json
 *    produces:
 *      - application/json
 *    parameters:
 *      - name: petId
 *        in: path
 *        description: pet's id
 *        schema:
 *          type: string
 *    responses:
 *      201:
 *        description: Succes
 *      400:
 *        description: Parameter is missing or Pet doesn't exist
 */
petRouter.get("/:petId", async (req, res) => {
  const { petId } = req.params;

  if (!petId) {
    return res.status(400).json("Parameter is missing");
  }

  const pet = await PetModel.findOne({ _id: petId }).populate([
    { path: "members", select: ["name", "email"] },
    { path: "groups" },
  ]);

  if (!pet) {
    res.status(400).json("Pet doesn't exist");
    return;
  }

  res.status(201).json(pet);
});

/**
 * @swagger
 * /pet/{petId}/add-treatment:
 *  put:
 *    tags:
 *      - Pet
 *    summary: Add pet treatment
 *    description: Add pet treatment
 *    security:
 *      - bearerAuth: []
 *    consumes:
 *      - application/json
 *    produces:
 *      - application/json
 *    parameters:
 *      - name: petId
 *        in: path
 *        description: pet's id
 *        schema:
 *          type: string
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - treatment
 *              - date
 *            properties:
 *              treatment:
 *                type: string
 *              date:
 *                type: Date
 *    responses:
 *      200:
 *        description: Succes
 *      400:
 *        description: A parameter gone missing, please try again
 */
petRouter.put("/:petId/add-treatment", async (req, res) => {
  const { petId } = req.params;
  const { treatment, date } = req.body;

  if (!treatment || !date) {
    return res.status(400).json("A parameter gone missing, please try again");
  }

  const medical = { treatment, date };
  const newTreatment = await PetModel.findOneAndUpdate(
    { _id: petId },
    { $push: { medical } }
  );

  res.end(newTreatment?.id);
});

petRouter.delete("/:petId/user/:userId", async (req, res) => {
  const { petId, userId } = req.params;
  try {
    await UserModel.updateOne({ _id: userId }, { $pull: { pets: petId } });
    await PetModel.updateOne({ _id: petId }, { $pull: { members: userId } });

    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

petRouter.put("/:petId/user/:userId", async (req, res) => {
  const { petId, userId } = req.params;
  try {
    const user = await UserModel.findOneAndUpdate(
      { _id: userId },
      { $push: { pets: petId } },
      { fields: { name: 1, id: 1, email: 1 } }
    );
    await PetModel.updateOne({ _id: petId }, { $push: { members: userId } });

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

/**
 * @swagger
 * /pet/{petId}/{taskId}/change-status:
 *  put:
 *    tags:
 *      - Pet
 *    summary: Update task's status
 *    description: Update task's isCompleted status
 *    security:
 *      - bearerAuth: []
 *    consumes:
 *      - application/json
 *    produces:
 *      - application/json
 *    parameters:
 *      - name: petId
 *        in: path
 *        description: pet's id
 *        schema:
 *          type: string
 *      - name: taskId
 *        in: path
 *        description: task's id
 *        schema:
 *          type: string
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - isCompleted
 *            properties:
 *              isCompleted:
 *                type: boolean
 *    responses:
 *      200:
 *        description: Succes
 *      400:
 *        description: A parameter gone missing, please try again or This pet doesn't exist or This task wasnt found for that pet
 */
petRouter.put("/:petid/:taskId/changeStatus", async (req, res) => {
  const { petid, taskId } = req.params;
  const { isCompleted } = req.body;

  if (!petid || !taskId || isCompleted === undefined) {
    return res.status(400).json("A parameter gone missing, please try again");
  }

  const pet = await PetModel.findOne({ _id: petid });

  if (!pet) {
    return res.status(400).json("This pet doesn't exist");
  }

  const myTask = pet?.tasks.find((task) => task._id.equals(taskId));

  if (!myTask) {
    return res.status(400).json("This task wasn't found for that pet");
  }

  myTask.isCompleted = isCompleted;
  pet?.save();
  res.end("Changed");
});

/**
 * @swagger
 * /pet/{id}:
 *  put:
 *    tags:
 *      - Pet
 *    summary: Update pet
 *    description: Update pet
 *    security:
 *      - bearerAuth: []
 *    consumes:
 *      - application/json
 *    produces:
 *      - application/json
 *    parameters:
 *      - name: id
 *        in: path
 *        description: pet's id
 *        schema:
 *          type: string
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - name
 *              - height
 *              - weight
 *              - imgUrl
 *            properties:
 *              name:
 *                type: string
 *              height:
 *                type: number
 *              weight:
 *                type: number
 *              imgUrl:
 *                type: string
 *
 *    responses:
 *      200:
 *        description: Succes
 *      400:
 *        description: A parameter gone missing, please try again or Error occured
 */
petRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, height, weight, imgUrl } = req.body;

  if (!name && !height && !weight && imgUrl) {
    return res.status(400).json("A parameter gone missing, please try again");
  }

  const toUpdate = {
    name: name || undefined,
    height: height || undefined,
    weight: weight || undefined,
    imgUrl: imgUrl || undefined,
  };

  const updatedDetails = await PetModel.updateOne({ _id: id }, toUpdate);

  if (!updatedDetails) {
    res.status(400).json("Error occurred");
    return;
  }

  res.end("Edited");
});

/**
 * @swagger
 * /pet/:
 *  post:
 *    tags:
 *      - Pet
 *    summary: Add pet
 *    description: Add pet
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
 *            required:
 *              - name
 *              - height
 *              - weight
 *              - birthDate
 *              - species
 *              - breed
 *            properties:
 *              name:
 *                type: string
 *              height:
 *                type: number
 *              weight:
 *                type: number
 *              birthDate:
 *                type: Date
 *              species:
 *                type: string
 *              breed:
 *                type: string
 *              image:
 *                type: string
 *    responses:
 *      201:
 *        description: Succes
 *      400:
 *        description: Parameter is missing
 */
petRouter.post("/", async (req, res) => {
  const { name, birthDate, species, breed, weight, height, image } = req.body;

  if (!name || !birthDate || !species || !breed || !weight || !height) {
    return res.status(400).json("Parameter is missing");
  }

  const userId = req.user._id;

  const newPet = await addPet(
    name,
    userId,
    birthDate,
    species,
    breed,
    weight,
    height,
    image
  );

  const currentUser = await UserModel.findById(userId);
  currentUser?.pets.push(newPet._id);
  currentUser?.save();

  // TODO: return pet id to navigate to pet details
  res.sendStatus(201);
});

/**
 * @swagger
 * /pet/{petId}/task:
 *  put:
 *    tags:
 *      - Pet
 *    summary: Add task
 *    description: Add task
 *    security:
 *      - bearerAuth: []
 *    consumes:
 *      - application/json
 *    produces:
 *      - application/json
 *    parameters:
 *      - name: petId
 *        in: path
 *        description: pet's id
 *        schema:
 *          type: string
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - title
 *              - dateFrom
 *              - dateTo
 *              - isCompleted
 *            properties:
 *              title:
 *                type: string
 *              description:
 *                type: string
 *              dateFrom:
 *                type: Date
 *              dateTo:
 *                type: Date
 *              isCompleted:
 *                type: boolean
 *    responses:
 *      201:
 *        description: Succes
 *      400:
 *        description: Pet wasn't found
 */
petRouter.put("/:petId/task", async (req, res) => {
  const { petId } = req.params;
  const { title, description, dateFrom, dateTo, isCompleted } = req.body;

  const pet = await PetModel.findOne({ _id: petId });

  if (!pet) {
    return res.status(400).json("Pet wasn't found");
  }

  pet?.tasks.push({
    title,
    description,
    dateFrom: new Date(dateFrom),
    dateTo: new Date(dateTo),
    isCompleted,
  } as TaskInterface);
  pet?.save();
  res.sendStatus(201);
});

/**
 * @swagger
 * /pet/{petId}/task/{taskId}:
 *  put:
 *    tags:
 *      - Pet
 *    summary: Update task
 *    description: Update task
 *    security:
 *      - bearerAuth: []
 *    consumes:
 *      - application/json
 *    produces:
 *      - application/json
 *    parameters:
 *      - name: petId
 *        in: path
 *        description: pet's id
 *        schema:
 *          type: string
 *      - name: taskId
 *        in: path
 *        description: task's id
 *        schema:
 *          type: string
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - title
 *              - dateFrom
 *              - dateTo
 *              - isCompleted
 *            properties:
 *              title:
 *                type: string
 *              description:
 *                type: string
 *              dateFrom:
 *                type: Date
 *              dateTo:
 *                type: Date
 *              isCompleted:
 *                type: boolean
 *    responses:
 *      201:
 *        description: Succes
 *      400:
 *        description: Pet wasn't found or Task wasn't found
 */
petRouter.put("/:petId/task/:taskId", async (req, res) => {
  const { petId, taskId } = req.params;
  const { title, description, dateFrom, dateTo, isCompleted } = req.body;

  const pet = await PetModel.findOne({ _id: petId });

  if (!pet) {
    return res.status(400).json("Pet wasn't found");
  }

  const task = pet?.tasks.find((a) => a._id.equals(taskId));

  if (!task) {
    return res.status(400).json("Task wasn't found");
  }

  task.title = title;
  task.description = description;
  task.dateFrom = moment(dateFrom).utc().toDate();
  task.dateTo = moment(dateTo).utc().toDate();
  task.isCompleted = isCompleted;
  pet?.save();
  res.end("Updated");
});

/**
 * @swagger
 * /pet/{petId}/task/{taskId}:
 *  delete:
 *    tags:
 *      - Pet
 *    summary: Delete task
 *    description: Delete task
 *    security:
 *      - bearerAuth: []
 *    consumes:
 *      - application/json
 *    produces:
 *      - application/json
 *    parameters:
 *      - name: petId
 *        in: path
 *        description: pet's id
 *        schema:
 *          type: string
 *      - name: taskId
 *        in: path
 *        description: task's id
 *        schema:
 *          type: string
 *    responses:
 *      201:
 *        description: Succes
 *      400:
 *        description: Pet wasn't found
 */
petRouter.delete("/:petId/task/:taskId", async (req, res) => {
  const { petId, taskId } = req.params;

  const pet = await PetModel.findOne({ _id: petId });

  if (!pet) {
    return res.status(400).json("Pet wasn't found");
  }

  pet.tasks = pet.tasks?.filter((t) => t._id.toString() !== taskId);
  pet?.save();
  res.end("Deleted");
});

/**
 * @swagger
 * /pet/{petId}/{treatmentId}:
 *  delete:
 *    tags:
 *      - Pet
 *    summary: Delete treatment
 *    description: Delete treatment
 *    security:
 *      - bearerAuth: []
 *    consumes:
 *      - application/json
 *    produces:
 *      - application/json
 *    parameters:
 *      - name: petId
 *        in: path
 *        description: pet's id
 *        schema:
 *          type: string
 *      - name: treatmentId
 *        in: path
 *        description: treatment's id
 *        schema:
 *          type: string
 *    responses:
 *      201:
 *        description: Succes
 *      400:
 *        description: Parameter is missing
 */
petRouter.delete("/:petId/:treatmentId", async (req, res) => {
  const { petId, treatmentId } = req.params;

  if (!petId || !treatmentId) {
    return res.status(400).json("Parameter is missing");
  }

  const deleted = await PetModel.findOneAndUpdate(
    { _id: petId },
    { $pull: { medical: { _id: treatmentId } } }
  );

  if (!deleted) {
    res.status(400).json("Error occurred");
    return;
  }

  res.end("Deleted");
});

export default petRouter;
