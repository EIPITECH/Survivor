import { Controller, Get, Patch, Param, ParseIntPipe, Request, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { NotifsService } from './notifs.service';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotifsController {

    constructor(
        private readonly notificationsService:
            NotifsService,
    ) {}

    @Get()
    findMine(
        @Request() req: any,
    ) {
        return this.notificationsService.findMine(
            req.user.userId,
        );
    }

    @Get('unread-count')
    unreadCount(
        @Request() req: any,
    ) {
        return this.notificationsService.unreadCount(
            req.user.userId,
        );
    }

    @Patch('read-all')
    markAllAsRead(
        @Request() req: any,
    ) {
        return this.notificationsService.markAllAsRead(
            req.user.userId,
        );
    }

    @Patch(':id/read')
    markAsRead(
        @Param(
            'id',
            ParseIntPipe,
        )
        id: number,

        @Request()
        req: any,
    ) {
        return this.notificationsService.markAsRead(
            req.user.userId,
            id,
        );
    }
}
