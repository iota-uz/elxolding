/* eslint-disable @typescript-eslint/no-unused-vars */
import * as fsSync from 'fs';
import * as fs from 'fs/promises';
import {dirname} from 'path';

import {Application} from '../declarations';
import logger from '../logger';
import {sleep} from '../utils';

export interface TaskModule {
    every: number
    run: (app: Application) => void
}

async function runTasks(app: Application, path: string) {
    const root = dirname(<string>require.main?.filename);
    const tasksFolder = `${root}/${path}`;
    if (!fsSync.existsSync(tasksFolder)) {
        logger.warn(`Tasks folder ${tasksFolder} does not exist`);
        return;
    }
    const files = await fs.readdir(tasksFolder);
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const modules: TaskModule[] = files.map(el => require(`${root}/${path}/${el}`).default);
    const promises = modules.map(async module => {
        // eslint-disable-next-line no-constant-condition
        while (1) {
            try {
                await module.run(app);
            } catch (e) {
                logger.warn(e);
            }
            await sleep(module.every * 1000);
        }
    });
    await Promise.all(promises);
}


export default function registerTasks(path: string) {
    return (app: Application) => {
        runTasks(app, path).catch(e => {
            logger.warn('Task schedule', e);
        });
    };
}
