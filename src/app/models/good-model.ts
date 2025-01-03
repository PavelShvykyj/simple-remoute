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

  export interface ClaudGood {
    goodId: string,
    quontity: number,
    price: number
  }

  export interface DocumentRecordGood {
    id: string, // todo: rename to goodId
    cloudId: string,
    docId: string | undefined | null,
    quontity: number,
    price?: number,
    total: number,
  }
