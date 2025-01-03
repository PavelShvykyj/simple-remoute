import { ClaudGood, DocumentRecordGood } from "./good-model"

interface BaseVisit {
  id: string,
  comment: string,
  contract: string,
  street: string,
  confirmedStreet: string,
  house: string,
  flat: string,
}

export interface Visit extends BaseVisit {
  docDate: Date,
}

export interface CloudVisit extends BaseVisit{
  docDate: number,
  goods: {[key: string]: ClaudGood}
}

export interface FormVisit extends BaseVisit {
  docDate: Date,
  goods: Record<string, DocumentRecordGood>
}
