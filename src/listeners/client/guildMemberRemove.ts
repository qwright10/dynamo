import { Listener } from 'discord-akairo';
import { GuildMember, MessageEmbed, TextChannel } from 'discord.js';

export default class GuildMemberRemoveListener extends Listener {
    public constructor() {
        super('guildMemberRemove', {
            event: 'guildMemberRemove',
            emitter: 'client',
            category: 'client'
        });
    }

    public async exec(member: GuildMember): Promise<any> {
        const [embeds, memberLog, leave] = await this.client.settings.get(member.guild,
            ['general.preferEmbeds', 'channels.memberLog', 'channels.leave'],
            [true, '', this.client.settings.defaults.channels.leave]);
        
        if (memberLog && member.guild.channels.cache.has(memberLog)) {
            const channel = member.guild.channels.cache.get(memberLog)!;
            if (channel.type !== 'text') return;
            if (!channel.permissionsFor(member.guild.me!)!.has(['SEND_MESSAGES', 'EMBED_LINKS'])) return;

            const phrase = this.replace(leave.custom ? leave.value : leave.default, member);
            const msg = embeds ? new MessageEmbed().setDescription(phrase) : phrase;
            return (channel as TextChannel).send(msg);
        }
    }

    private replace(text: string, member: GuildMember): string {
        return text
            .replace('{mention}', member.toString())
            .replace('{servername}', member.guild.name)
            .replace('{tag}', member.user.tag)
            .replace('{username}', member.user.username);
    }
}