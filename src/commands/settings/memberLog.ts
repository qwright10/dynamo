import { Command, PrefixSupplier } from 'discord-akairo';
import { Message, MessageEmbed, TextChannel } from 'discord.js';
import { stripIndents } from 'common-tags';

export default class SettingsMemberLogCommand extends Command {
    public constructor() {
        super('settings-memberLog', {
            aliases: ['memberlog'],
            description: 'Sets the guild\'s member log channel.',
            category: 'settings',
            channel: 'guild',
            cooldown: 10000,
            ratelimit: 2,
            args: [
                {
                    id: 'method',
                    type: 'lowercase',
                    default: 'get'
                },
                {
                    id: 'channel',
                    type: 'textChannel',
                    default: (message: Message) => message.channel
                }
            ]
        });
    }

    public async exec(message: Message, { method, channel }: { method: string, channel: TextChannel }): Promise<Message | Message[]> {
        const [embeds, memberLog] = await this.client.settings.get(message.guild!, ['general.preferEmbeds', 'channels.memberLog'], [true, '']);
        if (method === 'get') {
            let msg = '';
            const current = message.guild!.channels.cache.get(memberLog);
            if (!current) {
                if (current !== '') this.client.settings.set(message.guild!, 'channels.memberLog', '');
                msg = `\`${message.guild!.name}\` has no member log channel set.`;
            } else msg = `\`${message.guild!.name}\`'s member log channel is set to ${current}.`;
            
            return message.util!.send(embeds ? new MessageEmbed().setDescription(msg) : msg);
        } else if (method === 'set') {
            let msg = '';
            if (channel.guild.id !== message.guild!.id) msg = `\`${channel.name}\` is not in this guild.`;
            else {
                this.client.settings.set(message.guild!, 'channels.memberLog', channel.id);
                msg = `\`${message.guild!.name}\`'s member log channel is now ${channel}`;
            }

            return message.util!.send(embeds ? new MessageEmbed().setDescription(msg) : msg);
        } else if (method === 'clear') {
            let msg = '';
            const current = this.client.channels.cache.get(memberLog);
            if (current) {
                this.client.settings.reset(message.guild!, 'channels.memberLog');
                msg = `\`${message.guild!.name}\`'s member log channel was reset.`;
            } else msg = `\`${message.guild!.name}\` has no member log channel set.`;
            return message.util!.send(embeds ? new MessageEmbed().setDescription(msg) : msg);
        } else {
            const prefix = await (this.handler.prefix as PrefixSupplier)(message);
            const msg = stripIndents`
                That method doesn't exist on \`${message.util?.parsed?.alias ?? 'memberLog'}\`.
                Run \`${prefix}help ${message.util?.parsed?.alias ?? 'settings'}\` for help.
            `;
            return message.util!.send(embeds ? new MessageEmbed().setDescription(msg) : msg);
        }
    }
}