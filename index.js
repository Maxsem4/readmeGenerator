"use strict";

const fs = require("fs").promises;
const inquirer = require("inquirer");
const axios = require("axios");

let profilePic = "";

const questions = [
  {
    name: "title",
    type: "input",
    message: "Title of your project:",
    default: "Project Title"
  },
  {
    name: "description",
    type: "input",
    message: "Describe your project:",
    default:
      "A short description of the motivation behind the creation and maintenance of the project. This should explain why the project exists."
  },
  {
    name: "installing",
    type: "input",
    message: "Steps on how to install: ",
    default:
      "Provide step by step series of examples and explanations about how to get a development environement running."
  },
  {
    name: "usage",
    type: "input",
    message: "Steps on how to use this application:",
    default:
      "If people like your project they’ll want to learn how they can use it. To do so include step by step guide to use your project."
  },
  {
    name: "contributing",
    type: "input",
    message: "How can someone contribute to this project:",
    default:
      "Let people know how they can contribute into your project. A contributing guideline will be a big plus."
  },
  {
    name: "test",
    type: "input",
    message: "Provide examples and tests of the application:",
    default: "Describe and show how to run the tests with code examples."
  },
  {
    name: "questions",
    type: "input",
    message:
      "Provide an email for people to get a hold of you and ask questions:",
    default: "Hidden"
  }
];

username()
  .then(apiCall)
  .then(askQuestions)
  .then(makeReadme)
  .then(generateReadme);

function username() {
  return inquirer.prompt({
    message: "Provide your GitHub username:",
    name: "username"
  });
}

async function apiCall({ username }) {
  try {
    const response = await axios.get(
      `https://api.github.com/users/${username}`
    );
    profilePic = response.data.avatar_url;
  } catch (err) {
    console.log(err);
  }
}

function askQuestions() {
  return inquirer.prompt(questions);
}

function makeReadme(answers) {
  return `\n# ${answers.title}\n## Description\n${answers.description}\n## Instaling\n${answers.installing}\n## How to use?\n${answers.usage}\n## Contribute\n${answers.contributing}\n## Tests\n${answers.test}\n## Questions\n Email: 'hidden'\n [profile image] (${profilePic})`;
}

async function generateReadme(data) {
  try {
    await fs.writeFile("newREADME.md", data);
  } catch (err) {
    console.log(err);
  }
}
