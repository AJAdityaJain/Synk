import { MergeKey } from "src/services/crypto.services";

export class User
{
    uid = "";
    username = "";
    status = "";
    email = "";
    hash = "";
    encryptedKey = "";
    pfp = "";
    publicKey: MergeKey = new MergeKey;
}
