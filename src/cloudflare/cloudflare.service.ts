import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { LiveStream } from '../entities/live-stream.entity';

@Injectable()
export class CloudflareService {
    private readonly baseUrl: string;
    private readonly headers: Record<string, string>;

    constructor(
        @InjectRepository(LiveStream)
        private streamRepo: Repository<LiveStream>,
        private configService: ConfigService,
    ) {
        this.baseUrl = `https://api.cloudflare.com/client/v4/accounts/${this.configService.get('CLOUDFLARE_ACCOUNT_ID')}/stream`;
        this.headers = {
            Authorization: `Bearer ${this.configService.get('CLOUDFLARE_API_TOKEN')}`,
            'Content-Type': 'application/json',
        };
    }

    // async createLiveInput(title: string, adminUserId?: number) {
    //     const response = await axios.post(
    //         `${this.baseUrl}/live_inputs`,
    //         {
    //             meta: { name: title },
    //             recording: {
    //                 mode: 'automatic',
    //                 requireSignedURLs: true,
    //                 allowedOrigins: [this.configService.get('FRONTEND_URL')],
    //             },
    //         },
    //         { headers: this.headers },
    //     );

    //     const input = response.data.result;

    //     const stream = this.streamRepo.create({
    //         cfStreamKey: input.uid,
    //         title,
    //         status: 'idle',
    //         createdBy: adminUserId ?? 0,
    //     });
    //     await this.streamRepo.save(stream);

    //     return {
    //         dbId: stream.id,
    //         streamKey: input.uid,
    //         rtmpUrl: input.rtmps.url,
    //         rtmpStreamKey: input.rtmps.streamKey,
    //     };
    // }

    async createLiveInput(title: string, adminUserId?: number) {
        try {
            const response = await axios.post(
                `${this.baseUrl}/live_inputs`,
                {
                    meta: { name: title },
                    recording: {
                        mode: 'automatic',
                        requireSignedURLs: true,
                        allowedOrigins: [this.configService.get('FRONTEND_URL')],
                    },
                },
                { headers: this.headers },
            );

            const input = response.data.result;

            const stream = this.streamRepo.create({
                cfStreamKey: input.uid,
                title,
                status: 'idle',
                createdBy: adminUserId ?? 0,
            });
            await this.streamRepo.save(stream);

            return {
                dbId: stream.id,
                streamKey: input.uid,
                rtmpUrl: input.rtmps.url,
                rtmpStreamKey: input.rtmps.streamKey,
            };
        } catch (err: any) {
            // Cloudflare's real complaint lives here
            console.error('CF live_input error:', err.response?.status, JSON.stringify(err.response?.data, null, 2));
            throw err;
        }
    }

    async getSignedPlaybackToken(streamId: number, userId: number): Promise<string> {
        const stream = await this.streamRepo.findOne({
            where: { id: streamId, status: 'live' },
        });
        if (!stream) throw new NotFoundException('No active stream found');

        // Create a signed token via Cloudflare API
        const response = await axios.post(
            `${this.baseUrl}/${stream.cfStreamKey}/token`,
            { exp: Math.floor(Date.now() / 1000) + 7200 }, // 2hr expiry
            { headers: this.headers },
        );

        return response.data.result.token;
    }

    async getActiveStream() {
        return this.streamRepo.findOne({
            where: { status: 'live' },
            select: {
                id: true,
                cfStreamKey: true,
                title: true,
                startedAt: true,
            },
            order: {
                startedAt: 'DESC',
            },
        });
    }

    async handleWebhook(payload: any) {
        const uid = payload?.input?.uid;
        const status = payload?.status;

        if (!uid) return { ignored: true };

        if (status === 'connected') {
            await this.streamRepo.update({ cfStreamKey: uid }, { status: 'connected' });
        } else if (status === 'live') {
            await this.streamRepo.update(
                { cfStreamKey: uid },
                { status: 'live', startedAt: new Date() },
            );
        } else if (status === 'disconnected') {
            await this.streamRepo.update(
                { cfStreamKey: uid },
                { status: 'ended', endedAt: new Date() },
            );
        }

        return { received: true };
    }

    async endStream(streamId: number) {
        const stream = await this.streamRepo.findOne({ where: { id: streamId } });
        if (!stream) throw new NotFoundException('Stream not found');

        await this.streamRepo.update(streamId, {
            status: 'ended',
            endedAt: new Date(),
        });
        return { success: true };
    }
}