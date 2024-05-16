// src/services/products/products.service.ts

import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../../entities/Product';
import { CreateProductDto } from '../../dtos/CreateProduct.dto';
import { UpdateProductDto } from '../../dtos/UpdateProduct.dto';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
    ) { }

    async getAllProducts(): Promise<Product[]> {
        return await this.productRepository.find();
    }

    async getProductById(id: number): Promise<Product> {
        const product = await this.productRepository.findOne({ where: { id } });
        if (!product) {
            throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
        }
        return product;
    }

    async createProduct(createProductDto: CreateProductDto): Promise<Product> {
        const newProduct = this.productRepository.create({
            ...createProductDto,
        });
        return await this.productRepository.save(newProduct);
    }

    async updateProduct(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
        const product = await this.productRepository.findOne({ where: { id } });
        if (!product) {
            throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
        }

        Object.assign(product, updateProductDto);

        return await this.productRepository.save(product);
    }

    async deleteProduct(id: number): Promise<string> {
        const product = await this.productRepository.findOne({ where: { id } });
        if (!product) {
            throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
        }
        await this.productRepository.delete(id);
        return 'Product Deleted';
    }
}
