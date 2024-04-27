export interface IUser {
  id: string;
  Nombre?: string;
  Edad?: string;
  Departamento?: string;
  Email?: string;
}

export interface IApiUploadFileResponse {
  message: string;
  data: IUser[];
}

export interface IApiSearchUsersResponse {
  data: IUser[];
}
