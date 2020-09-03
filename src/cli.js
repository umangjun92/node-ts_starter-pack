import { createProject } from "./main";
import arg from "arg";

import inquirer from "inquirer";

const defaults = {
    skipPrompts: false,
    appName: "your-node-app",
    pkgManager: "yarn"
};

function parseArgumentsIntoOptions(rawArgs) {
    const args = arg(
        {
            "--git": Boolean,
            "--yes": Boolean,
            "--install": Boolean,
            "-g": "--git",
            "-y": "--yes",
            "-i": "--install"
        },
        {
            argv: rawArgs.slice(2)
        }
    );
    return {
        skipPrompts: args["--yes"] || defaults.skipPrompts,
        appName: args["--name"],
        // git: args["--git"] || false,
        // template: args._[0],
        // runInstall: args["--install"] || false,
        pkgManager: args["--pkgManager"]
    };
}

async function promptForMissingOptions(options) {
    if (options.skipPrompts) {
        return options;
    }

    const questions = [];

    if (!options.appName) {
        questions.push({
            // type: "",
            name: "appName",
            message: "Name of your project: "
            // choices: ["JavaScript", "TypeScript"],
            // default: defaultTemplate
        });
    }

    if (!options.pkgManager) {
        questions.push({
            type: "list",
            name: "pkgManager",
            message: "Select package manager: ",
            choices: ["yarn", "npm"],
            default: "yarn"
        });
    }

    const answers = await inquirer.prompt(questions);

    return {
        ...options,
        appName: options.appName || answers.appName,
        pkgManager: options.pkgManager || answers.pkgManager
        // git: options.git || answers.git
    };
}

export async function cli(args) {
    let options = parseArgumentsIntoOptions(args);
    options = await promptForMissingOptions(options);
    await createProject(options);
}
