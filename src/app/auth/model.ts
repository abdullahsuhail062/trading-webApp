
export interface LoginPayload {

email: string;

password: string;

}


export interface RegisterPayload {

name: string;

email: string;

password: string;

}


export interface AuthResponse {

user: {

id: number;

name: string;

email: string;

createdAt: string;

updatedAt: string;

avatar: string;

isAdmin: boolean;

role: string;

}

} 