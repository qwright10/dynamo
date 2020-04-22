import { Command } from 'discord-akairo';
import { Message, MessageEmbed } from 'discord.js';

export default class PingCommand extends Command {
    public constructor() {
        super('ping', {
            aliases: ['ping', 'pong'],
            description: 'Gets the latency to Discord\'s API',
            category: 'util',
            ratelimit: 2
        });
    }

    public async exec(message: Message): Promise<Message> {
        const m = await message.util!.send(new MessageEmbed().setDescription('Pinging...'));
        const embed = new MessageEmbed().setDescription(`🏓 ${Math.round(this.client.ws.ping)}ms`);
        return m.util?.edit(embed) ?? m.edit('', embed);
    }
}