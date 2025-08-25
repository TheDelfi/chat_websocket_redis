import { Entity, Column, PrimaryGeneratedColumn, TableForeignKey, JoinColumn, ManyToOne, ManyToMany, PrimaryColumn } from 'typeorm';


@Entity()
export class User{
    @PrimaryColumn()
    id: string

    @Column({
        nullable:false,
        unique: true
    })
    name:string

    @Column({
        nullable:false,
        unique: true
    })
    email:string

    @Column({
        nullable:false
    })
    password:string
} 