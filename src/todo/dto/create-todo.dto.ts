import { IsNotEmpty } from "class-validator";

export class CreateTodoDto {
    @IsNotEmpty({
        message: "Title should not be empty."
    })
    title: string;

    @IsNotEmpty({
        message: "Description should not be empty."
    })
    description: string;

    userId: string;
}
