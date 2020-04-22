import { Listener } from 'discord-akairo';
import { Guild } from 'discord.js';

export default class GuildCreateListener extends Listener {
    public constructor() {
        super('guildCreate', {
            event: 'guildCreate',
            emitter: 'client',
            category: 'client'
        });
    }

    public async exec(guild: Guild): Promise<void> {
        this.client.settings.create(guild);
        const owner = await this.client.users.fetch(guild.ownerID);
        console.log(`Guild: ${guild.name} ${owner.id}`);
    }
}