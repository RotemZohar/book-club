import _ from "lodash";
import cron from "node-cron";
import { PetModel } from "../models/pet";
import { sendEmail } from "./mail-service";

const sendTaskNotification = (taskData: {
  membersEmails: { _id: string; email: string }[];
  groupsMembers: {
    _id: string;
    membersEmails: { _id: string; email: string }[];
  }[];
  tasks: { title: string; description: string };
}) => {
  // Extract all emails
  let emails: string[] = [];

  if (taskData?.membersEmails?.length) {
    emails = emails.concat(
      taskData.membersEmails.map((member) => member.email)
    );
  }

  if (taskData?.groupsMembers?.length) {
    emails = emails.concat(
      taskData.groupsMembers.flatMap((group) =>
        group.membersEmails.map((member) => member.email)
      )
    );
  }

  emails = _.uniq(emails);

  // Send mails
  sendEmail({
    from: process.env.NOTIFICATIONS_EMAIL as string,
    to: emails.toString(),
    subject: taskData.tasks.title,
    text: taskData.tasks.description,
  });
};

const handleExpiredTasks = () => {
  // Get all uncompleted tasks from last minute
  PetModel.aggregate([
    { $unwind: "$tasks" },
    { $match: { "tasks.isCompleted": false } },
    {
      $match: {
        "tasks.dateFrom": {
          $gte: new Date(new Date().setMinutes(new Date().getMinutes() - 1)),
          $lte: new Date(),
        },
      },
    },
  ])
    .project({
      _id: 1,
      "tasks.title": 1,
      "tasks.description": 1,
      members: 1,
      groups: 1,
    })
    .lookup({
      from: "users",
      let: { members: "$members" },
      as: "membersEmails",
      pipeline: [
        {
          $match: {
            $expr: { $in: ["$_id", "$$members"] },
          },
        },
        { $project: { email: 1 } },
      ],
    })
    .lookup({
      from: "groups",
      let: { groups: "$groups" },
      as: "groupsMembers",
      pipeline: [
        {
          $match: {
            $expr: { $in: ["$_id", "$$groups"] },
          },
        },
        {
          $lookup: {
            from: "users",
            let: { members: "$members" },
            as: "membersEmails",
            pipeline: [
              {
                $match: {
                  $expr: { $in: ["$_id", "$$members"] },
                },
              },
              { $project: { email: 1 } },
            ],
          },
        },
        { $project: { membersEmails: 1 } },
      ],
    })
    .then((tasksToNotify) => {
      console.log("Finished query");
      console.log("expired tasks count:", tasksToNotify?.length);
      tasksToNotify?.forEach((x) => sendTaskNotification(x));
    })
    .catch((error) => {
      console.log("Got to error");
      console.log(error);
    });
};

export const notificateTasks = () => {
  // Scheduled to handle expired tasks every minute
  cron.schedule("* * * * *", () => {
    console.log("Schedule started", new Date());
    try {
      handleExpiredTasks();
    } catch (e) {
      console.log(e);
    }
  });
};
