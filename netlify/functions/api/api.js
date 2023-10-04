/* eslint-disable no-void */
import ServerlessHttp from "serverless-http";
import express, { Router } from "express";
import { isAuthorized } from "@tinacms/auth";
import { createMediaHandler } from "next-tinacms-cloudinary/dist/handlers";

const app = express();
const router = Router();

export const tinaField = (object, property, index) => {
  let _a, _b, _c;
  if (object._content_source) {
    if (!property) {
      return [
        (_a = object._content_source) == null ? void 0 : _a.queryId,
        object._content_source.path.join("."),
      ].join("---");
    }
    if (typeof index === "number") {
      return [
        (_b = object._content_source) == null ? void 0 : _b.queryId,
        [...object._content_source.path, property, index].join("."),
      ].join("---");
    }
    return [
      (_c = object._content_source) == null ? void 0 : _c.queryId,
      [...object._content_source.path, property].join("."),
    ].join("---");
  }
  return "";
};

const mediaHandler = createMediaHandler({
  cloud_name: process.env.NUXT_CLOUDINARY_CLOUD_NAME || "",
  api_key: process.env.NUXT_CLOUDINARY_API_KEY || "",
  api_secret: process.env.NUXT_CLOUDINARY_API_SECRET || "",
  authorized: async (req, _res) => {
    try {
      if (process.env.NODE_ENV === "development") {
        return true;
      }

      const user = await isAuthorized(req);

      return user && user.verified;
    } catch (e) {
      console.error(e);
      return false;
    }
  },
});

router.get("/cloudinary/media", mediaHandler);

router.post("/cloudinary/media", mediaHandler);

router.delete("/cloudinary/media/:media", (req, res) => {
  req.query.media = ["media", req.params.media];
  return mediaHandler(req, res);
});

app.use("/api/", router);
app.use("/.netlify/functions/api/", router);

export const handler = ServerlessHttp(app);
