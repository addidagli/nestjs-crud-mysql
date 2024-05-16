import { Body, Controller, Get, Post, Put, Delete, Param, ParseIntPipe } from '@nestjs/common';
import { ProductsService } from '../../services/products/products.service';
import { Product } from '../../../entities/Product';
import { CreateProductDto } from '../../dtos/CreateProduct.dto';
import { UpdateProductDto } from '../../dtos/UpdateProduct.dto';


@Controller('products')
export class ProductsController {
    constructor(private productService: ProductsService) { }

    @Get()
    async getAllProducts(): Promise<Product[]> {
        return await this.productService.getAllProducts();
    }

    @Get(':id')
    async getProductById(@Param('id', ParseIntPipe) id: number): Promise<Product> {
        return await this.productService.getProductById(id);
    }

    @Post('create')
    async createProduct(@Body() createProductDto: CreateProductDto): Promise<Product> {
        return await this.productService.createProduct(createProductDto);
    }

    @Put('update/:id')
    async updateProduct(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateProductDto: UpdateProductDto,
    ): Promise<Product> {
        return await this.productService.updateProduct(id, updateProductDto);
    }

    @Delete('delete/:id')
    async deleteProductById(@Param('id', ParseIntPipe) id: number): Promise<string> {
        return await this.productService.deleteProduct(id);
    }
}
