import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('live_streams')
export class LiveStream {
  @PrimaryGeneratedColumn()
  id: number = 0;

  @Column({ name: 'cf_stream_key', unique: true })
  cfStreamKey: string = '';

  @Column({ name: 'cf_stream_uid', nullable: true })
  cfStreamUid: string = '';

  @Column({ nullable: true })
  title: string = '';

  @Column({ nullable: true })
  description: string = '';

  @Column({ default: 'idle' })
  status: 'idle' | 'connected' | 'live' | 'ended' = 'idle';

  @Column({ name: 'started_at', nullable: true })
  startedAt: Date = new Date();

  @Column({ name: 'ended_at', nullable: true })
  endedAt: Date = new Date();

  @Column({ name: 'created_by' })
  createdBy: number = 0;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date = new Date();
}