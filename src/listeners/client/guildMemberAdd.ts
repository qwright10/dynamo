import { Listener } from 'discord-akairo';
import { GuildMember, MessageEmbed, TextChannel } from 'discord.js';

export default class GuildMemberAddListener extends Listener {
    public constructor() {
        super('guildMemberAdd', {
            event: 'guildMemberAdd',
            emitter: 'client',
            category: 'client'
        });
    }

    public async exec(member: GuildMember): Promise<any> {
        const [embeds, memberLog, welcome] = await this.client.settings.get(member.guild,
            ['general.preferEmbeds', 'channels.memberLog', 'channels.welcome'],
            [true, '', this.client.settings.defaults.channels.welcome]);
        
        if (memberLog && member.guild.channels.cache.has(memberLog)) {
            const channel = member.guild.channels.cache.get(memberLog)!;
            if (channel.type !== 'text') return;
            if (!channel.permissionsFor(member.guild.me!)!.has(['SEND_MESSAGES', 'EMBED_LINKS'])) return;

            const phrase = this.replace(welcome.custom ? welcome.value : welcome.default, member);
            const msg = embeds ? new MessageEmbed().setDescription(phrase).setColor([0, 255, 0]) : phrase;
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