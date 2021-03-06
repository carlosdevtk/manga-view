import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { UserModule } from './user/user.module';
import { AuthorModule } from './author/author.module';
import { Author } from './author/author.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'sqlite',
          database: 'db.sqlite',
          synchronize: true,
          entities: [User, Author],
        };
      },
    }),
    UserModule,
    AuthorModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
