import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Withdrawal {
    @PrimaryGeneratedColumn()
    withdrawal_Id:number

    @Column()
    seller_id:number
    
    @Column()
    amountCashedOut:number

    @Column()
    date:Date

    @Column()
    trans_Id:string

    @Column()
    phoneNumber:number

    @Column()
    status:Boolean
    
}
