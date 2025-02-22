import { Product } from 'src/types/product';

export function replaceTemplate(card: string, product: Product) {
  let output = card.replace(/{%PRODUCT_ID%}/g, String(product.id));
  output = output.replace(/{%PRODUCT_NAME%}/g, product.productName);
  output = output.replace(/{%PRODUCT_DESCRIPTION%}/g, product.description);
  output = output.replace(/{%PRODUCT_IMAGE%}/g, product.image);
  output = output.replace(/{%PRODUCT_FROM%}/g, product.from);
  output = output.replace(/{%PRODUCT_NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%PRODUCT_PRICE%}/g, String(product.price));
  output = output.replace(/{%PRODUCT_QUANTITY%}/g, String(product.quantity));
  if (!product.organic) output = output.replace(/{%PRODUCT_NOT_ORGANIC%}/g, 'not-organic');

  return output;
}
