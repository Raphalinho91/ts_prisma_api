export interface SignUpRequest {
  email: string;
  password: string;
  name: string;
}

export interface SignUpReply {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LogInRequest {
  email: string;
  password: string;
}

export interface LogInReply {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  token: string;
}
