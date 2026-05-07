import ContactModel from "../../models/contact";
import { CreateContactDTO, UpdateContactDTO } from "./contact.types";

export const ContactService = {
    async createContact(data: CreateContactDTO) {
        const contact = new ContactModel(data);
        return await contact.save();
    },

    async getAllContacts() {
        return await ContactModel.find();
    },

    async getContactsByCreator(
        creatorId: string, 
        page: number = 1, 
        limit: number = 10, 
        search: string = ""
    ) {
        const skip = (page - 1) * limit;
        
        // Create search filter
        const query: any = { createdBy: creatorId };
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { phone: { $regex: search, $options: "i" } },
                { contactId: { $regex: search, $options: "i" } },
            ];
        }

        const contacts = await ContactModel.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await ContactModel.countDocuments(query);

        return {
            contacts,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    },

    async getContactById(id: string) {
        return await ContactModel.findById(id);
    },

    async filterContactByCreatorAndContactId(contactId: string, creatorId: string) {
        return await ContactModel.findOne({
            contactId: contactId,
            createdBy: creatorId
        });
    },

    async updateContact(id: string, data: UpdateContactDTO) {
        return await ContactModel.findByIdAndUpdate(id, data, { new: true });
    },

    async deleteContact(id: string) {
        return await ContactModel.findByIdAndDelete(id);
    },
};
