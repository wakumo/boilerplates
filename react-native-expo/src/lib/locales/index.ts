import { en } from './en';
import { ja } from './ja';

export const translations = {
  en,
  ja,
} as const;

export type Language = keyof typeof translations;
export type TranslationKeys = keyof typeof translations.en;

// Helper type to get nested translation keys
export type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

export type TranslationPath = NestedKeyOf<typeof translations.en>;

export { en, ja };
