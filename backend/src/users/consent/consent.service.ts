import {Injectable, NotFoundException} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Consent } from './entities/consent.entity';
import { User } from '../entities/user.entity';
import { CreateConsentDto } from './dto/create-consent.dto';

@Injectable()
export class ConsentsService {
  constructor(
    @InjectRepository(Consent)
    private consentRepo: Repository<Consent>,

    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async createGeolocationConsent(
    userId: number,
    dto: CreateConsentDto,
  ) {
    const user = await this.userRepo.findOneBy({
      id: userId,
    });

    if (!user) {
      throw new NotFoundException(
        'Utilisateur introuvable',
      );
    }

    const consent = new Consent();

    consent.type = 'geolocation';
    consent.granted = dto.granted;
    consent.noticeVersion = '1.0';
    consent.user = user;

    const savedConsent =
      await this.consentRepo.save(consent);

    return {
      id: savedConsent.id,
      type: savedConsent.type,
      granted: savedConsent.granted,
      noticeVersion: savedConsent.noticeVersion,
      createdAt: savedConsent.createdAt,
    };
  }

  async findByUserId(userId: number) {
    return this.consentRepo.find({
      where: {
        user: {
          id: userId,
        },
      },

      select: {
        id: true,
        type: true,
        granted: true,
        noticeVersion: true,
        createdAt: true,
      },

      order: {
        createdAt: 'ASC',
      },
    });
  }
}
