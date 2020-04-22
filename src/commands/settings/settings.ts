import { Command, Flag, PrefixSupplier } from 'discord-akairo';
import { Message, MessageEmbed } from 'discord.js';
import { stripIndents } from 'common-tags';

export default class SettingsCommand extends Command {
    public constructor() {
        super('settings', {
            aliases: ['settings', 'config'],
            description: 'Configures bot settings.',
            category: 'settings',
            cooldown: 5000,
            ratelimit: 2
        });
    }

    public *args() {
        const method = yield {
            type: [
                ['settings-embeds', 'embeds'],
                ['settings-memberLog', 'memberLog'],
                ['settings-prefix', 'prefix']
            ],
            otherwise: async (message: Message) => {
                const prefix = await (this.handler.prefix as PrefixSupplier)(message);
                const useEmbeds = this.client.settings.get(message.guild || '0', 'general.preferEmbeds', true);
                const msg = stripIndents`
                    That method doesn't exist on \`${message.util?.parsed?.alias ?? 'settings'}\`.
                    Run \`${prefix}help ${message.util?.parsed?.alias ?? 'settings'}\` for help.
                `;
                return useEmbeds ? new MessageEmbed().setDescription(msg) : msg;
            }
        };

        return Flag.continue(method);
    }
}