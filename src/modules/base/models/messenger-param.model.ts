import { MessengerType } from "./messenger-type.enum";

export default class MessengerParamModel {
    title = "";
    message = "";
    type: MessengerType = MessengerType.Info;
    buttonOkTitle? = "";
    buttonCancelTitle? = "";
    callback?: ((isConfirm: boolean) => void) = undefined;
}