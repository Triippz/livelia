import { Injectable } from '@nestjs/common';
import { User } from '../models/user.entity';
import { plainToInstance } from 'class-transformer';
import { CreateUserDto, UpdateUserDto } from '@livelia/dtos';
import DatabaseService from '../../../processors/database/database.service';
import { MaybeType } from '../../../types/maybe.type';
import { snakeCase } from '../../../utils/string.utils';


@Injectable()
export class UserRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findById(id: number): Promise<MaybeType<User>> {
    const maybeUser = await this.databaseService.runQuery(
      `SELECT u.*, ar.role_name as role
       FROM ${User.tableName()} u
                JOIN roles ar on u.role_id = ar.id
       WHERE u.id = $1`,
      [id],
    );

    return plainToInstance(User, maybeUser.rows[0]);
  }

  async findAll(): Promise<User[]> {
    const allUsers = await this.databaseService.runQuery(
      `SELECT *
       FROM ${User.tableName}`,
    );
    return plainToInstance(User, allUsers.rows);
  }

  // Find All with limit and offset
  async findAllWithLimitAndOffset(
    limit: number,
    offset: number,
  ): Promise<User[]> {
    const allUsers = await this.databaseService.runQuery(
      `SELECT *
       FROM ${User.tableName}
       LIMIT $1 OFFSET $2`,
      [limit, offset],
    );
    return plainToInstance(User, allUsers.rows);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = await this.databaseService.runQuery(
      `INSERT INTO ${User.tableName} (first_name, last_name, email, password)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [
        createUserDto.firstName,
        createUserDto.lastName,
        createUserDto.email.toLowerCase(),
        createUserDto.password,
      ],
    );

    return plainToInstance(User, createdUser.rows[0]);
  }

  // delete
  async delete(id: number): Promise<void> {
    await this.databaseService.runQuery(
      `DELETE
       FROM ${User.tableName}
       WHERE id = $1`,
      [id],
    );
  }

  async findByEmail(email: string): Promise<MaybeType<User>> {
    // DO the above with case insensitivity
    const maybeUser = await this.databaseService.runQuery(
      `SELECT u.*, ar.role_name as role
       FROM ${User.tableName} u
                JOIN roles ar on u.role_id = ar.id
       WHERE LOWER(email) = LOWER($1)`,
      [email],
    );
    return plainToInstance(User, maybeUser.rows[0]);
  }

  async updateEmail(id: number, email: string) {
    await this.databaseService.runQuery(
      `UPDATE ${User.tableName}
       SET email = $1
       WHERE id = $2`,
      [email, id],
    );
  }

  updateLastLogin(id: number) {
    return this.databaseService.runQuery(
      `UPDATE ${User.tableName}
       SET last_login_timestamp = NOW()
       WHERE id = $1`,
      [id],
    );
  }

  async activateUser(id: number): Promise<User> {
    const user = await this.databaseService.runQuery(
      `UPDATE ${User.tableName}
       SET is_active = TRUE
       WHERE id = $1
       RETURNING *`,
      [id],
    );

    return plainToInstance(User, user.rows[0]);
  }

  async patchUpdate(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    // Do the above but snake case the column names
    const query = `UPDATE ${User.tableName}
                   SET ${Object.keys(updateUserDto)
                     .map((key, index) => `${snakeCase(key)} = $${index + 1}`)
                     .join(', ')}
                   WHERE id = $${Object.keys(updateUserDto).length + 1}
        RETURNING *`;
    const updatedUser = await this.databaseService.runQuery(query, [
      ...Object.values(updateUserDto),
      id,
    ]);

    return plainToInstance(User, updatedUser.rows[0]);
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.databaseService.runQuery(
      `SELECT *
       FROM ${User.tableName}
       WHERE username = $1`,
      [username],
    );

    return plainToInstance(User, user.rows[0]);
  }
}
