import { Command } from 'discord-akairo';
import { Message, MessageEmbed } from 'discord.js';

export default class PrefixCommand extends Command {
    public constructor() {
        super('settings-prefix', {
            aliases: ['prefix', 'setprefix'],
            description: 'Gets, sets, or resets/clears the guild prefix.',
            category: 'settings',
            channel: 'guild',
            cooldown: 5000,
            ratelimit: 2,
            userPermissions: ['MANAGE_GUILD'],
            args: [
                {
                    id: 'method',
                    default: 'get'
                },
                {
                    id: 'newPrefix'
                }
            ]
        });
    }

    public async exec(message: Message, { method, newPrefix }: { method: string, newPrefix: string }): Promise<Message | Message[]> {
        const { preferEmbeds, prefix } = await this.client.settings.get(message.guild!, 'general', this.client.settings.defaults);
        if (method === 'get') {
            const msg = `\`${message.guild!.name}\`'s current prefix is \`${prefix}\``;
            return message.util!.send(preferEmbeds ? new MessageEmbed().setDescription(msg) : msg);
        } else if (method === 'set') {
            if (!/[!@#$%^&*()_+-=[\]{}|;':",.<>/`~\d]{1,5}/.test(newPrefix)) {
                const msg = 'Prefixes can only be 1 to 5 characters.';
                return message.util!.send(preferEmbeds ? new MessageEmbed().setDescription(msg) : msg);
            }
            this.client.settings.set(message.guild!, 'general.prefix', newPrefix);
            const msg = `\`${message.guild!}\`'s prefix is now \`${newPrefix}\``;
            return message.util!.send(preferEmbeds ? new MessageEmbed().setDescription(msg) : msg);
        } else if (method === 'clear' || method === 'reset') {
            if (prefix === this.client.settings.defaults.general.prefix) {
                const msg = `\`${message.guild!.name}\`'s prefix is already the default prefix.`;
                return message.util!.send(preferEmbeds ? new MessageEmbed().setDescription(msg) : msg);
            }
            const np = await this.client.settings.reset(message.guild!, 'general.prefix');
            const msg = `\`${message.guild!.name}\`'s prefix was reset to \`${np.general.prefix}\``;
            return message.util!.send(preferEmbeds ? new MessageEmbed().setDescription(msg) : msg);
        } else {
            if (!method) {
                const msg = `\`${message.guild!.name}\`'s current prefix is \`${prefix}\``;
                return message.util!.send(preferEmbeds ? new MessageEmbed().setDescription(msg) : msg);
            }
            
            if (!/[!@#$%^&*()_+-=[\]{}|;':",.<>/`~\d]{1,5}/.test(method)) {
                const msg = 'Prefixes have to be 1 to 5 characters.';
                return message.util!.send(preferEmbeds ? new MessageEmbed().setDescription(msg) : msg);
            }
            this.client.settings.set(message.guild!, 'general.prefix', method);
            const msg = `\`${message.guild!}\`'s prefix is now \`${method}\``;
            return message.util!.send(preferEmbeds ? new MessageEmbed().setDescription(msg) : msg);
        }
    }
}