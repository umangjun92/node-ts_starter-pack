import chalk from "chalk";
import fs from "fs";
import ncp from "ncp";
import path from "path";
import { promisify } from "util";
// import execa from "execa";
import Listr from "listr";
import { projectInstall } from "pkg-install";

import { RootDir } from "./utils/path";

const access = promisify(fs.access);
const copy = promisify(ncp);

async function copyTemplateFiles(options) {
    options = options || {};
    return copy(options.templateDirectory, options.targetDirectory, {
        clobber: false
    }).catch((e) => console.log(e));
}

export async function createProject(options) {
    options = options || {};
    options = {
        ...options,
        targetDirectory: options.targetDirectory || path.join(process.cwd(), options.appName)
    };

    const currentFileUrl = import.meta.url;

    // const templateDir = path.resolve(
    //     new URL(currentFileUrl).pathname,
    //     "../../templates",
    //     options.template && options.template.toLowerCase()
    // );
    options.templateDirectory = path.join(RootDir, "..", "templates");

    // try {
    //     await access(templateDir, fs.constants.R_OK);
    // } catch (err) {
    //     console.error("%s Invalid template name", chalk.red.bold("ERROR"));
    //     process.exit(1);
    // }

    const tasks = new Listr([
        {
            title: "Copy project files",
            task: () => copyTemplateFiles(options)
        },
        // {
        //     title: "Initialize git",
        //     task: () => initGit(options),
        //     enabled: () => options.git
        // },
        {
            title: "Install dependencies",
            task: () =>
                projectInstall({
                    cwd: options.targetDirectory,
                    prefer: options.pkgManager
                })
            // skip: () => (!options.runInstall ? "Pass --install to automatically install dependencies" : undefined)
        }
    ]);

    await tasks.run();

    console.log("%s Project Ready!!", chalk.green.bold("DONE"));
    return true;
}
