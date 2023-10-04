import { defineConfig } from "tinacms";

// Your hosting provider likely exposes this as an environment variable
const branch = process.env.HEAD || "master";

export default defineConfig({
  branch,
  clientId: process.env.NUXT_TINA_CLIENT_ID || "", // Get this from tina.io
  token: process.env.NUXT_TINA_TOKEN || "", // Get this from tina.io
  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    loadCustomStore: async () => {
      const pack = await import("next-tinacms-cloudinary");
      return pack.TinaCloudCloudinaryMediaStore;
    },
  },
  schema: {
    collections: [
      {
        name: "post",
        label: "Posts",
        path: "content",
        ui: {
          router: ({ document }) => {
            return `/posts/${document._sys.filename}`;
          },
          filename: {
            slugify: (values) => {
              const postDate = values.date ? new Date(values.date) : new Date();
              return `${postDate.toISOString().split("T")[0]}-${(
                values.slug || ""
              )
                .toLowerCase()
                .replace(/ /g, "-")}`.replace(/[^\w./-\s]/gi, "");
            },
          },
        },
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "slug",
            label: "Slug",
          },
          {
            type: "datetime",
            name: "date",
            label: "Date",
          },
          {
            type: "string",
            name: "author",
            label: "Author",
          },
          {
            type: "string",
            name: "excerpt",
            label: "Excerpt",
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
          },
        ],
      },
    ],
  },
});
