import { ProductService } from "./impl/product.service.js";
import { type Product } from "@/db/schema.js";

export class ProductProcessorService {
  constructor(private readonly ps: ProductService) {}

  async process(p: Product): Promise<void> {
    switch (p.type) {
      case "NORMAL": {
        if (p.available > 0) {
          p.available -= 1;
          await this.ps.updateProduct(p);
        } else {
          await this.ps.notifyDelay(p.leadTime, p);
        }
        break;
      }

      case "SEASONAL": {
        await this.ps.handleSeasonalProduct(p);
        break;
      }

      case "EXPIRABLE": {
        await this.ps.handleExpiredProduct(p);
        break;
      }

      default:
        throw new Error(`Unhandled product type: ${p.type}`);
    }
  }
}
