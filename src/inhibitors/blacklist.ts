import { Inhibitor } from 'discord-akairo';
import { Message, MessageEmbed } from 'discord.js';

export default class BlacklistInhibtor extends Inhibitor {
    public constructor() {
        super('blacklist', {
            reason: 'blacklist',
            type: 'post',
            priority: 5
        });
    }

    public async exec(message: Message): Promise<boolean> {
        const [moderation, preferEmbeds] = await this.client.settings.get(message.guild!,
            ['moderation', 'general.preferEmbeds'],
            [this.client.settings.defaults.moderation, true]);
        if (moderation.blacklist.includes(message.author.id)) {
            if (moderation.alertUnauth) {
                const msg = 'You have been globally blacklisted.';
                message.util!.send(preferEmbeds ? new MessageEmbed().setDescription(msg) : msg);
            }
            return true;
        }

        return false;
    }
}