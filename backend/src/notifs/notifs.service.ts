import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNotifDto } from './dto/create-notif.dto';
import { UpdateNotifDto } from './dto/update-notif.dto';
import { Notifs } from './entities/notif.entity';

@Injectable()
export class NotifsService 
{
  constructor(
        @InjectRepository(Notifs)
        private readonly notifsRepo: Repository<Notifs>,
    ) {}

  findMine(userId: number) 
  {
    return this.notifsRepo.find({
        where: {
            userId,
        },
        order: {
            createdAt: 'DESC',
        },
    });
  }

  async unreadCount(userId: number) 
  {
      const count = await this.notifsRepo.count({
          where: {
              userId,
              isRead: false,
          },
      });
      return { count };
   }

   async markAsRead(userId: number, notifsId: number) 
   {
      const notification = await this.notifsRepo.findOne({
        where: {
          id: notifsId,
          userId,
        },
      });

      if (!notification) {
        throw new NotFoundException('Notification introuvable');
      }
      if (!notification.isRead) {
        notification.isRead = true;
        await this.notifsRepo.save(notification);
      }
        return notification;
    }

    async markAllAsRead(userId: number) {
        await this.notifsRepo.update(
          {
            userId,
            isRead: false,
          },
          {
            isRead: true,
          },
        );
        return {
          success: true,
        };
    }
}
