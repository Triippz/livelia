import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { UserRepository } from '../repositories/user.repository';
import { MaybeType } from '../../../types/maybe.type';
import { User } from '@livelia/entities';
import { CreateUserDtoType } from '@livelia/dtos';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findByEmail(email: string): Promise<MaybeType<User>> {
    return this.userRepository.findByEmail(email);
  }

  async findById(id: number): Promise<MaybeType<User>> {
    return this.userRepository.findById(id);
  }

  async create(createUserDto: CreateUserDtoType) {
    createUserDto.password = await hash(createUserDto.password, 10);
    // createUserDto.confirmEmailToken = await this.generateActivationCode();
    return this.userRepository.create(createUserDto);
  }

  async updateEmail(id: number, email: string): Promise<void> {
    return this.userRepository.updateEmail(id, email);
  }

  async validateUserPassword(id: number, password: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new UnauthorizedException('Invalid user');
    }

    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid username or password');
    }

    return user;
  }


  async validateUsernameAndPassword(
    username: string,
    password: string,
  ): Promise<User> {
    const user = await this.userRepository.findByUsername(username);
    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid username or password');
    }

    return user;
  }

  async recordFootstep(userId: number, ip: string) {
    return this.userRepository.recordFootstep(userId, ip);
  }

  async updatePassword(id: number, password: string) {
    const hashedPassword = await hash(password, 10);
    return this.userRepository.updatePassword(id, hashedPassword);
  }

  async checkUsername(username: string) {
    const user = await this.userRepository.findByUsername(username);
    return !!user;
  }
}
