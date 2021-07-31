import Challenge from '@modules/challenges/infra/typeorm/entities/Challenge';

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity('submissions')
class Submission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  challenge_id: string;

  @Column()
  repository_url: string;

  @Column()
  status: string;

  @Column()
  grade: number;

  @OneToOne(() => Challenge)
  @JoinColumn({ name: 'challenge_id' })
  challengeId?: Challenge;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Submission;
