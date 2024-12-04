// Documentation: https://sdk.netlify.com
import { NetlifyExtension } from "@netlify/sdk";
import { makeConnectSettings } from "./schema/settings-schema";

//Declare the extension
const extension = new NetlifyExtension();
//Declare the connector
const connector = extension.addConnector({
  typePrefix: "Stores",
  supports: {
    connect: true,
    visualEditor: false,
  },
  defineOptions({ zod }) {
    return makeConnectSettings(zod);
  },
  localDevOptions: {
    numberOfMockItems: 5,
  },
  initState: async ({ options }) => {
    const client = new ProductApiClient();
    return {
      client,
    };
  },

});

//Dynamic Connector Code Goes HERE:




// Create API Client
class ProductApiClient {
  API: string;
  constructor() {
    this.API = `https://fakestoreapi.com/products`;
  }
  async getStores() {
    let apiUrl = this.API;
    const res = await fetch(apiUrl);
    const data = await res.json();
    return data;
  }

}

//Create Model
connector.model(async ({ define }) => {
  define.document({
    name: `Product`,
    fields: {
      contentId: { type: `string` },
      title: { type: `string` },
      price: { type: `float` },
      description: { type: `string` },
      category: { type: `string` },
      image: { type: `string` },
    },
  });
});


let productIds: string[] = [];

//Sync your connector with API
connector.sync(async ({ models, state }) => {
  const currentProductIds: string[] = []
  const data = await state.client.getStores({});
  data.forEach((product: { id: any; }) => {
    currentProductIds.push(product.id)
    models.Product.insert({
      ...product,
      _createdAt: new Date().toISOString(),
      _status: `published`,
      contentId: product.id,
    });
  });

  productIds.forEach(id => { if (!currentProductIds.includes(id)) { models.Product.delete(id) } })

  productIds = currentProductIds;
});

export { extension };