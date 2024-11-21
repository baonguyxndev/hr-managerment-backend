import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './middleware/passport/jwt-auth.guard';
import { UsersModule } from './users/module/users.module';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configServer: ConfigService) => ({
        uri: configServer.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService]
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 465, // 465 SSL(Bảo mật)/secure: true hoặc 587 TLS(Không bảo mật)/secure: false
          secure: true,
          // ignoreTLS: true,
          auth: {
            user: configService.get<string>('MAIL_USER'),
            pass: configService.get<string>('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: '"Giáo Xứ Tân Trang" <no-reply@giaoxutantrang@gmail.com>',
        },
        // preview: true,
        // template: {
        //   dir: process.cwd() + '/src/mail/templates/',
        //   adapter: new HandlebarsAdapter(),
        //   options: {
        //     strict: true,
        //   },
        // },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    }
  ],
})
export class AppModule { }
