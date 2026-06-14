import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('stream_chats')
export class StreamChat {
  @PrimaryGeneratedColumn()
  id: number = 0;

  @Column({ name: 'stream_id' })
  streamId: number = 0;

  @Column({ name: 'user_id' })
  userId: number = 0;

  @Column()
  username: string = '';

  @Column('text')
  message: string = '';

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date = new Date();
}