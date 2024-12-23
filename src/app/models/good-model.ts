  export interface Good {
    id: string,
    updatedAt: number,
    parentid: string,
    name: string,
    isFolder: boolean,
    price?: number,
    rest?: number
  }
