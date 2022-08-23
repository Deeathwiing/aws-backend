import {Product} from "../types";


export class ProductService {
    private mockProducts: Product[] = [
        {
            description: "Short Product Description1",
            id: "7567ec4b-b10c-48c5-9345-fc73c48a80aa",
            price: 24,
            title: "Test1",
        },
        {
            description: "Short Product Description7",
            id: "7567ec4b-b10c-48c5-9345-fc73c48a80a1",
            price: 15,
            title: "Test2",
        },
        {
            description: "Short Product Description2",
            id: "7567ec4b-b10c-48c5-9345-fc73c48a80a3",
            price: 23,
            title: "Test3",
        },
        {
            description: "Short Product Description4",
            id: "7567ec4b-b10c-48c5-9345-fc73348a80a1",
            price: 15,
            title: "Test4",
        },
        {
            description: "Short Product Descriptio1",
            id: "7567ec4b-b10c-48c5-9445-fc73c48a80a2",
            price: 23,
            title: "Test5",
        },
        {
            description: "Short Product Description7",
            id: "7567ec4b-b10c-45c5-9345-fc73c48a80a1",
            price: 15,
            title: "Test6",
        },
        {
            description: "Short Product Description7",
            id: "7567ec4b-b10c-45c5-9345-fc73c48a80a1",
            price: 15,
            title: "Test7",
        },
        {
            description: "Short Product Description7",
            id: "7567ec4b-b10c-45c5-9345-fc73c48a80a1",
            price: 15,
            title: "Test8",
        },
        {
            description: "Short Product Description7",
            id: "7567ec4b-b10c-45c5-9345-fc73c48a80a1",
            price: 15,
            title: "Test9",
        },
        {
            description: "Short Product Description7",
            id: "7567ec4b-b10c-45c5-9345-fc73c48a80a1",
            price: 15,
            title: "Test10",
        },
        {
            description: "Short Product Description7",
            id: "7567ec4b-b10c-45c5-9345-fc73c48a80a1",
            price: 15,
            title: "Test11",
        },
        {
            description: "Short Product Description7",
            id: "7567ec4b-b10c-45c5-9345-fc73c48a80a1",
            price: 15,
            title: "Test12",
        },
    ];

    async getProducts() {
        return this.mockProducts;
    }

    async getProduct(id: string) {
        const product = await this.mockProducts.find((item) => item.id === id);
        if (!product) {
            throw new Error('The product not found');
        }
        return product;
    }
    
}