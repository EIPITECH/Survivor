import { Controller, Get, Patch, Param, ParseIntPipe, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiParam, ApiOkResponse } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { NotifsService } from './notifs.service';

@ApiTags('notifications')
@ApiBearerAuth('accessToken')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotifsController {

    constructor(
        private readonly notificationsService:
            NotifsService,
    ) {}

    @Get()
    @ApiOperation({ summary: 'Récupère les notifications de l\'utilisateur connecté' })
    @ApiOkResponse({ description: 'Liste des notifications' })
    findMine(
        @Request() req: any,
    ) {
        return this.notificationsService.findMine(
            req.user.userId,
        );
    }

    @Get('unread-count')
    @ApiOperation({ summary: 'Récupère le nombre de notifications non lues' })
    @ApiOkResponse({ description: 'Nombre de notifications non lues' })
    unreadCount(
        @Request() req: any,
    ) {
        return this.notificationsService.unreadCount(
            req.user.userId,
        );
    }

    @Patch('read-all')
    @ApiOperation({ summary: 'Marque toutes les notifications comme lues' })
    @ApiOkResponse({ description: 'Notifications marquées comme lues' })
    markAllAsRead(
        @Request() req: any,
    ) {
        return this.notificationsService.markAllAsRead(
            req.user.userId,
        );
    }

    @Patch(':id/read')
    @ApiOperation({ summary: 'Marque une notification comme lue' })
    @ApiParam({ name: 'id', description: 'ID de la notification', example: 1 })
    @ApiOkResponse({ description: 'Notification marquée comme lue' })
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
