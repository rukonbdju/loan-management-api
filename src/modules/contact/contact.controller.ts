import { NextFunction, Request, Response } from "express";
import { ContactService } from "./contact.service";
import { parseError } from "../../utils/parseError";
import { AuthRequest } from "../../middlewares/auth.middleware";
import ContactModel from "../../models/contact";

export const ContactController = {
    async create(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const creatorId = req.userId;
            if (!creatorId) {
                return res.status(401).json({ success: false, message: 'User ID is not found' })
            }
            // 🤖 Auto-generate Contact ID if not provided
            let contactId = req?.body?.contactId;
            if (!contactId) {
                const count = await ContactModel.countDocuments({ createdBy: creatorId });
                contactId = `CON-${(count + 1).toString().padStart(4, '0')}`;
            }

            const isExist = await ContactService.filterContactByCreatorAndContactId(contactId, creatorId)
            if (isExist) {
                // 🚀 Collision detected! Use a high-resolution random suffix
                contactId = `CON-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
            }
            
            req.body.contactId = contactId;
            const phoneExist = await ContactModel.findOne({ phone: req.body.phone });
            if (phoneExist) {
                return res.status(400).json({ success: false, message: 'Phone number already exists!' })
            }
            const contact = await ContactService.createContact(req.body);
            res.status(201).json({ success: true, data: contact });
        } catch (error) {
            const parsedError = parseError(error)
            next(parsedError);
        }
    },

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const contacts = await ContactService.getAllContacts();
            res.json({ success: true, data: contacts });
        } catch (error) {
            const parsedError = parseError(error)
            next(parsedError);
        }
    },

    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const contact = await ContactService.getContactById(req.params.id);
            if (!contact) return res.status(404).json({ message: "Contact not found" });
            res.json({ success: true, data: contact });
        } catch (error) {
            const parsedError = parseError(error)
            next(parsedError);
        }
    },

    async getByCreator(req: Request, res: Response, next: NextFunction) {
        try {
            const { creatorId } = req.params;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const search = (req.query.search as string) || "";

            const result = await ContactService.getContactsByCreator(creatorId, page, limit, search);
            res.json({ success: true, ...result });
        } catch (error) {
            const parsedError = parseError(error)
            next(parsedError);
        }
    },

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const contact = await ContactService.updateContact(req.params.id, req.body);
            if (!contact) return res.status(404).json({ message: "Contact not found" });
            res.json({ success: true, data: contact });
        } catch (error) {
            const parsedError = parseError(error)
            next(parsedError);
        }
    },

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const contact = await ContactService.deleteContact(req.params.id);
            if (!contact) return res.status(404).json({ success: false, message: "Contact not found" });
            res.json({ success: true, message: "Contact deleted successfully" });
        } catch (error) {
            const parsedError = parseError(error)
            next(parsedError);
        }
    },
};
