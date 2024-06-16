export class SignupInfo {
  username: string;
  role: string[];
  password: string;

  constructor(username: string, password: string, role: string[]){
    this.username = username;
    this.role = role;
    this.password = password;
  }
}
