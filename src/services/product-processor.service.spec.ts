import { describe, it, expect, beforeEach } from "vitest";
import { mockDeep, type DeepMockProxy } from "vitest-mock-extended";
import { ProductProcessorService } from "./product-processor.service.js";
import { ProductService } from "./impl/product.service.js";
import { type Product } from "@/db/schema.js";

describe("ProductProcessorService", () => {
  let serviceMock: DeepMockProxy<ProductService>;
  let processor: ProductProcessorService;

  beforeEach(() => {
    serviceMock = mockDeep<ProductService>();
    processor = new ProductProcessorService(serviceMock);
  });

  it("should update NORMAL product if in stock", async () => {
    const product: Product = {
      id: 1,
      available: 2,
      leadTime: 5,
      name: "Notebook",
      type: "NORMAL",
      expiryDate: null,
      seasonStartDate: null,
      seasonEndDate: null,
    };

    await processor.process(product);

    expect(product.available).toBe(1);
    expect(serviceMock.updateProduct).toHaveBeenCalledWith(product);
  });

  it("should notify delay for NORMAL out of stock", async () => {
    const product: Product = {
      id: 2,
      available: 0,
      leadTime: 7,
      name: "Mouse",
      type: "NORMAL",
      expiryDate: null,
      seasonStartDate: null,
      seasonEndDate: null,
    };

    await processor.process(product);

    expect(serviceMock.notifyDelay).toHaveBeenCalledWith(7, product);
  });

  it("should call handleSeasonalProduct for SEASONAL product", async () => {
    const product = {
      id: 3,
      available: 10,
      leadTime: 10,
      name: "Melon",
      type: "SEASONAL",
      seasonStartDate: new Date(),
      seasonEndDate: new Date(),
      expiryDate: null,
    } as Product;

    await processor.process(product);
    expect(serviceMock.handleSeasonalProduct).toHaveBeenCalledWith(product);
  });

  it("should call handleExpiredProduct for EXPIRABLE product", async () => {
    const product = {
      id: 4,
      available: 10,
      leadTime: 10,
      name: "Yogurt",
      type: "EXPIRABLE",
      expiryDate: new Date(),
      seasonStartDate: null,
      seasonEndDate: null,
    } as Product;

    await processor.process(product);
    expect(serviceMock.handleExpiredProduct).toHaveBeenCalledWith(product);
  });
});
