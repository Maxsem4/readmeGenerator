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
    name: "license",
    type: "input",
    message: "Choose a license:",
    choices: ["MIT", "Mozilla_PL_2", "GNU_3", "Apache"]
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
  .then(repoName)
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

function repoName() {
  return inquirer.prompt({
    message: "Provide GitHub repository name",
    name: "repoName"
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

function makeReadme(data) {
  let lastCommit = `![Last Commit](https://img.shields.io/github/last-commit/${data.username}/${data.repoName})`;
  let openIssues = `![GitHub issues](https://img.shields.io/github/issues-raw/${data.username}/${data.repoName})`;
  let codeSize = `![Code-size](https://img.shields.io/github/languages/code-size/${data.username}/${data.repoName})`;
  let contributors = `![Contributors](https://img.shields.io/github/contributors/${data.username}/${data.repoName})`;

  let badge;

  if (data.license === "MIT") {
    badge =
      "[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)";
  } else if (data.license === "Mozilla_PL_2") {
    badge =
      "[![License: MPL 2.0](https://img.shields.io/badge/License-MPL%202.0-brightgreen.svg)](https://opensource.org/licenses/MPL-2.0)";
  } else if (data.license === "GNU_3") {
    badge =
      "[![License: GPL v3](https://img.shields.io/badge/License-GPL%20v3-blue.svg)](http://www.gnu.org/licenses/gpl-3.0)";
  } else if (data.license === "Apache") {
    badge =
      "[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)";
  }

  return `\n# ${data.title}\n${openIssues} ${contributors} ${codeSize} ${lastCommit}\n## Description\n${data.description}\n## Table of Contents\n* [Installing](#Installing)\n* [How_to_use?](#How_to_Use?)\n* [License](#License)\n* [Contribute](#Contribute)\n* [Tests](#Tests)\n* [Questions](#Questions)\n ## Installing\n${data.installing}\n## How_to_use?\n${data.usage}\n## License\n ${badge}\n## Contribute\n${data.contributing}\n## Tests\n${data.test}\n## Questions\n Email: 'hidden'\n [profile image] (${profilePic})`;
}

async function generateReadme(data) {
  try {
    await fs.writeFile("newREADME.md", data);
  } catch (err) {
    console.log(err);
  }
}
