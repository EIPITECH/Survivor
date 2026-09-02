import { Controller, Get } from '@nestjs/common';
import {
    HealthCheckService,
    HttpHealthIndicator,
    TypeOrmHealthIndicator,
    HealthCheck
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private db: TypeOrmHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      async () => this.http.pingCheck('Astro', 'http://frontend:4321'),
      async () => this.db.pingCheck('PostgreSQL'),
      // Add tile service onec it's done
    ]);
  }
}
