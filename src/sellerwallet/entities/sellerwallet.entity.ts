import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Sellerwallet {
    @PrimaryGeneratedColumn()
    sellerwallet_Id:number

    @Column()
    totalNumberOfSales:number

    @Column()
    totalSales:number

    @Column()
    totalNumberOfWithdrawals:number


    @Column()
    totalCashOut:number

    @Column()
    mainWalletBalance:number
}
