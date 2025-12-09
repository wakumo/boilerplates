import { UserProfile } from '@/types/user';

export async function getUserProfile(id: string): Promise<UserProfile | null> {
  return {
    id,
    username: 'test',
    full_name: 'Test User',
    email: 'test@test.com',
    phone_number: '1234567890',
    avatar_url: 'https://example.com/avatar.png',
    role: 'user',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  } as UserProfile;
}
