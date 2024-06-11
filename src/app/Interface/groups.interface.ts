export interface Igroup {
    id: string
    groupId: number
    groupName: string
    members: IMember[]
    createdDate: string
  }
  
  export interface IMember {
    memberName: string
    userEmailId: string
    paid?: boolean
  }