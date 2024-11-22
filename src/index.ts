// Documentation: https://sdk.netlify.com
import { NetlifyExtension } from "@netlify/sdk";
import { makeConnectSettings } from "./schema/settings-schema";


const extension = new NetlifyExtension();
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


class ProductApiClient {
  API: string;
  constructor() {
    this.API = `https://legacy-api.netlify.app/.netlify/functions/getData`;
  }
  async getStores() {
    let apiUrl = this.API;
    const res = await fetch(apiUrl);
    const data = await res.json();
    return data;
  }

}


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

connector.sync(async ({ models, state }) => {
  const data = await state.client.getStores({});

  data.forEach((product: { id: any; }) => {
    models.Product.insert({
      ...product,
      _createdAt: new Date().toISOString(),
      _status: `published`,
      contentId: product.id,
    });
  });
});

//
export { extension };
