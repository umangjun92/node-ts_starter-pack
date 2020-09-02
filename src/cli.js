import { createProject } from "./main";

function parseArgumentsIntoOptions(rawArgs) {
    // ...
}

async function promptForMissingOptions(options) {
    // ...
}

export async function cli(args) {
    let options = parseArgumentsIntoOptions(args);
    options = await promptForMissingOptions(options);
    await createProject(options);
}
