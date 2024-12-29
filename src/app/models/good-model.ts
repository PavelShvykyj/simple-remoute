  export interface Good {
    id: string,
    updatedAt: number,
    parentid: string,
    name: string,
    isFolder: boolean,
    price?: number,
    rest?: number,
    normalizedName:string
  }

  export interface DocumentRecordGood {
    id: string,
    docId: string | undefined | null,
    quontity: number,
    price?: number,
    total: number,
  }
