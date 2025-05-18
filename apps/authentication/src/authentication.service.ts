import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '@app/core/user/schemas/user.schema';
import { CreateUserDto } from '@app/core/user/dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthenticationService {
  private readonly logger = new Logger(AuthenticationService.name);
  private inMemoryUsers: any[] = []; // Fallback storage
  private useInMemoryStore = false;

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) {
    // Check MongoDB connection
    this.checkMongoDBConnection();
  }

  private async checkMongoDBConnection() {
    try {
      await this.userModel.db.db.admin().ping();
      this.logger.log('MongoDB connection successful');
      this.useInMemoryStore = false;
    } catch (error) {
      this.logger.error(`MongoDB connection failed: ${error.message}. Using in-memory store as fallback.`);
      this.useInMemoryStore = true;
    }
  }

  async register(createUserDto: CreateUserDto) {
    this.logger.log(`Registering user: ${createUserDto.email}`);
    
    try {
      // Recheck connection state
      if (this.useInMemoryStore) {
        await this.checkMongoDBConnection();
      }

      if (this.useInMemoryStore) {
        // Use in-memory storage as fallback
        const existingUser = this.inMemoryUsers.find(user => user.email === createUserDto.email);
        if (existingUser) {
          throw new Error('User with this email already exists');
        }
        
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        
        const newUser = {
          id: this.inMemoryUsers.length + 1,
          email: createUserDto.email,
          username: createUserDto.username,
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        this.inMemoryUsers.push(newUser);
        this.logger.log(`User registered successfully in memory: ${newUser.email}`);
        
        // Return user without password
        const { password, ...result } = newUser;
        return result;
      } else {
        // Use MongoDB
        // Check if user already exists
        const existingUser = await this.userModel.findOne({ email: createUserDto.email }).exec();
        if (existingUser) {
          throw new Error('User with this email already exists');
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        
        // Create new user
        const newUser = new this.userModel({
          email: createUserDto.email,
          username: createUserDto.username,
          password: hashedPassword,
        });
        
        // Save user to database
        const savedUser = await newUser.save();
        this.logger.log(`User registered successfully in MongoDB: ${savedUser.email}`);
        
        return savedUser;
      }
    } catch (error) {
      this.logger.error(`Failed to register user: ${error.message}`);
      throw new InternalServerErrorException(`Failed to register user: ${error.message}`);
    }
  }

  async findAll() {
    this.logger.log('Getting all users');
    
    try {
      // Recheck connection state
      if (this.useInMemoryStore) {
        await this.checkMongoDBConnection();
      }

      if (this.useInMemoryStore) {
        // Return in-memory users without passwords
        return this.inMemoryUsers.map(user => {
          const { password, ...result } = user;
          return result;
        });
      } else {
        // Use MongoDB
        const users = await this.userModel.find().exec();
        return users.map(user => {
          const userObject = user.toObject();
          delete userObject.__v;
          delete userObject.id;
          return userObject;
        });
      }
    } catch (error) {
      this.logger.error(`Failed to get users: ${error.message}`);
      throw new InternalServerErrorException(`Failed to get users: ${error.message}`);
    }
  }
} 