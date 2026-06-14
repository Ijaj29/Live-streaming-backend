import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { CloudflareModule } from './cloudflare/cloudflare.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CloudflareModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
