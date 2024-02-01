import { hasPreset,preset } from './preset';
import type { ShurikenUIConfig } from './schema';

export * from './preset';

/**
 * Inject the shuriken-ui preset into a tailwind config if not already present
 */
export function withShurikenUI(config: ShurikenUIConfig) {
    if (hasPreset(config)) {
        return config;
    }

    config.presets ??= [];
    config.presets.push(preset);

    return config;
}
