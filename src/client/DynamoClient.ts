import { AkairoClient, CommandHandler, InhibitorHandler, ListenerHandler } from 'discord-akairo';
import { Message, Intents } from 'discord.js';

import { createConnection } from 'typeorm';
import { SettingsProvider } from '../structures/db/SettingsProvider';
import { SettingsEntity } from '../structures/db/Settings';

import path from 'path';
import { Logger } from '../structures/util/Logger';

declare module 'discord-akairo' {
    interface AkairoClient {
        commandHandler: CommandHandler;
        config: AkairoBotConfig;
        inhibitorHandler: InhibitorHandler;
        listenerHandler: ListenerHandler;
        logger: typeof Logger;
        settings: SettingsProvider;
    }
}

interface AkairoBotConfig {
    owner?: string;
    token?: string;
}

export class DynamoClient extends AkairoClient {
    public commandHandler: CommandHandler = new CommandHandler(this, {
        directory: path.join(__dirname, '..', 'commands'),
        prefix: async (message: Message): Promise<string> => await this.settings.get(message.guild ?? '0', 'general.prefix', process.env.prefix),
        allowMention: true,
        handleEdits: true,
        commandUtil: true,
        commandUtilLifetime: 3e5,
        defaultCooldown: 3e3,
        argumentDefaults: {
            prompt: {
                modifyStart: (_:any, phrase: string): string => `${phrase}\nType \`cancel\` to cancel the command.`,
                modifyRetry: (_:any, phrase: string): string => `${phrase}\nType \`cancel\` to cancel the command.`,
                timeout: 'Command timed out, canceling.',
                ended: 'Too many attempts, canceling.',
                cancel: 'Command canceled',
                retries: 3,
                time: 3e4
            }
        }
    });

    public inhibitorHandler: InhibitorHandler = new InhibitorHandler(this, { directory: path.join(__dirname, '..', 'inhibitors') });
    public listenerHandler: ListenerHandler = new ListenerHandler(this, { directory: path.join(__dirname, '..', 'listeners') });

    public config: AkairoBotConfig;
    public logger = Logger;
    public settings: SettingsProvider;

    public constructor(config: AkairoBotConfig) {
        super({ ownerID: config.owner }, {
            messageCacheMaxSize: 10e3,
            messageCacheLifetime: 3600,
            shardCount: 1,
            ws: {
                intents: new Intents(['GUILDS', 'GUILD_MEMBERS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'DIRECT_MESSAGES', 'DIRECT_MESSAGE_REACTIONS'])
            }
        });

        this.config = config;
        this.settings = new SettingsProvider(this);
    }

    public async start(): Promise<string> {
        this.commandHandler.useInhibitorHandler(this.inhibitorHandler);
        this.commandHandler.useListenerHandler(this.listenerHandler);
        this.listenerHandler.setEmitters({
            commandHandler: this.commandHandler,
            inhibitorHandler: this.inhibitorHandler,
            listenerHandler: this.listenerHandler
        });

        this.commandHandler.loadAll();
        this.logger.log(`Commands loaded: ${this.commandHandler.modules.size} modules`);
        this.inhibitorHandler.loadAll();
        this.logger.log(`Inhibitors loaded: ${this.inhibitorHandler.modules.size} modules`);
        this.listenerHandler.loadAll();
        this.logger.log(`Listeners loaded: ${this.listenerHandler.modules.size} modules`);

        this.on('shardReady', (id: number) => this.logger.info(`Shard ${id} ready`));
        this.on('shardDisconnect', (_event:any, id: number) => this.logger.error(`Shard ${id} disconnected`));
        this.on('shardError', (error: Error, id: number) => this.logger.error(`Shard ${id} error: ${error}`));
        this.setMaxListeners(20);

        await createConnection({
            name: 'default',
            url: process.env.pg,
            type: 'postgres',
            entities: [SettingsEntity],
            synchronize: !!process.env.prod
        }).catch((e): any => {
            this.logger.error(`Failed to connect to postgres db:\n${e}`);
            return process.exit(1);
        });

        await this.settings.init();
        this.logger.log(`Settings provider initialized: ${this.settings.cache.size}`);

        this.logger.log('Logging in...');
        return this.login(this.config.token);
    }
}