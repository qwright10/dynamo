import { Listener } from 'discord-akairo';

export default class ReadyListener extends Listener {
    public constructor() {
        super('ready', {
            event: 'ready',
            emitter: 'client',
            category: 'client'
        });
    }

    public async exec(): Promise<void> {
        this.client.logger.info(`Logged in as ${this.client.user?.tag ?? 'unknown'}`);
        const memberCount = this.client.guilds.cache.reduce((a, b) => a + (b.memberCount ?? 0), 0);
        this.client.user?.setPresence({
            activity: {
                name: `${memberCount ?? 'some'} users`,
                type: 'WATCHING'
            },
            status: 'dnd'
        });
    }
}