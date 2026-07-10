import { Injectable } from '@nestjs/common';
import { treeifyError } from 'zod';
import { type Env, envSchema } from './env.schema';

@Injectable()
export class EnvService {
	private readonly env: Env;

	constructor() {
		const result = envSchema.safeParse(process.env);
		if (!result.success) {
			console.error('Invalid environment variables:', treeifyError(result.error).errors);
			throw new Error('Invalid environment variables');
		}
		this.env = result.data;
	}

	get<K extends keyof Env>(key: K): Env[K] {
		return this.env[key];
	}
}
