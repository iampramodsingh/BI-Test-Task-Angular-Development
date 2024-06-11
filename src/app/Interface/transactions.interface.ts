export interface Itransactions {
    groupId: string
    transactionName: string
    initiatedBy: InitiatedBy
    amount: number
    membersOfTransaction: MembersOfTransaction[]
    upiId: string
    createdDate: string
    transactionId: string
  }
  
  export interface InitiatedBy {
    memberName: string
    userEmailId: string
  }
  
  export interface MembersOfTransaction {
    memberName: string
    userEmailId: string
    paid: boolean
  }