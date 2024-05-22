import {
    Injectable,
    CanActivate,
    ExecutionContext,
} from '@nestjs/common';
import DatabaseService from '../../../processors/database/database.service';

@Injectable()
export class ActiveUserGuard implements CanActivate {
    constructor(
        private readonly databaseService: DatabaseService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const { user } = context.switchToHttp().getRequest();

        const maybeUser = await this.databaseService.runQuery(
            'SELECT * FROM users WHERE id = $1',
            [user.id],
        );

        return Boolean(maybeUser.rows[0]);
    }
}
