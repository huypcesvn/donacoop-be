import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

// define an annotation named @SkipAuth()
export const SkipAuth = () => SetMetadata(IS_PUBLIC_KEY, true);
