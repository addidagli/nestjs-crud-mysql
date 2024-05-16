import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { CreateUserDto } from '../../dtos/CreateUser.dto';
import { UsersService } from '../../services/users/users.service';
import { User } from 'src/entities/User';
import { UpdateUserDto } from 'src/users/dtos/UpdateUser.dto';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) { }

  @Get()
  async getUsers(): Promise<User[]> {
    return await this.userService.getAllUsers();
  }

  @Get(':id')
  async getUserById(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return await this.userService.getUserById(id);
  }

  @Post('create')
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.userService.createUser(createUserDto);
  }

  @Put('update/:id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return await this.userService.updateUser(id, updateUserDto);
  }

  @Delete('delete/:id')
  async deleteUserById(@Param('id', ParseIntPipe) id: number): Promise<string> {
    const response = await this.userService.deleteUser(id);
    return response;
  }
}
