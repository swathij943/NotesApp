/*
 * All routes for User Data are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /api/users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const router = express.Router();
const axios = require("axios");
const { insertTask } = require("../db/queries/tasks");

router.get("/", (req, res) => {
  res.render("chat");
});



router.post("/", async (req, res) => {
  try {
    const userMessage = req.body.user;
    const userID = req.session.user_id;

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "Hello! I'm your friendly librarian assistant here to help you. Please describe your task name, and will categorize it into one of the following categories: Eat (1), Watch (2), Read (3), Buy (4), Do (5) and Other (6). If there's any ambiguity, I'll ask for clarification up to three times before making my best guess and choosing the Other category. Once the task fits into a single category, write the task description // then the corresponding category number in a single line // then the category name",
          },
          {
            role: "user",
            content: userMessage,
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    res.json(response.data);

    if (!response.data.choices[0].message.content)
    {
      const messageArray = JSON.stringify(
        response.data.choices[0].message.content
      ).split("//");

      // required parameters
      let taskName = messageArray[0].substring(1, messageArray[0].length).trim();
      let categoryID = messageArray[1].trim();
      let categoryName = messageArray[2]
        .substring(0, messageArray[2].length - 1)
        .trim();
      let theDate = new Date();
      theDate.getUTCDate();

      // Handle EAT response
      if (taskName.length > 0) {
        if (categoryID === "1" && categoryName.includes("Eat")) {
          insertTask(taskName, categoryID, userID, categoryName);
        }

        // Handle WATCH response
        else if (categoryID === "2" && categoryName.includes("Watch")) {
          insertTask(taskName, categoryID, userID, categoryName);
        }

        // Handle READ response
        else if (categoryID === "3" && categoryName.includes("Read")) {
          insertTask(taskName, categoryID, userID, "FALSE", categoryName);
        }

        // Handle BUY response
        else if (categoryID === "4" && categoryName.includes("Buy")) {
          insertTask(taskName, categoryID, userID, "FALSE", categoryName);
        }

        // Handle DO response
        else if (categoryID === "5" && categoryName.includes("Do")) {
          insertTask(taskName, categoryID, userID, categoryName);
        }

        // Handle OTHER  response
        else if (categoryID === "6" && categoryName.includes("Other")) {
          insertTask(taskName, categoryID, userID, categoryName);
        }
      }
    }


  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong." });
  }
});

module.exports = router;
