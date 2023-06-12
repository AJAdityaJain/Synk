import { MergeKey } from "src/services/crypto.services";

export class Message
{
    uid :string = "";
    cuid:string = "";
    gid:string|undefined = undefined;
    message:string = "";
    key!: MergeKey;
    created:Date = new Date(0);
    createdS:string ="";
    isDeleted = false;
    isSender = false ;
    isRead = false ;

    date:string|undefined = undefined;
}
