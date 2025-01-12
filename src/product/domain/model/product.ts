type ProductModelProps = {
    id?: number;
    name?: string;
    description?: string;
    price?: number;
    stock?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export class ProductModel {
    id?: number;
    name?: string;
    description?: string;
    price?: number;
    stock?: number;
    createdAt?: Date;
    updatedAt?: Date;

    constructor(props: ProductModelProps) {
        this.id = props.id;
        this.name = props.name;
        this.description = props.description;
        this.price = props.price;
        this.stock = props.stock;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
    }

    decreaseStock(amount: number) {
        this.checkAmount(amount);
        this.checkStock(amount);
        this.stock -= amount;
    }

    checkStock(amount: number) {
        if (this.stock < amount) {
            throw new Error('Not enough stock');
        }
    }

    checkAmount(amount: number) {
        if (amount <= 0) {
            throw new Error('Invalid amount');
        }
    }
}