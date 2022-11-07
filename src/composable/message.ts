import { MessengerType } from "@/modules/base/models/messenger-type.enum";

const MESSAGES = {
  CREATE_FAIL: "popup_create_fail_title",
  EDIT_FAIL: "popup_edit_fail_title",
  DELETE_FAIL: "popup_delete_fail_lbl_title",
  CREATE_SUCCESS: "common_msg_create_successfully",
  EDIT_SUCCESS: "common_msg_edit_successfully",
  DELETE_SUCCESS: "common_msg_delete_successfully",
  DELETE_MULTI_SUCCESS: "common_msg_delete_multiple_successfully",
  CONFIRM: "common_confirm"
};
const handleMessager = (messenger, title, type, callback?): void => {
  messenger({
    title: title,
    message: "",
    type,
    callback: (isConfirm: boolean): void => {
      isConfirm;
      if (callback) callback();
    }
  });
};
const Messager = {
  confirmDelete: (messenger, callback): void =>
    messenger({
      title: MESSAGES.CONFIRM,
      message: "",
      type: MessengerType.Confirm,
      buttonOkTitle: "btn_delete",
      callback: async (isConfirm: boolean): Promise<void> => {
        if (!isConfirm) {
          return;
        }
        callback();
      }
    }),
  error: {
    create: (messenger): void =>
      handleMessager(messenger, MESSAGES.CREATE_FAIL, MessengerType.Error),
    update: (messenger): void =>
      handleMessager(messenger, MESSAGES.EDIT_FAIL, MessengerType.Error),
    delete: (messenger): void =>
      handleMessager(messenger, MESSAGES.DELETE_FAIL, MessengerType.Error),
    custom: (messenger, title): void =>
      handleMessager(messenger, title, MessengerType.Error)
  },
  success: {
    create: (messenger): void =>
      handleMessager(messenger, MESSAGES.CREATE_SUCCESS, MessengerType.Success),
    update: (messenger): void =>
      handleMessager(messenger, MESSAGES.EDIT_SUCCESS, MessengerType.Success),
    delete: (messenger, callback?: () => void): void =>
      handleMessager(
        messenger,
        MESSAGES.DELETE_SUCCESS,
        MessengerType.Success,
        callback
      ),
    custom: (messenger, title): void =>
      handleMessager(messenger, title, MessengerType.Success)
  }
};
export default Messager;
