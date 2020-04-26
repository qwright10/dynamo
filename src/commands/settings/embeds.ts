import { Command } from 'discord-akairo';
import { Message, MessageEmbed } from 'discord.js';
import { stripIndents } from 'common-tags';

export default class EmbedsCommand extends Command {
    public constructor() {
        super('settings-embeds', {
            aliases: ['embeds', 'preferembeds', 'prefer-embeds'],
            description: 'Changes preferEmbeds setting for guild.',
            category: 'settings',
            cooldown: 5000,
            ratelimit: 1,
            userPermissions: ['MANAGE_GUILD'],
            args: [
                {
                    id: 'value',
                    default: 'toggle'
                }
            ]
        });
    }

    public async exec(message: Message, { value }: { value: any }): Promise<Message | Message[]> {
        const preferEmbeds = await this.client.settings.get(message.guild!, 'general.preferEmbeds', undefined);
        if (!preferEmbeds) {
            const msg = 'Something went wrong while fetching guild settings.';
            return message.util!.send(new MessageEmbed().setDescription(msg));
        }

        if (value === 'toggle') {
            this.client.settings.set(message.guild!, 'general.preferEmbeds', !preferEmbeds);
            const msg = `Toggled \`preferEmbeds\` to ${!preferEmbeds}`;
            return message.util!.send(preferEmbeds ? new MessageEmbed().setDescription(msg) : msg);
        } else if (value === '1' || value === 'true' || value === 'yes') {
            if (preferEmbeds) {
                const msg = '`preferEmbeds` is already set to `true`';
                return message.util!.send(new MessageEmbed().setDescription(msg));
            }

            this.client.settings.set(message.guild!, 'general.preferEmbeds', true);
            const msg = '`preferEmbeds` is now set to `true`';
            return message.util!.send(new MessageEmbed().setDescription(msg));
        } else if (value === '0' || value === 'false' || value === 'no') {
            if (!preferEmbeds) {
                const msg = '`preferEmbeds` is already set to `false`';
                return message.util!.send(msg);
            }

            this.client.settings.set(message.guild!, 'general.preferEmbeds', false);
            const msg = '`preferEmbeds` is now set to `false`';
            return message.util!.send(msg);
        } else {
            const msg = stripIndents`
                \`${value}\` isn't a valid option.
                You can use \`true\`, \`1\`, \`yes\`,
                \`false\`, \`0\`, or \`no\`.`;
            return message.util!.send(preferEmbeds ? new MessageEmbed().setDescription(msg) : msg);
        }
    }
}