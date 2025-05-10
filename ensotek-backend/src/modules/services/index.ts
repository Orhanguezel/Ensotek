// src/modules/services/index.ts
import express from "express";
import routes from "./services.routes";
import Service, { IService } from "./services.models";
import * as controller from "./services.controller";
import * as validation from "./services.validation";

const router = express.Router();
router.use("/", routes);

export { Service, IService, controller, validation };
export default router;

