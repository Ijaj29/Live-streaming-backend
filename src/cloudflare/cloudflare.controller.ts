import {
    Controller, Post, Get, Body, Param,
    Req, UseGuards, Headers, RawBodyRequest, ParseIntPipe
} from '@nestjs/common';
import { CloudflareService } from './cloudflare.service';
import { AdminGuard } from '../auth/guards/admin.guard';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import * as crypto from 'crypto';

@Controller('stream')
export class StreamController {
    constructor(private readonly cfService: CloudflareService) { }

    // Create a new live input / channel
    @Post('create')
    async create(@Body() body: { title: string }) {
        return this.cfService.createLiveInput(body.title);
    }

    // Viewer: get signed token to watch
    @Get(':id/token')
    @UseGuards(JwtAuthGuard)
    async getToken(@Param('id', ParseIntPipe) id: number, @Req() req) {
        const token = await this.cfService.getSignedPlaybackToken(id, req.user.id);
        return { token };
    }

    // Viewer: get active stream metadata
    @Get('active')
    @UseGuards(JwtAuthGuard)
    async getActive() {
        return this.cfService.getActiveStream();
    }

    // Admin: manually mark stream as ended
    @Post(':id/end')
    @UseGuards(AdminGuard)
    async end(@Param('id', ParseIntPipe) id: number) {
        return this.cfService.endStream(id);
    }

    // Cloudflare webhook (no auth — verify signature instead)
    //   @Post('webhook')
    //   async webhook(
    //     @Body() body: any,
    //     @Headers('webhook-signature') signature: string,
    //   ) {
    //     // Verify webhook authenticity
    //     const expected = crypto
    //       .createHmac('sha256', process.env.CLOUDFLARE_WEBHOOK_SECRET)
    //       .update(JSON.stringify(body))
    //       .digest('hex');

    //     if (signature !== expected) return { ignored: true };

    //     return this.cfService.handleWebhook(body);
    //   }



    @Post('webhook')
    async webhook(
        @Body() body: any,
        @Headers('webhook-signature') signature: string,
    ) {
        const secret = process.env.CLOUDFLARE_WEBHOOK_SECRET;

        // If secret is configured, verify signature
        if (secret) {
            const expected = crypto
                .createHmac('sha256', secret)  // ✅ no longer undefined
                .update(JSON.stringify(body))
                .digest('hex');

            if (signature !== expected) {
                return { ignored: true };
            }
        }

        return this.cfService.handleWebhook(body);
    }
}