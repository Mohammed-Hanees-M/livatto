import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    UseGuards,
} from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { CreateScheduleDto, UpdateScheduleDto } from './dto/schedule.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('schedules')
@UseGuards(JwtAuthGuard)
export class SchedulesController {
    constructor(private readonly schedulesService: SchedulesService) { }

    @Post()
    create(@Body() createScheduleDto: CreateScheduleDto) {
        return this.schedulesService.create(createScheduleDto);
    }

    @Get()
    findAll() {
        return this.schedulesService.findAll();
    }

    @Get('upcoming')
    findUpcoming() {
        return this.schedulesService.findUpcoming();
    }

    @Get('active')
    findActive() {
        return this.schedulesService.findActive();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.schedulesService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateScheduleDto: UpdateScheduleDto) {
        return this.schedulesService.update(id, updateScheduleDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.schedulesService.remove(id);
    }
}
