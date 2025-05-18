import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type UserDocument = User & Document;

@Schema({ 
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (_, ret) => {
      delete ret.password;
      return ret;
    }
  }
})
export class User {
  @ApiProperty({
    description: 'The email of the user',
    example: 'user@example.com',
  })
  @Prop({ required: true, unique: true })
  email: string;

  @ApiProperty({
    description: 'The username of the user',
    example: 'john_doe',
  })
  @Prop({ required: true })
  username: string;

  @ApiProperty({
    description: 'The hashed password of the user',
  })
  @Prop({ required: true })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User); 