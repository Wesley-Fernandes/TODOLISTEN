import { ObjectId } from "mongodb";
export const is_valid_id = (id: string) => {
  return ObjectId.isValid(id);
};
