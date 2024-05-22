import { Controller, Get } from '@nestjs/common';
import { UserService } from '../services/user.service';


@Controller("users/v1")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers() {
    return "Hello"
  }
}
