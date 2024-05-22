import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { CreateUserDto } from '@livelia/dtos';
import { UserRepository } from '../repositories/user.repository';
import { User } from '../models/user.entity';
import { MaybeType } from '../../../types/maybe.type';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findByEmail(email: string): Promise<MaybeType<User>> {
    return this.userRepository.findByEmail(email);
  }

  async findById(id: number): Promise<MaybeType<User>> {
    return this.userRepository.findById(id);
  }

  async create(createUserDto: CreateUserDto) {
    createUserDto.password = await hash(createUserDto.password, 10);
    // createUserDto.confirmEmailToken = await this.generateActivationCode();
    return this.userRepository.create(createUserDto);
  }

  async updateEmail(id: number, email: string): Promise<void> {
    return this.userRepository.updateEmail(id, email);
  }

  async validateEmailAndPassword(
    email: string,
    password: string,
  ): Promise<User> {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return user;
  }
}
