import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";

@Entity()
export class Products{
    @PrimaryGeneratedColumn()
    id:number;
    @Column()
    products_id:number;
    @Column()
    products_name:string;
    @Column()
    price:number;
    @Column()
    location:string;
    @Column()
    quantity_amount:number;
    @Column()
    quantity_metric:string;
    @Column()
    imageurl:string;
    
    


    
}