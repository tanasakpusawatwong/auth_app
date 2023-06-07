import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";
import {
  IsEmail,
  IsNotEmpty,
  ValidationError,
  validateOrReject,
} from "class-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

@Entity({ name: "M_USERS" })
export class UserEntity {
  @PrimaryGeneratedColumn({
    type: "bigint",
  })
  id!: string;

  @Column({
    type: "varchar",
    unique: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @Column({
    type: "varchar",
    unique: true,
  })
  @IsNotEmpty()
  username!: string;

  @Column({
    type: "varchar",
  })
  @IsNotEmpty()
  password!: string;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.USER,
  })
  role!: UserRole;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }

  getSignedJwtToken() {
    return jwt.sign({ id: this.id }, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_EXPIRE,
    });
  }

  async validator() {
    await validateOrReject(this).catch((e: ValidationError[]) => {
      throw e[0];
    });
  }
}
