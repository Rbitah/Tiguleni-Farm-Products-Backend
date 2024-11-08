import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "./role.enum";

@Entity()
export class Authentication {
    @PrimaryGeneratedColumn('uuid')
    user_Id:string

    @Column({unique:true})
    email:string

    @Column()
    password:string

    @Column()
    username:string

    @Column({type:'enum',enum:Role, default:Role.BUYER})
    role:Role
}
