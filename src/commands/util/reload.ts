import { Command } from 'discord-akairo';
import { Message, MessageEmbed } from 'discord.js';

export default class ReloadCommand extends Command {
    public constructor() {
        super('reload', {
            aliases: ['reload'],
            description: 'Reloads commands, inhibitors, and listeners.',
            ownerOnly: true,
            args: [
                {
                    id: 'module',
                    default: ''
                }
            ]
        });
    }

    public async exec(message: Message, { module }: { module: string }): Promise<Message | Message[]> {
        const { commandHandler, inhibitorHandler, listenerHandler } = this.client;
        if (module && (!commandHandler.modules.has(module)
            && !inhibitorHandler.modules.has(module)
            && !listenerHandler.modules.has(module))) {
            return message.util!.send(new MessageEmbed().setDescription(`The module \`${module}\` can't be found.`));
        } else if (!module) {
            const commands = commandHandler.reloadAll().modules.size;
            const inhibitors = inhibitorHandler.reloadAll().modules.size;
            const listeners = listenerHandler.reloadAll().modules.size;
            const embed = new MessageEmbed()
                .addField('Commands', commands, true)
                .addField('Inhibitors', inhibitors, true)
                .addField('Listeners', listeners, true)
                .setTimestamp();
            return message.util!.send(embed);
        }

        const mod = commandHandler.modules.get(module) ?? inhibitorHandler.modules.get(module) ?? listenerHandler.modules.get(module);
        if (!mod) return message.util!.send(new MessageEmbed().setDescription(`Module \`${module}\` couldn't be found`));
        const m = mod.reload();
        return message.util!.send(new MessageEmbed().setDescription(`Reloaded \`${m.id}\`.`));

    }
}