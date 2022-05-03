import { DiscordGatewayAdapterCreator, joinVoiceChannel } from "@discordjs/voice";
import { CommandInteraction, GuildMember, Snowflake } from "discord.js";
import log from "../log";
import { VoiceSubscription } from "./voiceSubscription";


const subscriptions = new Map<Snowflake, VoiceSubscription>();

export function getSubscription(interact : CommandInteraction): VoiceSubscription {
    if(interact.member instanceof GuildMember && !interact.member.voice.channel) {
        interact.reply({
            content: "You must be in a voice channel to use this command.",
            ephemeral: true
        });
        return null;
    }
    let subscription = subscriptions.get(interact.guild.id);
    log.debug({ interact }, 'getSubscription');
    if (!subscription) {
        log.trace(  { interact }, 'getSubscription - creating new subscription');
        if(interact.member instanceof GuildMember && interact.member.voice.channel) {
            const channel = interact.member.voice.channel;
            subscription = new VoiceSubscription(
                joinVoiceChannel({
                    channelId: channel.id,
                    guildId: channel.guild.id,
                    selfDeaf: false,
                    adapterCreator:channel.guild.voiceAdapterCreator as unknown as DiscordGatewayAdapterCreator
                })
            );
            subscription.voiceConnection.on("error", (err) => log.error("Voice Connection Error:", {err}));
        }
    }



    return subscriptions.get(interact.guildId);
}