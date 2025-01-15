export interface ITicketPayload {
    title : string;
    description ?: string | null ;
    user ?: string | null
    priority: 'low' | 'medium' | 'high';
}

export interface IUser {
    username:string;
    id:string;
    email ?:string;
    is_active?: boolean;
    permissions?:string[]
    is_superuser?:boolean
}

export interface ITicket {
    id: string;
    title: string;
    user : IUser;
    description: string;
    priority: "low" | "medium" | "high";
    status: "open" | "in_progress" | "resolved";
    created_at: string;
    updated_at: string;
  }
  