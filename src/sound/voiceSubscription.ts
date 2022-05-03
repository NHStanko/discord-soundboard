import {
	AudioPlayer,
	AudioResource,
	createAudioPlayer,
	entersState,
	NoSubscriberBehavior,
	VoiceConnection,
	VoiceConnectionDisconnectReason,
	VoiceConnectionStatus,
} from '@discordjs/voice';
import { promisify } from 'node:util';
import log from '../log';

const wait = promisify(setTimeout);

/**
 * A MusicSubscription exists for each active VoiceConnection. Each subscription has its own audio player and queue,
 * and it also attaches logic to the audio player and voice connection for error handling and reconnection logic.
 */
export class VoiceSubscription {
	public readonly voiceConnection: VoiceConnection;
	public readonly audioPlayer: AudioPlayer;
	public readyLock = false;
    public manualDisconnect = true;

	public constructor(voiceConnection: VoiceConnection) {
		this.voiceConnection = voiceConnection;
		this.audioPlayer = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Pause
            }
        });

		this.voiceConnection.on('stateChange', async (_: any, newState: { status: any; reason: any; closeCode: number; }) => {
            log.trace({ newState }, 'VoiceConnection state change');
            if(!this.manualDisconnect) {
                if (newState.status === VoiceConnectionStatus.Disconnected) {
                    if (newState.reason === VoiceConnectionDisconnectReason.WebSocketClose && newState.closeCode === 4014) {
                        /**
                         * If the WebSocket closed with a 4014 code, this means that we should not manually attempt to reconnect,
                         * but there is a chance the connection will recover itself if the reason of the disconnect was due to
                         * switching voice channels. This is also the same code for the bot being kicked from the voice channel,
                         * so we allow 5 seconds to figure out which scenario it is. If the bot has been kicked, we should destroy
                         * the voice connection.
                         */
                        log.error('Voice connection closed due to a 4014 code, attempting to reconnect');
                        try {
                            await entersState(this.voiceConnection, VoiceConnectionStatus.Connecting, 5_000);
                            log.info('Reconnected to voice channel');
                            // Probably moved voice channel
                        } catch {
                            this.voiceConnection.destroy();
                            log.error('Failed to reconnect to voice channel, destroying');
                            // Probably removed from voice channel
                        }
                    } else if (this.voiceConnection.rejoinAttempts < 5) {
                        /**
                         * The disconnect in this case is recoverable, and we also have <5 repeated attempts so we will reconnect.
                         */
                        log.warn('Voice connection closed, attempting to reconnect (attempt #' + this.voiceConnection.rejoinAttempts + ')');
                        await wait((this.voiceConnection.rejoinAttempts + 1) * 5_000);
                        this.voiceConnection.rejoin();
                    } else {
                        /**
                         * The disconnect in this case may be recoverable, but we have no more remaining attempts - destroy.
                         */
                        log.error('Voice connection closed, failed to reconnect (attempt #' + this.voiceConnection.rejoinAttempts + '), destroying');
                        this.voiceConnection.destroy();
                    }
                } else if (newState.status === VoiceConnectionStatus.Destroyed) {
                    /**
                     * Once destroyed, stop the subscription.
                     */
                    log.debug('Voice connection destroyed, stopping subscription');
                    this.stop();
                } else if (
                    !this.readyLock &&
                    (newState.status === VoiceConnectionStatus.Connecting || newState.status === VoiceConnectionStatus.Signalling)
                ) {
                    /**
                     * In the Signalling or Connecting states, we set a 20 second time limit for the connection to become ready
                     * before destroying the voice connection. This stops the voice connection permanently existing in one of these
                     * states.
                     */
                    log.debug('Voice connection entering ready state, waiting 20 seconds before destroying');
                    this.readyLock = true;
                    try {
                        await entersState(this.voiceConnection, VoiceConnectionStatus.Ready, 20_000);
                    } catch {
                        if (this.voiceConnection.state.status !== VoiceConnectionStatus.Destroyed) this.voiceConnection.destroy();
                        log.error('Voice connection failed to become ready, destroying');
                    } finally {
                        this.readyLock = false;
                    }
                }
            }else{
                log.debug('Manual disconnect, not attempting to reconnect');
            }
		});

        // audioPlayer logging
        this.audioPlayer.on('stateChange', (oldState: { status: any; resource: any; }, newState: { status: any; resource: any; }) => {
        	log.trace({ oldState, newState }, 'AudioPlayer state change');
        });

		this.audioPlayer.on('error', (error: { resource: any; }) => (log.error({ error }, 'Audio player error')));

		voiceConnection.subscribe(this.audioPlayer);
	}


	/**
	 * Stops audio playback.
	 */
	public stop() {
		this.audioPlayer.stop(true);
	}

    // Plays an audio resource
    public play(audio: AudioResource){
        this.audioPlayer.play(audio); 
    }


}