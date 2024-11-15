import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Products } from './products.entity';

@Injectable()
export class ProductsService{
    findOneBy: any;
    constructor(
        @InjectRepository(Products)
        private productsRepository: Repository<Products>){};
createproducts(products):Promise<null|Products>{
    return this.productsRepository.save(products)
}   
getproducts(id:number):Promise<null|Products>{
    return this.findOneBy({id});
}
searchByQuery(query):Promise<Products[]>{
    return this.productsRepository.find({where:[
        {products_name:ILike(`%${query}%`)},
        {location:ILike(`%${query}%`)}
        
    ]
    });
}
}


