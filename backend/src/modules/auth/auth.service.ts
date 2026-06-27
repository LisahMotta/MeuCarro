import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { AuthRepository } from './auth.repository';
import { RegisterDto, LoginDto } from './auth.dto';
import { User } from '../../shared/database/schema';

const repo = new AuthRepository();

function signAccessToken(user: User) {
  return jwt.sign(
    { id: user.id, email: user.email, plan: user.plan },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN as any }
  );
}

function signRefreshToken(userId: string) {
  return jwt.sign({ id: userId }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as any,
  });
}

function getRefreshExpiry(): Date {
  const days = parseInt(env.JWT_REFRESH_EXPIRES_IN.replace('d', ''));
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

export class AuthService {
  async register(dto: RegisterDto) {
    const existing = await repo.findByEmail(dto.email);
    if (existing) throw new Error('Email already in use');

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = await repo.create({ name: dto.name, email: dto.email, passwordHash });

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user.id);
    await repo.saveRefreshToken(user.id, refreshToken, getRefreshExpiry());

    return { user: this.sanitize(user), accessToken, refreshToken };
  }

  async login(dto: LoginDto) {
    const user = await repo.findByEmail(dto.email);
    if (!user) throw new Error('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new Error('Invalid credentials');

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user.id);
    await repo.saveRefreshToken(user.id, refreshToken, getRefreshExpiry());

    return { user: this.sanitize(user), accessToken, refreshToken };
  }

  async refresh(token: string) {
    const stored = await repo.findRefreshToken(token);
    if (!stored || stored.expiresAt < new Date()) {
      throw new Error('Invalid refresh token');
    }

    const payload = jwt.verify(token, env.JWT_REFRESH_SECRET) as { id: string };
    const user = await repo.findById(payload.id);
    if (!user) throw new Error('User not found');

    await repo.deleteRefreshToken(token);
    const newRefreshToken = signRefreshToken(user.id);
    await repo.saveRefreshToken(user.id, newRefreshToken, getRefreshExpiry());

    return {
      accessToken: signAccessToken(user),
      refreshToken: newRefreshToken,
    };
  }

  async logout(token: string) {
    await repo.deleteRefreshToken(token);
  }

  async getMe(userId: string) {
    const user = await repo.findById(userId);
    if (!user) throw new Error('User not found');
    return this.sanitize(user);
  }

  async updateProfile(userId: string, data: { name?: string; email?: string; currentPassword?: string; newPassword?: string }) {
    if (data.email) {
      const existing = await repo.findByEmail(data.email);
      if (existing && existing.id !== userId) throw new Error('Email already in use');
    }

    const updateData: { name?: string; email?: string; passwordHash?: string } = {};
    if (data.name) updateData.name = data.name;
    if (data.email) updateData.email = data.email;

    if (data.currentPassword && data.newPassword) {
      const user = await repo.findById(userId);
      if (!user) throw new Error('User not found');
      const valid = await bcrypt.compare(data.currentPassword, user.passwordHash);
      if (!valid) throw new Error('Invalid current password');
      updateData.passwordHash = await bcrypt.hash(data.newPassword, 12);
    }

    const user = await repo.update(userId, updateData);
    return this.sanitize(user);
  }

  private sanitize(user: User) {
    const { passwordHash: _, ...safe } = user;
    return safe;
  }
}
