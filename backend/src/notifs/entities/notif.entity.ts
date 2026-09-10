import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn} from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';

export enum NotifType 
{
    APPLICATION_RECEIVED = 'application_received',
}

@Entity()
export class Notifs {

    @PrimaryGeneratedColumn()
    @ApiProperty({ example: 1 })
    id: number;

    @Column()
    @ApiProperty({
        description: 'ID du destinataire de la notification',
        example: 42,
    })
    userId: number;

    @Column({
        type: 'enum',
        enum: NotifType,
        default: NotifType.APPLICATION_RECEIVED,
    })
    @ApiProperty({ enum: NotifType })
    type: NotifType;

    @Column()
    @ApiProperty({example: 'Nouvelle candidature reçue'})
    title: string;

    @Column()
    @ApiProperty({
        example:'Alice Martin a candidaté à votre offre Développeur C++.'})
    message: string;

    @Column({ type: 'int', nullable: true })
    @ApiProperty({
        required: false,
        nullable: true,
        example: 17,
    })
    applicationId: number | null;

    @Column({ default: false })
    @ApiProperty({ example: false })
    isRead: boolean;

    @CreateDateColumn()
    createdAt: Date;
}
