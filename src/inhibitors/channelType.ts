import { Inhibitor, Command } from 'discord-akairo';
import { Message, MessageEmbed } from 'discord.js';

export default class ChannelTypeInhibitor extends Inhibitor {
    public constructor() {
        super('channelType', {
            reason: 'channel type',
            type: 'post',
            priority: 2
        });
    }

    public async exec(message: Message, command: Command): Promise<boolean> {
        if (!command.channel || command.channel === 'any') return false;
        if (command.channel === 'guild' && !message.guild) {
            const msg = `\`${message.util!.parsed?.alias}\` can only be used in guild channels.`;
            message.util!.send(new MessageEmbed().setDescription(msg));
            return true;
        } else if (command.channel === 'dm' && message.guild) {
            const preferEmbeds = await this.client.settings.get(message.guild, 'general.preferEmbeds', true);
            const msg = `\`${message.util!.parsed?.alias}\` can only be used in DM channels.`;
            message.util!.send(preferEmbeds ? new MessageEmbed().setDescription(msg) : msg);
            return true;
        }

        return false;
    }
}