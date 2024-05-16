import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../entities/User';
import { CreateUserDto } from 'src/users/dtos/CreateUser.dto';
import { UpdateUserDto } from 'src/users/dtos/UpdateUser.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) { }

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id, }, });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const validationErrors = this.validateData(createUserDto);
    if (validationErrors) {
      throw new HttpException(validationErrors, HttpStatus.BAD_REQUEST);
    }

    const newUser = this.userRepository.create({
      ...createUserDto,
      createdAt: new Date(),
      updatedAt: null,
    });
    return await this.userRepository.save(newUser);
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    const validationErrors = this.validateData(updateUserDto);
    if (validationErrors) {
      throw new HttpException(validationErrors, HttpStatus.BAD_REQUEST);
    }

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }


    // Update only the properties provided in updateUserDto
    Object.assign(user, updateUserDto);
    // Güncelleme zamanını belirt
    user.updatedAt = new Date();

    return await this.userRepository.save(user);
  }

  async deleteUser(id: number): Promise<string> {
    const user = await this.userRepository.findOne({ where: { id, }, });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    await this.userRepository.delete(id);
    return 'User Deleted';
  }

  private validateEmail(email: string): string {
    if (!email || !email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      return 'Invalid email format';
    }
    return '';
  }

  private validateData(userDto: CreateUserDto | UpdateUserDto): string {
    let errors = '';

    // Validate email format
    const emailError = this.validateEmail(userDto.email);
    if (emailError) {
      errors = emailError;
    }

    // Validate password length
    if (userDto.password.length < 6) {
      errors = 'Password length must be at least 6 characters\n';
    }

    // Validate display name length
    if (userDto.name.length < 2) {
      errors = 'Name length must be between more than 2 characters\n';
    }

    // Check if email already exists for create operation
    if (userDto instanceof CreateUserDto) {
      const existingUser = this.userRepository.findOne({ where: { email: userDto.email, }, });
      if (existingUser) {
        errors = 'Email already exists';
      }
    }

    return errors;
  }
}
