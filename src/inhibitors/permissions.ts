import { Inhibitor, Command } from 'discord-akairo';
import { BitFieldResolvable, Message, MessageEmbed, PermissionString } from 'discord.js';
import { stripIndents } from 'common-tags';

export default class PermissionsInhibitor extends Inhibitor {
    public constructor() {
        super('permissions', {
            reason: 'user permissions',
            type: 'post',
            priority: 3
        });
    }

    public async exec(message: Message, command: Command): Promise<boolean> {
        if (!message.guild || !message.member) return false;
        const [alertUnauth, preferEmbeds] = await this.client.settings.get(message.guild!,
            ['moderation.alertUnauth', 'general.preferEmbeds'], [true, true]);

        let missing: PermissionString[] | string = message.member.permissionsIn(message.channel).missing(command.userPermissions as BitFieldResolvable<PermissionString>);
        if (missing.length > 0) {
            if (alertUnauth) {
                missing = missing.map(m => `\`${m}\``).join(' ');
                const msg = stripIndents`
                    You need these permission the use this command:
                    ${missing}
                `;
                message.util!.send(preferEmbeds ? new MessageEmbed().setTitle('Missing Permissions').setDescription(missing) : msg);
            }
            return true;
        } 

        return false;
    }
}