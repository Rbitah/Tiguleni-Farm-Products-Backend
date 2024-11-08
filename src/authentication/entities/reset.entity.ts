import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import {  User } from "./authentication.entity";

@Entity()
export class Token {
    @PrimaryGeneratedColumn('uuid')
    token_Id:string

    @Column()
    token:string

    @Column()
    expirationDate:Date
    
    @OneToOne(() => User) 
    @JoinColumn() 
    user: User;

}
