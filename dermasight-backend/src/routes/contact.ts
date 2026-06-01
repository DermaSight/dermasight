import { Router } from "express";
import ContactController from "@/controllers/Contact";
import validate from "@/middlewares/validate";
import { contactSchema } from "@/schemas/contact";

const contactRouter = Router();

contactRouter.post("/", validate(contactSchema, "body"), ContactController.send);

export default contactRouter;
