import { defu } from 'defu';
import plugin from 'tailwindcss/plugin';

type Plugin = ReturnType<typeof plugin>

export function mergePlugins(plugins: Plugin[]) {
    let config = {};

    for (const plugin of plugins) {
        config = defu(config, plugin.config ?? {});
    }

    return plugin((api) => plugins.map((plugin) => plugin.handler(api)), config);
}
