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
      () => this.db.pingCheck('PostgreSQL'),
      () => this.http.pingCheck('API',
        'http://backend:3000/api'
      ),
      () => this.http.pingCheck('IGN Géoplateforme',
        'https://data.geopf.fr/wmts?SERVICE=WMTS&REQUEST=GetCapabilities&VERSION=1.0.0',
      ),
    ]);
  }
}
