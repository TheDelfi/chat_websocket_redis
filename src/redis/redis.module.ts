import { Module } from '@nestjs/common';
import { createClient } from 'redis'


@Module({
    providers:[{
        provide: 'CONNECTED_REDIS',
        useFactory: async() => {
            const client = await createClient({ url: 'redis://localhost:6379' })
            await client.connect()
            return client
        }
    }],
    exports: ['CONNECTED_REDIS']
})
export class RedisModule {}
