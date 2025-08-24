import { Entity, Column, PrimaryGeneratedColumn, TableForeignKey, JoinColumn, ManyToOne, ManyToMany } from 'typeorm';


@Entity()
export class User{
    @PrimaryGeneratedColumn()
    id: number

    
} 