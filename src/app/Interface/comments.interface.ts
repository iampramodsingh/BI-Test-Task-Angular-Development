export interface Icomments {
    id: string
    commentId: number
    transactionId: number
    comment: string
    commentedBy: CommentedBy
    createdDate: string
  }
  
  export interface CommentedBy {
    memberName: string
    userEmailId: string
  }