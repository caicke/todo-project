import { randomUUID } from "crypto";

export class Todo {
    id: string;
    title: string;
    description: string;
    isCompleted: boolean;
    lastUpdatedAt: string;
    userId: string;

    /**
     *
     */
    constructor(title, description, userId) {
        this.id = randomUUID()
        this.title = title,
            this.description = description,
            this.userId = userId,
            this.isCompleted = false,
            this.lastUpdatedAt = new Date().toUTCString()
    }
}
