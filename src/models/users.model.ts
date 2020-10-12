import { UserStatus } from '../core';
import { Entity, Column } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  /**
   * The id of the user.
   * (set as '?' for enable off validation only)
   */
  @Column({ name: 'guid', type: 'varchar', length: 36, nullable: false, primary: true })
  public guid?: string;

  /**
   * The user mail, used to send notification in case of user not sending ack, or note before user deleting etc.
   */
  @Column({ name: 'self_email', type: 'varchar', length: 150, nullable: false })
  public selfEmail: string;

  /**
   * A name to send in the email etc. not the real user name, since we don't want to hold it.
   */
  @Column({ name: 'nickname', type: 'varchar', length: 100, nullable: false })
  public nickname: string;

  /**
   * The next ack from this user (if not, there is a problem)
   */
  @Column({ name: 'next_ack', type: 'int', nullable: true })
  public nextAck?: number;

  /**
   * The user known status
   */
  @Column({ name: 'status', type: 'enum', enum: UserStatus, nullable: false })
  public status: UserStatus;

  constructor(private user?: Partial<User>) {
    if (user) {
      Object.assign(this, user);
    }
  }
}
