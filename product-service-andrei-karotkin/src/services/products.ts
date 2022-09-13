import Product from "../models/product";
import { DocumentClient } from "aws-sdk/clients/dynamodb";

export default class ProductService {

    private TABLE_NAME = process.env['PRODUCT_TABLE_NAME'];


    constructor(private docClient: DocumentClient) {}

    async getProducts() {
        const products = await this.docClient.scan({
            TableName: this.TABLE_NAME,
        }).promise()
        return products.Items as Product[];
    }

    async createProduct(product: Product): Promise<Product> {
        await this.docClient.put({
            TableName: this.TABLE_NAME,
            Item: product
        }).promise()
        return product as Product;
    }

    async getProduct(id: string) {
        const product = await this.docClient.get({
            TableName: this.TABLE_NAME,
            Key: {
                id: id
            }
        }).promise();

        if (!product.Item) {
            throw new Error('The product not found');
        }
        return product.Item as Product;
    }

    async deleteProduct(id: string): Promise<any> {
        return await this.docClient.delete({
            TableName: this.TABLE_NAME,
            Key: {
                id: id
            }
        }).promise();
    }

}